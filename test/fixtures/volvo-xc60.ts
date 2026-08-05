import type { CompactVehicleCardConfig, HassStates } from '../../src/types';

function entity(
  entity_id: string,
  state: string,
  attributes: Record<string, unknown> = {},
): [string, { entity_id: string; state: string; attributes: Record<string, unknown> }] {
  return [entity_id, { entity_id, state, attributes }];
}

/**
 * Acceptance fixture (§13): 2018 Volvo XC60 on the Volvo integration.
 * Odometer 68,963 mi · fuel 6.9 / 18.5 gal (≈37%) · range 139 mi · engine off ·
 * all apertures closed · fluids and tires OK. Fluid/tire sensors deliberately
 * mix binary_sensor and text-state sensor domains to exercise both §7 paths.
 * `tank_lid` is permanently `unknown` to assert row suppression.
 */
export const volvoStates: HassStates = Object.fromEntries([
  entity('binary_sensor.volvo_xc60_engine_status', 'off', {
    friendly_name: 'Volvo XC60 Engine status',
    device_class: 'running',
  }),
  entity('lock.volvo_xc60_lock', 'locked', { friendly_name: 'Volvo XC60 Lock' }),
  entity('sensor.volvo_xc60_odometer', '68963', {
    friendly_name: 'Volvo XC60 Odometer',
    unit_of_measurement: 'mi',
  }),
  entity('sensor.volvo_xc60_distance_to_empty_tank', '139', {
    friendly_name: 'Volvo XC60 Distance to empty tank',
    unit_of_measurement: 'mi',
  }),
  entity('sensor.volvo_xc60_fuel_amount', '6.9', {
    friendly_name: 'Volvo XC60 Fuel amount',
    unit_of_measurement: 'gal',
  }),
  entity('sensor.volvo_xc60_fuel_capacity', '18.5', {
    friendly_name: 'Volvo XC60 Fuel capacity',
    unit_of_measurement: 'gal',
  }),
  entity('binary_sensor.volvo_xc60_door_front_left', 'off', {
    friendly_name: 'Volvo XC60 Door front left',
    device_class: 'door',
  }),
  entity('binary_sensor.volvo_xc60_door_front_right', 'off', {
    friendly_name: 'Volvo XC60 Door front right',
    device_class: 'door',
  }),
  entity('binary_sensor.volvo_xc60_door_rear_left', 'off', {
    friendly_name: 'Volvo XC60 Door rear left',
    device_class: 'door',
  }),
  entity('binary_sensor.volvo_xc60_door_rear_right', 'off', {
    friendly_name: 'Volvo XC60 Door rear right',
    device_class: 'door',
  }),
  entity('binary_sensor.volvo_xc60_window_front_left', 'off', {
    friendly_name: 'Volvo XC60 Window front left',
    device_class: 'window',
  }),
  entity('binary_sensor.volvo_xc60_window_front_right', 'off', {
    friendly_name: 'Volvo XC60 Window front right',
    device_class: 'window',
  }),
  entity('binary_sensor.volvo_xc60_window_rear_left', 'off', {
    friendly_name: 'Volvo XC60 Window rear left',
    device_class: 'window',
  }),
  entity('binary_sensor.volvo_xc60_window_rear_right', 'off', {
    friendly_name: 'Volvo XC60 Window rear right',
    device_class: 'window',
  }),
  entity('binary_sensor.volvo_xc60_sunroof', 'off', {
    friendly_name: 'Volvo XC60 Sunroof',
    device_class: 'opening',
  }),
  entity('binary_sensor.volvo_xc60_tailgate', 'off', {
    friendly_name: 'Volvo XC60 Tailgate',
    device_class: 'opening',
  }),
  entity('binary_sensor.volvo_xc60_hood', 'off', {
    friendly_name: 'Volvo XC60 Hood',
    device_class: 'opening',
  }),
  entity('binary_sensor.volvo_xc60_tank_lid', 'unknown', {
    friendly_name: 'Volvo XC60 Tank lid',
    device_class: 'opening',
  }),
  // Tires as binary_sensor (device_class problem)…
  entity('binary_sensor.volvo_xc60_tire_front_left', 'off', {
    friendly_name: 'Volvo XC60 Tire front left',
    device_class: 'problem',
  }),
  entity('binary_sensor.volvo_xc60_tire_front_right', 'off', {
    friendly_name: 'Volvo XC60 Tire front right',
    device_class: 'problem',
  }),
  entity('binary_sensor.volvo_xc60_tire_rear_left', 'off', {
    friendly_name: 'Volvo XC60 Tire rear left',
    device_class: 'problem',
  }),
  entity('binary_sensor.volvo_xc60_tire_rear_right', 'off', {
    friendly_name: 'Volvo XC60 Tire rear right',
    device_class: 'problem',
  }),
  // …and fluids as text-state sensors, to prove both normalization paths.
  entity('sensor.volvo_xc60_oil_level', 'Normal', {
    friendly_name: 'Volvo XC60 Oil level',
  }),
  entity('binary_sensor.volvo_xc60_brake_fluid', 'off', {
    friendly_name: 'Volvo XC60 Brake fluid',
    device_class: 'problem',
  }),
  entity('sensor.volvo_xc60_coolant_level', 'OK', {
    friendly_name: 'Volvo XC60 Coolant level',
  }),
  entity('binary_sensor.volvo_xc60_washer_fluid', 'off', {
    friendly_name: 'Volvo XC60 Washer fluid',
    device_class: 'problem',
  }),
]);

