import { describe, expect, it } from 'vitest';
import { ROW_ICONS } from '../src/constants';
import {
  aggregate,
  badgeInput,
  computeBadge,
  fuelPercent,
  memberLabel,
  normalize,
  resolveEntities,
  visibleRows,
} from '../src/entity-utils';
import type { CompactVehicleCardConfig, HassEntity, HassStates } from '../src/types';
import {
  volvoConfig,
  volvoConfigWithTankLid,
  volvoStates,
  volvoStatesTankLidKnown,
} from './fixtures/volvo-xc60';

function ent(entity_id: string, state: string, attributes = {}): HassEntity {
  return { entity_id, state, attributes };
}

// ---------------------------------------------------------------------------
// normalize() — §7
// ---------------------------------------------------------------------------

describe('normalize', () => {
  it('maps binary_sensor on/off to problem/ok', () => {
    expect(normalize(ent('binary_sensor.door', 'on'))).toBe('problem');
    expect(normalize(ent('binary_sensor.door', 'off'))).toBe('ok');
  });

  it('maps lock locked/unlocked to ok/problem', () => {
    expect(normalize(ent('lock.car', 'locked'))).toBe('ok');
    expect(normalize(ent('lock.car', 'unlocked'))).toBe('problem');
    expect(normalize(ent('lock.car', 'open'))).toBe('problem');
  });

  it('matches text states against OK_STATES case-insensitively', () => {
    expect(normalize(ent('sensor.oil', 'OK'))).toBe('ok');
    expect(normalize(ent('sensor.oil', 'Normal'))).toBe('ok');
    expect(normalize(ent('sensor.oil', 'no_problem'))).toBe('ok');
    expect(normalize(ent('sensor.oil', 'Low'))).toBe('problem');
    expect(normalize(ent('sensor.oil', 'Problem'))).toBe('problem');
    expect(normalize(ent('sensor.engine', 'Not running'))).toBe('ok');
  });

  it('treats unknown, unavailable, none, and missing entities as unknown', () => {
    expect(normalize(ent('sensor.x', 'unknown'))).toBe('unknown');
    expect(normalize(ent('sensor.x', 'unavailable'))).toBe('unknown');
    expect(normalize(ent('sensor.x', 'none'))).toBe('unknown');
    expect(normalize(ent('sensor.x', ''))).toBe('unknown');
    expect(normalize(undefined)).toBe('unknown');
  });

  it('invert swaps ok and problem but never touches unknown', () => {
    expect(normalize(ent('binary_sensor.x', 'on'), { invert: true })).toBe('ok');
    expect(normalize(ent('binary_sensor.x', 'off'), { invert: true })).toBe('problem');
    expect(normalize(ent('sensor.x', 'unknown'), { invert: true })).toBe('unknown');
    expect(normalize(undefined, { invert: true })).toBe('unknown');
  });
});

// ---------------------------------------------------------------------------
// aggregate() — §8
// ---------------------------------------------------------------------------

describe('aggregate', () => {
  const labels = { allOk: 'All closed', problemVerb: 'open' };
  const states: HassStates = Object.fromEntries(
    [
      ent('binary_sensor.d1', 'off'),
      ent('binary_sensor.d2', 'off'),
      ent('binary_sensor.d3', 'off'),
      ent('binary_sensor.d4', 'off'),
    ].map((e) => [e.entity_id, e]),
  );
  const refs = (['d1', 'd2', 'd3', 'd4'] as const).map((id, i) => ({
    entity: `binary_sensor.${id}`,
    name: ['Front left', 'Front right', 'Rear left', 'Rear right'][i],
  }));

  const withStates = (overrides: Record<string, string>): HassStates => {
    const copy = { ...states };
    for (const [id, state] of Object.entries(overrides)) {
      copy[id] = ent(id, state);
    }
    return copy;
  };

  it('renders the all-ok label when every member is ok', () => {
    const result = aggregate(refs, states, labels);
    expect(result.status).toBe('ok');
    expect(result.text).toBe('All closed');
    expect(result.targetEntity).toBe('binary_sensor.d1');
  });

  it('names a single offender', () => {
    const result = aggregate(refs, withStates({ 'binary_sensor.d1': 'on' }), labels);
    expect(result.status).toBe('problem');
    expect(result.text).toBe('Front left open');
    expect(result.offenders).toEqual(['Front left']);
    expect(result.targetEntity).toBe('binary_sensor.d1');
  });

  it('lists two or three offenders by name', () => {
    const result = aggregate(
      refs,
      withStates({ 'binary_sensor.d1': 'on', 'binary_sensor.d4': 'on' }),
      labels,
    );
    expect(result.text).toBe('Front left, rear right open');
    expect(result.offenders).toEqual(['Front left', 'Rear right']);
  });

  it('collapses four or more offenders to a count', () => {
    const result = aggregate(
      refs,
      withStates({
        'binary_sensor.d1': 'on',
        'binary_sensor.d2': 'on',
        'binary_sensor.d3': 'on',
        'binary_sensor.d4': 'on',
      }),
      labels,
    );
    expect(result.text).toBe('4 open');
  });

  it('renders "-" when no problems but a member is unknown — never claim secure on incomplete data', () => {
    const result = aggregate(refs, withStates({ 'binary_sensor.d2': 'unknown' }), labels);
    expect(result.status).toBe('unknown');
    expect(result.text).toBe('-');
  });

  it('still reports problems even when other members are unknown', () => {
    const result = aggregate(
      refs,
      withStates({ 'binary_sensor.d1': 'on', 'binary_sensor.d2': 'unknown' }),
      labels,
    );
    expect(result.status).toBe('problem');
    expect(result.text).toBe('Front left open');
  });

  it('renders "-" when every member is unknown', () => {
    const result = aggregate(
      refs,
      withStates({
        'binary_sensor.d1': 'unknown',
        'binary_sensor.d2': 'unknown',
        'binary_sensor.d3': 'unknown',
        'binary_sensor.d4': 'unknown',
      }),
      labels,
    );
    expect(result.status).toBe('unknown');
    expect(result.text).toBe('-');
  });

  it('returns an empty result for an empty group', () => {
    const result = aggregate([], states, labels);
    expect(result.targetEntity).toBeNull();
    expect(result.text).toBe('');
  });
});

