/** A Home Assistant entity state object (subset the card uses). */
export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: {
    friendly_name?: string;
    unit_of_measurement?: string;
    device_class?: string;
    icon?: string;
    [key: string]: unknown;
  };
}

export type HassStates = Record<string, HassEntity>;

/** Subset of the `hass` object the card touches. */
export interface HomeAssistant {
  states: HassStates;
  locale?: { language?: string; number_format?: string };
  formatEntityState?: (stateObj: HassEntity) => string;
}

export type EntityRef = string | { entity: string; name?: string; invert?: boolean };

export interface ResolvedEntityRef {
  entity: string;
  name?: string;
  invert?: boolean;
}

export interface DisplayConfig {
  mode?: 'expandable' | 'expanded' | 'compact';
  auto_expand_maintenance?: boolean;
  show_section_icons?: boolean;
  show_dividers?: boolean;
  unknown_value?: string;
  fuel_warn_percent?: number;
}

export interface FuelConfig {
  level_entity?: string;
  amount_entity?: string;
  capacity_entity?: string;
}

export interface OverviewConfig {
  odometer_entity?: string;
  range_entity?: string;
  fuel?: FuelConfig;
  doors?: EntityRef[];
  windows?: EntityRef[];
  sunroof_entity?: string;
  tailgate_entity?: string;
  hood_entity?: string;
}

export interface MaintenanceConfig {
  tires?: EntityRef[];
  oil_level_entity?: string;
  brake_fluid_entity?: string;
  coolant_level_entity?: string;
  washer_fluid_entity?: string;
}

export interface CompactVehicleCardConfig {
  type: string;
  name?: string;
  icon?: string;
  prefix?: string;
  engine_entity?: string;
  lock_entity?: string;
  display?: DisplayConfig;
  overview?: OverviewConfig;
  maintenance?: MaintenanceConfig;
}

export type NormalizedState = 'ok' | 'problem' | 'unknown';

export interface AggregateResult {
  status: NormalizedState;
  text: string;
  offenders: string[];
  targetEntity: string | null;
}

export type BadgeTier = 'warning' | 'attention' | null;

export interface BadgeResult {
  tier: BadgeTier;
  items: string[];
}

/** Fully resolved entity map after config + auto-discovery. */
export interface ResolvedEntities {
  engine?: string;
  lock?: string;
  odometer?: string;
  range?: string;
  fuel_level?: string;
  fuel_amount?: string;
  fuel_capacity?: string;
  doors: ResolvedEntityRef[];
  windows: ResolvedEntityRef[];
  sunroof?: string;
  tailgate?: string;
  hood?: string;
  tires: ResolvedEntityRef[];
  oil?: string;
  brake_fluid?: string;
  coolant?: string;
  washer_fluid?: string;
}