/** Second fixture: tank lid now reports a real state (§13 sticky-row assertion). */
export const volvoStatesTankLidKnown: HassStates = {
  ...volvoStates,
  'binary_sensor.volvo_xc60_tank_lid': {
    entity_id: 'binary_sensor.volvo_xc60_tank_lid',
    state: 'off',
    attributes: { friendly_name: 'Volvo XC60 Tank lid', device_class: 'opening' },
  },
};

export const volvoConfig: CompactVehicleCardConfig = {
  type: 'custom:compact-vehicle-card',
  name: 'Volvo XC60',
  icon: 'mdi:car-estate',
  engine_entity: 'binary_sensor.volvo_xc60_engine_status',
  lock_entity: 'lock.volvo_xc60_lock',
  display: {
    mode: 'expandable',
    auto_expand_maintenance: false,
  },
  overview: {
    odometer_entity: 'sensor.volvo_xc60_odometer',
    range_entity: 'sensor.volvo_xc60_distance_to_empty_tank',
    fuel: {
      amount_entity: 'sensor.volvo_xc60_fuel_amount',
      capacity_entity: 'sensor.volvo_xc60_fuel_capacity',
    },
    doors: [
      { entity: 'binary_sensor.volvo_xc60_door_front_left', name: 'Front left' },
      { entity: 'binary_sensor.volvo_xc60_door_front_right', name: 'Front right' },
      { entity: 'binary_sensor.volvo_xc60_door_rear_left', name: 'Rear left' },
      { entity: 'binary_sensor.volvo_xc60_door_rear_right', name: 'Rear right' },
    ],
    windows: [
      { entity: 'binary_sensor.volvo_xc60_window_front_left', name: 'Front left' },
      { entity: 'binary_sensor.volvo_xc60_window_front_right', name: 'Front right' },
      { entity: 'binary_sensor.volvo_xc60_window_rear_left', name: 'Rear left' },
      { entity: 'binary_sensor.volvo_xc60_window_rear_right', name: 'Rear right' },
    ],
    sunroof_entity: 'binary_sensor.volvo_xc60_sunroof',
    tailgate_entity: 'binary_sensor.volvo_xc60_tailgate',
    hood_entity: 'binary_sensor.volvo_xc60_hood',
  },
  maintenance: {
    tires: [
      { entity: 'binary_sensor.volvo_xc60_tire_front_left', name: 'Front left' },
      { entity: 'binary_sensor.volvo_xc60_tire_front_right', name: 'Front right' },
      { entity: 'binary_sensor.volvo_xc60_tire_rear_left', name: 'Rear left' },
      { entity: 'binary_sensor.volvo_xc60_tire_rear_right', name: 'Rear right' },
    ],
    oil_level_entity: 'sensor.volvo_xc60_oil_level',
    brake_fluid_entity: 'binary_sensor.volvo_xc60_brake_fluid',
    coolant_level_entity: 'sensor.volvo_xc60_coolant_level',
    washer_fluid_entity: 'binary_sensor.volvo_xc60_washer_fluid',
  },
};

/**
 * Config wiring the permanently-unknown tank lid in as an extra single-status
 * aperture row (via the sunroof slot, which shares the status-row pipeline),
 * purely to assert §7 row suppression and the sticky-row rule.
 */
export const volvoConfigWithTankLid: CompactVehicleCardConfig = {
  ...volvoConfig,
  overview: {
    ...volvoConfig.overview,
    sunroof_entity: 'binary_sensor.volvo_xc60_tank_lid',
  },
};