// ---------------------------------------------------------------------------
// computeBadge() — §9
// ---------------------------------------------------------------------------

describe('computeBadge', () => {
  const resolvedFrom = (config: CompactVehicleCardConfig, states: HassStates) =>
    badgeInput(resolveEntities(config, states));

  it('renders no badge when everything is ok', () => {
    const badge = computeBadge(resolvedFrom(volvoConfig, volvoStates), volvoStates);
    expect(badge.tier).toBeNull();
    expect(badge.items).toEqual([]);
  });

  it('raises Attention for an open aperture', () => {
    const states = {
      ...volvoStates,
      'binary_sensor.volvo_xc60_door_front_left': ent(
        'binary_sensor.volvo_xc60_door_front_left',
        'on',
      ),
    };
    const badge = computeBadge(resolvedFrom(volvoConfig, states), states);
    expect(badge.tier).toBe('attention');
    expect(badge.items).toEqual(['Doors']);
  });

  it('raises Warning for a maintenance problem', () => {
    const states = {
      ...volvoStates,
      'sensor.volvo_xc60_oil_level': ent('sensor.volvo_xc60_oil_level', 'Low'),
    };
    const badge = computeBadge(resolvedFrom(volvoConfig, states), states);
    expect(badge.tier).toBe('warning');
    expect(badge.items).toEqual(['Oil level']);
  });

  it('Warning outranks Attention when both are true', () => {
    const states = {
      ...volvoStates,
      'binary_sensor.volvo_xc60_door_front_left': ent(
        'binary_sensor.volvo_xc60_door_front_left',
        'on',
      ),
      'sensor.volvo_xc60_oil_level': ent('sensor.volvo_xc60_oil_level', 'Low'),
    };
    const badge = computeBadge(resolvedFrom(volvoConfig, states), states);
    expect(badge.tier).toBe('warning');
  });

  it('unknown states never raise a badge', () => {
    const states = Object.fromEntries(
      Object.entries(volvoStates).map(([id, e]) => [id, { ...e, state: 'unknown' }]),
    );
    const badge = computeBadge(resolvedFrom(volvoConfig, states), states);
    expect(badge.tier).toBeNull();
  });

  it('low fuel alone never raises a badge', () => {
    const states = {
      ...volvoStates,
      'sensor.volvo_xc60_fuel_amount': ent('sensor.volvo_xc60_fuel_amount', '0.9', {
        unit_of_measurement: 'gal',
      }),
    };
    const badge = computeBadge(resolvedFrom(volvoConfig, states), states);
    expect(badge.tier).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// fuelPercent() — §5
// ---------------------------------------------------------------------------

describe('fuelPercent', () => {
  const states: HassStates = Object.fromEntries(
    [
      ent('sensor.level', '42'),
      ent('sensor.amount', '6.9'),
      ent('sensor.capacity', '18.5'),
      ent('sensor.zero_capacity', '0'),
      ent('sensor.text', 'full-ish'),
      ent('sensor.unknown', 'unknown'),
    ].map((e) => [e.entity_id, e]),
  );

  it('uses the direct level entity when present', () => {
    expect(fuelPercent(states, 'sensor.level')).toBe(42);
  });

  it('level entity wins over amount/capacity', () => {
    expect(fuelPercent(states, 'sensor.level', 'sensor.amount', 'sensor.capacity')).toBe(42);
  });

  it('computes amount / capacity * 100', () => {
    expect(fuelPercent(states, undefined, 'sensor.amount', 'sensor.capacity')).toBe(37);
  });

  it('returns null when capacity is zero', () => {
    expect(fuelPercent(states, undefined, 'sensor.amount', 'sensor.zero_capacity')).toBeNull();
  });

  it('returns null for non-numeric states', () => {
    expect(fuelPercent(states, 'sensor.text')).toBeNull();
    expect(fuelPercent(states, undefined, 'sensor.text', 'sensor.capacity')).toBeNull();
  });

  it('returns null for missing or unknown entities', () => {
    expect(fuelPercent(states, 'sensor.missing')).toBeNull();
    expect(fuelPercent(states, 'sensor.unknown')).toBeNull();
    expect(fuelPercent(states)).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// resolveEntities() — §6
// ---------------------------------------------------------------------------

describe('resolveEntities', () => {
  const prefixStates: HassStates = Object.fromEntries(
    [
      ent('sensor.my_car_odometer', '1000'),
      ent('sensor.my_car_range', '300'),
      ent('binary_sensor.my_car_engine_status', 'off'),
      ent('lock.my_car_lock', 'locked'),
      ent('binary_sensor.my_car_door_front_left', 'off'),
      ent('binary_sensor.my_car_door_front_right', 'off'),
      ent('sensor.my_car_fuel_level', '55'),
      // Same suffix in two domains: sensor must win per probe order.
      ent('binary_sensor.my_car_hood', 'off'),
      ent('sensor.my_car_hood', 'Closed'),
    ].map((e) => [e.entity_id, e]),
  );

  it('fills slots from the prefix', () => {
    const resolved = resolveEntities({ type: 'x', prefix: 'my_car' }, prefixStates);
    expect(resolved.odometer).toBe('sensor.my_car_odometer');
    expect(resolved.range).toBe('sensor.my_car_range');
    expect(resolved.engine).toBe('binary_sensor.my_car_engine_status');
    expect(resolved.lock).toBe('lock.my_car_lock');
    expect(resolved.fuel_level).toBe('sensor.my_car_fuel_level');
  });

  it('explicit config always beats discovery', () => {
    const resolved = resolveEntities(
      {
        type: 'x',
        prefix: 'my_car',
        overview: { odometer_entity: 'sensor.custom_odometer' },
      },
      prefixStates,
    );
    expect(resolved.odometer).toBe('sensor.custom_odometer');
  });

  it('probes domains in order — sensor before binary_sensor', () => {
    const resolved = resolveEntities({ type: 'x', prefix: 'my_car' }, prefixStates);
    expect(resolved.hood).toBe('sensor.my_car_hood');
  });

  it('collects every group hit and tolerates partial matches', () => {
    const resolved = resolveEntities({ type: 'x', prefix: 'my_car' }, prefixStates);
    expect(resolved.doors.map((r) => r.entity)).toEqual([
      'binary_sensor.my_car_door_front_left',
      'binary_sensor.my_car_door_front_right',
    ]);
    expect(resolved.windows).toEqual([]);
    expect(resolved.tires).toEqual([]);
  });

  it('leaves unmatched slots undefined', () => {
    const resolved = resolveEntities({ type: 'x', prefix: 'my_car' }, prefixStates);
    expect(resolved.sunroof).toBeUndefined();
    expect(resolved.washer_fluid).toBeUndefined();
  });

  it('resolves nothing without a prefix or explicit config', () => {
    const resolved = resolveEntities({ type: 'x' }, prefixStates);
    expect(resolved.odometer).toBeUndefined();
    expect(resolved.doors).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// visibleRows() — §7 suppression, sticky rows, §8 aggregates
// ---------------------------------------------------------------------------

describe('visibleRows', () => {
  const rowsFor = (
    config: CompactVehicleCardConfig,
    states: HassStates,
    seen: ReadonlySet<string> = new Set(),
  ) =>
    visibleRows(resolveEntities(config, states), states, ROW_ICONS, {
      seen,
      vehicleName: config.name,
    });

  it('renders the full Volvo fixture correctly', () => {
    const rows = rowsFor(volvoConfig, volvoStates);
    const byKey = Object.fromEntries(rows.map((r) => [r.key, r]));
    expect(byKey.odometer?.value).toBe('68,963 mi');
    expect(byKey.fuel?.value).toBe('37%');
    expect(byKey.fuel?.warn).toBe(false);
    expect(byKey.range?.value).toBe('139 mi');
    expect(byKey.doors?.value).toBe('All closed');
    expect(byKey.windows?.value).toBe('All closed');
    expect(byKey.sunroof?.value).toBe('Off');
    expect(byKey.tires?.value).toBe('OK');
    expect(byKey.oil?.value).toBe('Normal');
    expect(byKey.coolant?.value).toBe('OK');
  });

  it('suppresses a never-seen unknown status row (tank lid)', () => {
    const rows = rowsFor(volvoConfigWithTankLid, volvoStates);
    expect(rows.find((r) => r.key === 'sunroof')).toBeUndefined();
  });

  it('renders the row once the entity reports a real state', () => {
    const rows = rowsFor(volvoConfigWithTankLid, volvoStatesTankLidKnown);
    const row = rows.find((r) => r.key === 'sunroof');
    expect(row).toBeDefined();
    expect(row?.value).toBe('Off');
  });

  it('sticky row: seen-then-lost renders unknown_value instead of vanishing', () => {
    const seen = new Set(['binary_sensor.volvo_xc60_tank_lid']);
    const rows = rowsFor(volvoConfigWithTankLid, volvoStates, seen);
    const row = rows.find((r) => r.key === 'sunroof');
    expect(row).toBeDefined();
    expect(row?.value).toBe('-');
  });

  it('value rows are never suppressed — unknown renders as unknown_value', () => {
    const states = {
      ...volvoStates,
      'sensor.volvo_xc60_odometer': ent('sensor.volvo_xc60_odometer', 'unavailable'),
    };
    const rows = rowsFor(volvoConfig, states);
    const row = rows.find((r) => r.key === 'odometer');
    expect(row).toBeDefined();
    expect(row?.value).toBe('-');
  });

  it('suppresses a group with zero resolved members', () => {
    const config: CompactVehicleCardConfig = {
      ...volvoConfig,
      overview: { ...volvoConfig.overview, windows: [] },
    };
    const rows = rowsFor(config, volvoStates);
    expect(rows.find((r) => r.key === 'windows')).toBeUndefined();
  });

  it('renders an aggregate with one unknown member as "-"', () => {
    const states = {
      ...volvoStates,
      'binary_sensor.volvo_xc60_door_rear_left': ent(
        'binary_sensor.volvo_xc60_door_rear_left',
        'unavailable',
      ),
    };
    const rows = rowsFor(volvoConfig, states);
    const row = rows.find((r) => r.key === 'doors');
    expect(row).toBeDefined();
    expect(row?.value).toBe('-');
  });

  it('marks low fuel with warn and keeps the percent for the bar', () => {
    const states = {
      ...volvoStates,
      'sensor.volvo_xc60_fuel_amount': ent('sensor.volvo_xc60_fuel_amount', '0.9', {
        unit_of_measurement: 'gal',
      }),
    };
    const rows = rowsFor(volvoConfig, states);
    const fuel = rows.find((r) => r.key === 'fuel');
    expect(fuel?.value).toBe('5%');
    expect(fuel?.warn).toBe(true);
    expect(fuel?.fuelPercent).toBe(5);
  });

  it('aggregate rows carry the full offender list in title and target the first offender', () => {
    const states = {
      ...volvoStates,
      'binary_sensor.volvo_xc60_door_front_right': ent(
        'binary_sensor.volvo_xc60_door_front_right',
        'on',
      ),
      'binary_sensor.volvo_xc60_door_rear_right': ent(
        'binary_sensor.volvo_xc60_door_rear_right',
        'on',
      ),
    };
    const rows = rowsFor(volvoConfig, states);
    const doors = rows.find((r) => r.key === 'doors');
    expect(doors?.title).toBe('Front right, Rear right');
    expect(doors?.targetEntity).toBe('binary_sensor.volvo_xc60_door_front_right');
  });
});

// ---------------------------------------------------------------------------
// memberLabel()
// ---------------------------------------------------------------------------

describe('memberLabel', () => {
  it('explicit name wins', () => {
    expect(memberLabel({ entity: 'binary_sensor.x', name: 'Front left' }, {})).toBe('Front left');
  });

  it('strips the vehicle name and group noun from friendly_name', () => {
    const states: HassStates = {
      'binary_sensor.volvo_xc60_door_front_left': ent(
        'binary_sensor.volvo_xc60_door_front_left',
        'off',
        { friendly_name: 'Volvo XC60 Door front left' },
      ),
    };
    expect(
      memberLabel(
        { entity: 'binary_sensor.volvo_xc60_door_front_left' },
        states,
        'Volvo XC60',
        'door',
      ),
    ).toBe('Front left');
  });

  it('falls back to the object ID for missing entities', () => {
    expect(memberLabel({ entity: 'binary_sensor.some_door' }, {})).toBe('Some door');
  });
});
