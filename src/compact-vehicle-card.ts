import { html, LitElement, nothing, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import {
  CARD_TYPE,
  DEFAULT_FUEL_WARN_PERCENT,
  DEFAULT_ICON,
  DEFAULT_NAME,
  DEFAULT_UNKNOWN_VALUE,
  EDITOR_TYPE,
  ROW_ICONS,
} from './constants';
import {
  badgeInput,
  computeBadge,
  displayState,
  isUnknownState,
  resolveEntities,
  visibleRows,
  type Row,
} from './entity-utils';
import { localize } from './localize';
import { cardStyles } from './styles';
import type {
  BadgeResult,
  CompactVehicleCardConfig,
  HomeAssistant,
  ResolvedEntities,
} from './types';
import './editor';

declare const __CARD_VERSION__: string;

declare global {
  interface Window {
    customCards?: {
      type: string;
      name: string;
      description: string;
      preview?: boolean;
      documentationURL?: string;
    }[];
  }
  interface HTMLElementTagNameMap {
    'compact-vehicle-card': CompactVehicleCard;
  }
}

export class CompactVehicleCard extends LitElement {
  static override styles = cardStyles;

  @property({ attribute: false }) hass?: HomeAssistant;

  @state() private _config?: CompactVehicleCardConfig;
  @state() private _expanded = false;

  private _resolved?: ResolvedEntities;
  private _resolvedStateCount = -1;
  private _seen = new Set<string>();
  private _manuallyToggled = false;
  private _lastBadgeTier: BadgeResult['tier'] = null;

  static getConfigElement(): HTMLElement {
    return document.createElement(EDITOR_TYPE);
  }

  static getStubConfig(hass?: HomeAssistant): Partial<CompactVehicleCardConfig> {
    const config: Partial<CompactVehicleCardConfig> = {
      type: `custom:${CARD_TYPE}`,
      display: { mode: 'expandable' },
    };
    if (hass) {
      const guess =
        Object.keys(hass.states).find((id) => id.startsWith('lock.')) ??
        Object.keys(hass.states).find(
          (id) => id.startsWith('binary_sensor.') && id.endsWith('_engine_status'),
        );
      if (guess) {
        const objectId = guess.split('.')[1] ?? '';
        config.prefix = objectId.replace(/_(lock|engine_status)$/, '').replace(/_$/, '');
      }
    }
    return config;
  }

  setConfig(config: CompactVehicleCardConfig): void {
    if (!config || typeof config !== 'object') {
      throw new Error('Invalid configuration');
    }
    this._config = config;
    this._resolved = undefined;
    this._resolvedStateCount = -1;
    if (config.display?.mode === 'expanded') this._expanded = true;
  }

  getCardSize(): number {
    return this._expanded ? 8 : 2;
  }

  getGridOptions(): Record<string, number> {
    return {
      min_columns: 6,
      min_rows: this._expanded ? 6 : 2,
      rows: this._expanded ? 6 : 2,
    };
  }

  private get _mode(): 'expandable' | 'expanded' | 'compact' {
    return this._config?.display?.mode ?? 'expandable';
  }

  private get _unknownValue(): string {
    return this._config?.display?.unknown_value ?? DEFAULT_UNKNOWN_VALUE;
  }

  private _resolve(): ResolvedEntities | undefined {
    if (!this.hass || !this._config) return undefined;
    const count = Object.keys(this.hass.states).length;
    // Re-probe only when the entity population changes, so a slot that missed
    // earlier can latch on once the integration finishes loading.
    if (!this._resolved || count !== this._resolvedStateCount) {
      this._resolved = resolveEntities(this._config, this.hass.states);
      this._resolvedStateCount = count;
    }
    return this._resolved;
  }

  private _trackSeen(resolved: ResolvedEntities): void {
    if (!this.hass) return;
    const singles = [
      resolved.sunroof,
      resolved.tailgate,
      resolved.hood,
      resolved.oil,
      resolved.brake_fluid,
      resolved.coolant,
      resolved.washer_fluid,
    ];
    for (const id of singles) {
      if (id && !this._seen.has(id) && !isUnknownState(this.hass.states[id])) {
        this._seen.add(id);
      }
    }
  }

  protected override willUpdate(): void {
    const resolved = this._resolve();
    if (!resolved || !this.hass) return;
    this._trackSeen(resolved);

    // Auto-expand fires on the transition into the Warning tier, never while
    // it stays active, and stops once the user has toggled manually (§11).
    const badge = computeBadge(badgeInput(resolved), this.hass.states);
    const wasWarning = this._lastBadgeTier === 'warning';
    const isWarning = badge.tier === 'warning';
    if (
      this._config?.display?.auto_expand_maintenance &&
      this._mode === 'expandable' &&
      !this._manuallyToggled
    ) {
      if (isWarning && !wasWarning) this._setExpanded(true);
      else if (!isWarning && wasWarning) this._setExpanded(false);
    }
    this._lastBadgeTier = badge.tier;
  }

  private _setExpanded(expanded: boolean): void {
    if (this._expanded === expanded) return;
    this._expanded = expanded;
    this.updateComplete.then(() => {
      this.dispatchEvent(new Event('iron-resize', { bubbles: true, composed: true }));
    });
  }

  private _toggle(): void {
    if (this._mode !== 'expandable') return;
    this._manuallyToggled = true;
    this._setExpanded(!this._expanded);
  }

  private _onHeaderKeydown(ev: KeyboardEvent): void {
    if (ev.key === 'Enter' || ev.key === ' ') {
      ev.preventDefault();
      this._toggle();
    }
  }

  private _moreInfo(entityId: string | null): void {
    if (!entityId) return;
    this.dispatchEvent(
      new CustomEvent('hass-more-info', {
        detail: { entityId },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _onLockTap(ev: Event): void {
    ev.stopPropagation();
    const resolved = this._resolve();
    if (resolved?.lock) this._moreInfo(resolved.lock);
  }

  protected override render(): TemplateResult | typeof nothing {
    if (!this.hass || !this._config) return nothing;
    const resolved = this._resolve();
    if (!resolved) return nothing;

    const states = this.hass.states;
    const name = this._config.name ?? DEFAULT_NAME;
    const icon = this._config.icon ?? DEFAULT_ICON;
    const badge = computeBadge(badgeInput(resolved), states);
    const showBody = this._mode !== 'compact';
    const expandable = this._mode === 'expandable';
    const open = this._mode === 'expanded' || (expandable && this._expanded);

    const engineObj = resolved.engine ? states[resolved.engine] : undefined;
    const engineRunning =
      engineObj !== undefined &&
      (engineObj.state === 'on' || engineObj.state.toLowerCase() === 'running');
    const engineText = engineObj
      ? engineObj.entity_id.startsWith('binary_sensor.')
        ? engineRunning
          ? localize('state.running')
          : localize('state.not_running')
        : displayState(engineObj, this._unknownValue)
      : undefined;

    const lockObj = resolved.lock ? states[resolved.lock] : undefined;
    const lockUnlocked = lockObj !== undefined && lockObj.state !== 'locked';

    return html`
      <ha-card>
        <div
          class="header ${expandable ? '' : 'no-toggle'}"
          role=${expandable ? 'button' : nothing}
          tabindex=${expandable ? '0' : nothing}
          aria-expanded=${expandable ? String(open) : nothing}
          aria-label=${expandable ? `${name}, toggle details` : nothing}
          @click=${expandable ? this._toggle : nothing}
          @keydown=${expandable ? this._onHeaderKeydown : nothing}
        >
          <div class="marque"><ha-icon .icon=${icon}></ha-icon></div>
          <div class="titles">
            <div class="title">${name}</div>
            ${
              engineText !== undefined
                ? html`<div class="subtitle"><span>${engineText}</span></div>`
                : nothing
            }
          </div>
          ${
            badge.tier
              ? html`<div
                  class="badge ${badge.tier}"
                  title=${badge.items.join(', ')}
                  @click=${(ev: Event) => {
                    ev.stopPropagation();
                    this._toggle();
                  }}
                >
                  <ha-icon
                    .icon=${badge.tier === 'warning' ? 'mdi:alert-circle' : 'mdi:car-door'}
                  ></ha-icon>
                  <span
                    >${
                      badge.tier === 'warning'
                        ? localize('badge.warning')
                        : localize('badge.attention')
                    }</span
                  >
                </div>`
              : nothing
          }
          ${
            lockObj
              ? html`<button
                  class="lock-button ${lockUnlocked ? 'unlocked' : ''}"
                  aria-label=${lockUnlocked ? 'Unlocked' : 'Locked'}
                  @click=${this._onLockTap}
                >
                  <ha-icon .icon=${lockUnlocked ? 'mdi:lock-open-variant' : 'mdi:lock'}></ha-icon>
                </button>`
              : nothing
          }
          ${
            expandable
              ? html`<div class="chevron ${open ? 'open' : ''}">
                  <ha-icon icon="mdi:chevron-down"></ha-icon>
                </div>`
              : nothing
          }
        </div>
        ${
          showBody
            ? html`<div class="body ${open ? 'open' : ''}">
                <div class="inner">${this._renderSections(resolved)}</div>
              </div>`
            : nothing
        }
      </ha-card>
    `;
  }

  private _renderSections(resolved: ResolvedEntities): TemplateResult | typeof nothing {
    if (!this.hass || !this._config) return nothing;
    const rows = visibleRows(resolved, this.hass.states, ROW_ICONS, {
      unknownValue: this._unknownValue,
      fuelWarnPercent: this._config.display?.fuel_warn_percent ?? DEFAULT_FUEL_WARN_PERCENT,
      seen: this._seen,
      vehicleName: this._config.name,
    });
    const overview = rows.filter((r) => r.section === 'overview');
    const maintenance = rows.filter((r) => r.section === 'maintenance');

    return html`
      <div class="sections">
        ${this._renderSection(localize('section.overview'), overview)}
        ${this._renderSection(localize('section.maintenance'), maintenance)}
      </div>
    `;
  }

  private _renderSection(heading: string, rows: Row[]): TemplateResult | typeof nothing {
    if (rows.length === 0) return nothing;
    return html`
      <div class="section-heading">${heading}</div>
      <div class="section">${rows.map((row) => this._renderRow(row))}</div>
    `;
  }

  private _renderRow(row: Row): TemplateResult {
    const showIcons = this._config?.display?.show_section_icons ?? true;
    const isMaintenanceProblem = row.section === 'maintenance' && row.status === 'problem';
    const valueClass = isMaintenanceProblem ? 'error' : row.warn ? 'warn' : '';
    return html`
      <div
        class="row"
        title=${row.title ?? nothing}
        @click=${() => this._moreInfo(row.targetEntity)}
      >
        ${
          showIcons
            ? html`<div class="row-icon"><ha-icon .icon=${row.icon}></ha-icon></div>`
            : nothing
        }
        <div class="row-label">${row.label}</div>
        <div class="row-value ${valueClass}">${row.value}</div>
      </div>
    `;
  }
}

customElements.define(CARD_TYPE, CompactVehicleCard);

window.customCards = window.customCards ?? [];
window.customCards.push({
  type: CARD_TYPE,
  name: 'Compact Vehicle Card',
  description:
    'A slim, integration-agnostic vehicle card with expandable Overview and Maintenance sections.',
  preview: false,
  documentationURL: 'https://github.com/timblazing/compact-vehicle-card',
});

console.info(
  `%c COMPACT-VEHICLE-CARD %c v${__CARD_VERSION__} `,
  'color: white; background: #555; font-weight: 700;',
  'color: #555; background: #ddd; font-weight: 700;',
);
