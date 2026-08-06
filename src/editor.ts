import { css, html, LitElement, nothing, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { EDITOR_TYPE } from './constants';
import { resolveEntities } from './entity-utils';
import type { CompactVehicleCardConfig, EntityRef, HomeAssistant, ResolvedEntities } from './types';

declare global {
  interface HTMLElementTagNameMap {
    'compact-vehicle-card-editor': CompactVehicleCardEditor;
  }
}

/** Flat form model — ha-form works best with a flat data object. */
interface FormData {
  name?: string;
  icon?: string;
  prefix?: string;
  engine_entity?: string;
  lock_entity?: string;
  odometer_entity?: string;
  range_entity?: string;
  fuel_level_entity?: string;
  fuel_amount_entity?: string;
  fuel_capacity_entity?: string;
  doors?: string[];
  windows?: string[];
  sunroof_entity?: string;
  tailgate_entity?: string;
  hood_entity?: string;
  tires?: string[];
  oil_level_entity?: string;
  brake_fluid_entity?: string;
  coolant_level_entity?: string;
  washer_fluid_entity?: string;
  mode?: string;
  auto_expand_maintenance?: boolean;
  show_section_icons?: boolean;
  unknown_value?: string;
  fuel_warn_percent?: number;
}

const SENSOR_DOMAINS = ['sensor', 'binary_sensor', 'cover', 'switch'];
const ENTITY = (domains: string[]) => ({ entity: { domain: domains } });
const MULTI_ENTITY = (domains: string[]) => ({ entity: { domain: domains, multiple: true } });

// Each section is rendered as its own ha-expansion-panel holding one or more
// small ha-forms. ha-form puts a fixed 24px gap between the rows of a single
// form and renders helper text tight against its field, and both live in its
// shadow root — splitting the schema into blocks is the only way to control
// the vertical rhythm from out here.
const PREFIX_SCHEMA = [{ name: 'prefix', selector: { text: {} } }];

const PREFIX_HELPER =
  'Entity ID prefix (e.g. volvo_xc60). The card auto-discovers matching entities; ' +
  'anything set under Custom Entities always wins.';

const GENERAL_SCHEMA = [
  { name: 'name', selector: { text: {} } },
  { name: 'icon', selector: { icon: {} } },
  {
    name: 'mode',
    required: true,
    selector: {
      select: {
        mode: 'dropdown',
        options: [
          { value: 'expandable', label: 'Expandable' },
          { value: 'expanded', label: 'Always expanded' },
          { value: 'compact', label: 'Compact (header only)' },
        ],
      },
    },
  },
];

const CUSTOM_ENTITIES_SCHEMA = [
  { name: 'engine_entity', selector: ENTITY(['binary_sensor', 'sensor', 'switch']) },
  { name: 'lock_entity', selector: ENTITY(['lock']) },
  { name: 'odometer_entity', selector: ENTITY(['sensor']) },
  { name: 'range_entity', selector: ENTITY(['sensor']) },
  { name: 'fuel_level_entity', selector: ENTITY(['sensor']) },
  { name: 'fuel_amount_entity', selector: ENTITY(['sensor']) },
  { name: 'fuel_capacity_entity', selector: ENTITY(['sensor']) },
  { name: 'doors', selector: MULTI_ENTITY(SENSOR_DOMAINS) },
  { name: 'windows', selector: MULTI_ENTITY(SENSOR_DOMAINS) },
  { name: 'sunroof_entity', selector: ENTITY(SENSOR_DOMAINS) },
  { name: 'tailgate_entity', selector: ENTITY(SENSOR_DOMAINS) },
  { name: 'hood_entity', selector: ENTITY(SENSOR_DOMAINS) },
  { name: 'tires', selector: MULTI_ENTITY(SENSOR_DOMAINS) },
  { name: 'oil_level_entity', selector: ENTITY(SENSOR_DOMAINS) },
  { name: 'brake_fluid_entity', selector: ENTITY(SENSOR_DOMAINS) },
  { name: 'coolant_level_entity', selector: ENTITY(SENSOR_DOMAINS) },
  { name: 'washer_fluid_entity', selector: ENTITY(SENSOR_DOMAINS) },
];

const AUTO_EXPAND_SCHEMA = [{ name: 'auto_expand_maintenance', selector: { boolean: {} } }];
const SHOW_ICONS_SCHEMA = [{ name: 'show_section_icons', selector: { boolean: {} } }];
const ADVANCED_VALUES_SCHEMA = [
  { name: 'unknown_value', selector: { text: {} } },
  { name: 'fuel_warn_percent', selector: { number: { min: 0, max: 100, mode: 'box' } } },
];

const LABELS: Record<string, string> = {
  general: 'General',
  custom_entities: 'Custom Entities',
  advanced: 'Advanced',
  name: 'Name',
  icon: 'Icon',
  prefix: 'Entity prefix',
  engine_entity: 'Engine entity',
  lock_entity: 'Lock entity',
  odometer_entity: 'Odometer',
  range_entity: 'Range',
  fuel_level_entity: 'Fuel level (%)',
  fuel_amount_entity: 'Fuel amount',
  fuel_capacity_entity: 'Fuel capacity',
  doors: 'Doors',
  windows: 'Windows',
  sunroof_entity: 'Sunroof',
  tailgate_entity: 'Tailgate',
  hood_entity: 'Hood',
  tires: 'Tires',
  oil_level_entity: 'Oil level',
  brake_fluid_entity: 'Brake fluid',
  coolant_level_entity: 'Coolant level',
  washer_fluid_entity: 'Washer fluid',
  mode: 'Display mode',
  auto_expand_maintenance: 'Auto-expand on maintenance warning',
  show_section_icons: 'Show row icons',
  unknown_value: 'Unknown value text',
  fuel_warn_percent: 'Low fuel threshold (%)',
};

/** Maps a form field to the resolved-entity slot that auto-discovery fills. */
const DISCOVERY_SLOTS: Record<string, keyof ResolvedEntities> = {
  engine_entity: 'engine',
  lock_entity: 'lock',
  odometer_entity: 'odometer',
  range_entity: 'range',
  fuel_level_entity: 'fuel_level',
  fuel_amount_entity: 'fuel_amount',
  fuel_capacity_entity: 'fuel_capacity',
  sunroof_entity: 'sunroof',
  tailgate_entity: 'tailgate',
  hood_entity: 'hood',
  oil_level_entity: 'oil',
  brake_fluid_entity: 'brake_fluid',
  coolant_level_entity: 'coolant',
  washer_fluid_entity: 'washer_fluid',
  doors: 'doors',
  windows: 'windows',
  tires: 'tires',
};

function refEntity(ref: EntityRef): string {
  return typeof ref === 'string' ? ref : ref.entity;
}

export class CompactVehicleCardEditor extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @state() private _config?: CompactVehicleCardConfig;
  @state() private _open: Record<string, boolean> = {
    general: true,
    custom_entities: false,
    advanced: false,
  };

  setConfig(config: CompactVehicleCardConfig): void {
    this._config = config;
  }

  private _formData(): FormData {
    const c = this._config;
    if (!c) return {};
    return {
      name: c.name,
      icon: c.icon,
      prefix: c.prefix,
      engine_entity: c.engine_entity,
      lock_entity: c.lock_entity,
      odometer_entity: c.overview?.odometer_entity,
      range_entity: c.overview?.range_entity,
      fuel_level_entity: c.overview?.fuel?.level_entity,
      fuel_amount_entity: c.overview?.fuel?.amount_entity,
      fuel_capacity_entity: c.overview?.fuel?.capacity_entity,
      doors: c.overview?.doors?.map(refEntity),
      windows: c.overview?.windows?.map(refEntity),
      sunroof_entity: c.overview?.sunroof_entity,
      tailgate_entity: c.overview?.tailgate_entity,
      hood_entity: c.overview?.hood_entity,
      tires: c.maintenance?.tires?.map(refEntity),
      oil_level_entity: c.maintenance?.oil_level_entity,
      brake_fluid_entity: c.maintenance?.brake_fluid_entity,
      coolant_level_entity: c.maintenance?.coolant_level_entity,
      washer_fluid_entity: c.maintenance?.washer_fluid_entity,
      // Display mode always shows a selection; 'expandable' is the card default.
      mode: c.display?.mode ?? 'expandable',
      auto_expand_maintenance: c.display?.auto_expand_maintenance,
      show_section_icons: c.display?.show_section_icons,
      unknown_value: c.display?.unknown_value,
      fuel_warn_percent: c.display?.fuel_warn_percent,
    };
  }

  private _computeLabel = (schema: { name: string }): string => LABELS[schema.name] ?? schema.name;

  private _computeHelper = (schema: { name: string }): string | undefined => {
    if (!this.hass || !this._config?.prefix) return undefined;
    const slot = DISCOVERY_SLOTS[schema.name];
    if (!slot) return undefined;
    const data = this._formData();
    const current = data[schema.name as keyof FormData];
    if (current !== undefined && (!Array.isArray(current) || current.length > 0)) {
      return undefined;
    }
    const resolved = resolveEntities(this._config, this.hass.states);
    const value = resolved[slot];
    if (Array.isArray(value)) {
      return value.length > 0
        ? `Auto-discovered: ${value.map((r) => r.entity).join(', ')}`
        : undefined;
    }
    return value ? `Auto-discovered: ${value}` : undefined;
  };

  private _valueChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    if (!this._config) return;
    const raw = ev.detail.value as FormData & Record<string, unknown>;
    // Sections use flatten: true, so data should arrive flat. If a frontend
    // ever nests values under the section name anyway, fold them back in.
    const d: FormData = { ...raw };
    for (const section of ['general', 'custom_entities', 'advanced'] as const) {
      const nested = raw[section];
      if (nested && typeof nested === 'object' && !Array.isArray(nested)) {
        Object.assign(d, nested);
        delete (d as Record<string, unknown>)[section];
      }
    }

    const prune = <T extends object>(obj: T): T | undefined => {
      const entries = Object.entries(obj).filter(
        ([, v]) => v !== undefined && v !== '' && !(Array.isArray(v) && v.length === 0),
      );
      return entries.length > 0 ? (Object.fromEntries(entries) as T) : undefined;
    };

    const fuel = prune({
      level_entity: d.fuel_level_entity,
      amount_entity: d.fuel_amount_entity,
      capacity_entity: d.fuel_capacity_entity,
    });
    const overview = prune({
      odometer_entity: d.odometer_entity,
      range_entity: d.range_entity,
      fuel,
      doors: d.doors,
      windows: d.windows,
      sunroof_entity: d.sunroof_entity,
      tailgate_entity: d.tailgate_entity,
      hood_entity: d.hood_entity,
    });
    const maintenance = prune({
      tires: d.tires,
      oil_level_entity: d.oil_level_entity,
      brake_fluid_entity: d.brake_fluid_entity,
      coolant_level_entity: d.coolant_level_entity,
      washer_fluid_entity: d.washer_fluid_entity,
    });
    const config: CompactVehicleCardConfig = {
      type: this._config.type,
      ...prune({
        name: d.name,
        icon: d.icon,
        prefix: d.prefix,
        engine_entity: d.engine_entity,
        lock_entity: d.lock_entity,
      }),
      ...(overview ? { overview } : {}),
      ...(maintenance ? { maintenance } : {}),
    };

    const displayObj = prune({
      mode: d.mode,
      auto_expand_maintenance: d.auto_expand_maintenance,
      show_section_icons: d.show_section_icons,
      unknown_value: d.unknown_value,
      fuel_warn_percent: d.fuel_warn_percent,
    });
    if (displayObj) {
      config.display = displayObj as CompactVehicleCardConfig['display'];
    }

    this.dispatchEvent(
      new CustomEvent('config-changed', {
        detail: { config },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _panelToggled(key: string, ev: CustomEvent): void {
    this._open = { ...this._open, [key]: (ev.detail as { expanded: boolean }).expanded };
  }

  /** One ha-form per block of fields, so gaps between blocks are ours to set. */
  private _form(data: FormData, schema: unknown[], cls = ''): TemplateResult {
    return html`
      <ha-form
        class=${cls}
        .hass=${this.hass}
        .data=${data}
        .schema=${schema}
        .computeLabel=${this._computeLabel}
        .computeHelper=${this._computeHelper}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
  }

  protected override render(): TemplateResult | typeof nothing {
    if (!this.hass || !this._config) return nothing;
    const data = this._formData();
    return html`
      <ha-expansion-panel
        outlined
        .header=${LABELS.general}
        .expanded=${this._open.general}
        @expanded-changed=${(ev: CustomEvent) => this._panelToggled('general', ev)}
      >
        <div class="content">
          ${this._form(data, PREFIX_SCHEMA)}
          <p class="helper">${PREFIX_HELPER}</p>
          ${this._form(data, GENERAL_SCHEMA, 'gap-lg')}
        </div>
      </ha-expansion-panel>

      <ha-expansion-panel
        outlined
        .header=${LABELS.custom_entities}
        .expanded=${this._open.custom_entities}
        @expanded-changed=${(ev: CustomEvent) => this._panelToggled('custom_entities', ev)}
      >
        <div class="content">${this._form(data, CUSTOM_ENTITIES_SCHEMA)}</div>
      </ha-expansion-panel>

      <ha-expansion-panel
        outlined
        .header=${LABELS.advanced}
        .expanded=${this._open.advanced}
        @expanded-changed=${(ev: CustomEvent) => this._panelToggled('advanced', ev)}
      >
        <div class="content">
          ${this._form(data, AUTO_EXPAND_SCHEMA)} ${this._form(data, SHOW_ICONS_SCHEMA, 'gap-sm')}
          ${this._form(data, ADVANCED_VALUES_SCHEMA, 'gap-lg')}
        </div>
      </ha-expansion-panel>
    `;
  }

  static override styles = css`
    :host {
      display: block;
    }

    ha-expansion-panel {
      display: block;
      margin-bottom: 12px;
    }

    ha-expansion-panel:last-of-type {
      margin-bottom: 0;
    }

    .content {
      padding: 4px 12px 12px;
    }

    ha-form {
      display: block;
    }

    .gap-sm {
      margin-top: 8px;
    }

    .gap-lg {
      margin-top: 20px;
    }

    .helper {
      margin: 10px 0 0;
      padding: 0 16px;
      color: var(--secondary-text-color);
      font-size: 12px;
      line-height: 1.5;
    }
  `;
}

customElements.define(EDITOR_TYPE, CompactVehicleCardEditor);
