export const CARD_TYPE = 'compact-vehicle-card';
export const EDITOR_TYPE = 'compact-vehicle-card-editor';

export const DEFAULT_ICON = 'mdi:car';
export const DEFAULT_NAME = 'Vehicle';
export const DEFAULT_UNKNOWN_VALUE = '-';
export const DEFAULT_FUEL_WARN_PERCENT = 15;

/** States treated as 'ok' by the text-state fallback, lowercase. */
export const OK_STATES: ReadonlySet<string> = new Set([
  'ok',
  'normal',
  'closed',
  'locked',
  'off',
  'false',
  'clear',
  'good',
  'full',
  'no',
  'none',
  'secured',
  'no_problem',
  'no problem',
  'not_running',
  'not running',
  'stopped',
  'parked',
]);

export const UNKNOWN_STATES: ReadonlySet<string> = new Set(['unknown', 'unavailable', 'none', '']);

/** Domain probe order for auto-discovery. */
export const PROBE_DOMAINS = ['sensor', 'binary_sensor', 'lock', 'cover', 'switch'] as const;

/** Candidate object-ID suffixes per single-entity slot, in priority order. */
export const SLOT_SUFFIXES: Record<string, string[]> = {
  engine: ['engine_status', 'engine_state', 'engine', 'engine_running'],
  lock: ['lock', 'door_lock', 'locked', 'central_lock'],
  odometer: ['odometer', 'mileage', 'odometer_value'],
  range: ['distance_to_empty_tank', 'range', 'distance_to_empty', 'fuel_range'],
  fuel_level: ['fuel_level', 'fuel_percentage', 'fuel_percent', 'tank_level'],
  fuel_amount: ['fuel_amount', 'fuel_volume'],
  fuel_capacity: ['fuel_capacity', 'fuel_tank_capacity', 'tank_capacity'],
  sunroof: ['sunroof', 'sun_roof', 'moonroof'],
  tailgate: ['tailgate', 'trunk', 'boot', 'liftgate'],
  hood: ['hood', 'bonnet', 'front_hood'],
  oil: ['oil_level', 'engine_oil_level', 'oil'],
  brake_fluid: ['brake_fluid', 'brake_fluid_level'],
  coolant: ['coolant_level', 'coolant', 'engine_coolant_level'],
  washer_fluid: ['washer_fluid', 'washer_fluid_level', 'windshield_washer_fluid'],
};

/** Candidate suffixes for group slots; every hit is collected. */
export const GROUP_SUFFIXES: Record<string, string[]> = {
  doors: [
    'door_front_left',
    'door_front_right',
    'door_rear_left',
    'door_rear_right',
    'front_left_door',
    'front_right_door',
    'rear_left_door',
    'rear_right_door',
  ],
  windows: [
    'window_front_left',
    'window_front_right',
    'window_rear_left',
    'window_rear_right',
    'front_left_window',
    'front_right_window',
    'rear_left_window',
    'rear_right_window',
  ],
  tires: [
    'tire_front_left',
    'tire_front_right',
    'tire_rear_left',
    'tire_rear_right',
    'tyre_front_left',
    'tyre_front_right',
    'tyre_rear_left',
    'tyre_rear_right',
    'front_left_tire_pressure',
    'front_right_tire_pressure',
    'rear_left_tire_pressure',
    'rear_right_tire_pressure',
  ],
};

export const ROW_ICONS = {
  odometer: 'mdi:counter',
  fuel: 'mdi:gas-station',
  range: 'mdi:map-marker-distance',
  doors: 'mdi:car-door',
  windows: 'mdi:car-door',
  sunroof: 'mdi:car-select',
  tailgate: 'mdi:car-back',
  hood: 'mdi:car',
  tires: 'mdi:car-tire-alert',
  oil: 'mdi:oil-level',
  brake_fluid: 'mdi:car-brake-fluid-level',
  coolant: 'mdi:car-coolant-level',
  washer_fluid: 'mdi:wiper-wash',
} as const;
