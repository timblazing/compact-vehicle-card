import {
  DEFAULT_FUEL_WARN_PERCENT,
  DEFAULT_UNKNOWN_VALUE,
  GROUP_SUFFIXES,
  OK_STATES,
  PROBE_DOMAINS,
  SLOT_SUFFIXES,
  UNKNOWN_STATES,
} from './constants';
import type {
  AggregateResult,
  BadgeResult,
  CompactVehicleCardConfig,
  EntityRef,
  HassEntity,
  HassStates,
  NormalizedState,
  ResolvedEntities,
  ResolvedEntityRef,
} from './types';

// ---------------------------------------------------------------------------
// Normalization (§7)
// ---------------------------------------------------------------------------

export function normalize(
  stateObj: HassEntity | undefined,
  opts: { invert?: boolean } = {},
): NormalizedState {
  const result = normalizeRaw(stateObj);
  if (opts.invert && result !== 'unknown') {
    return result === 'ok' ? 'problem' : 'ok';
  }
  return result;
}

function normalizeRaw(stateObj: HassEntity | undefined): NormalizedState {
  if (!stateObj) return 'unknown';
  const state = stateObj.state;
  if (state == null || UNKNOWN_STATES.has(state.toLowerCase())) return 'unknown';

  const domain = stateObj.entity_id.split('.')[0];
  if (domain === 'binary_sensor') return state === 'on' ? 'problem' : 'ok';
  if (domain === 'lock') return state === 'locked' ? 'ok' : 'problem';

  return OK_STATES.has(state.toLowerCase()) ? 'ok' : 'problem';
}

export function isUnknownState(stateObj: HassEntity | undefined): boolean {
  return !stateObj || UNKNOWN_STATES.has(stateObj.state.toLowerCase());
}

// ---------------------------------------------------------------------------
// Entity ref helpers
// ---------------------------------------------------------------------------

export function toResolvedRef(ref: EntityRef): ResolvedEntityRef {
  return typeof ref === 'string' ? { entity: ref } : ref;
}

/**
 * Derive a short member label: explicit name wins, else the friendly_name with
 * the vehicle-name prefix and the group noun stripped
 * ("Volvo XC60 Door front left" -> "Front left").
 */
export function memberLabel(
  ref: ResolvedEntityRef,
  states: HassStates,
  vehicleName?: string,
  groupNoun?: string,
): string {
  if (ref.name) return ref.name;
  const stateObj = states[ref.entity];
  let label = stateObj?.attributes.friendly_name ?? ref.entity.split('.')[1] ?? ref.entity;
  if (vehicleName && label.toLowerCase().startsWith(vehicleName.toLowerCase())) {
    label = label.slice(vehicleName.length).trim();
  }
  if (groupNoun) {
    const noun = groupNoun.toLowerCase();
    const lower = label.toLowerCase();
    if (lower.startsWith(noun + ' ')) label = label.slice(noun.length + 1);
    else if (lower.endsWith(' ' + noun)) label = label.slice(0, label.length - noun.length - 1);
  }
  label = label.replace(/_/g, ' ').trim();
  if (!label) return ref.entity;
  return label.charAt(0).toUpperCase() + label.slice(1).toLowerCase();
}

// ---------------------------------------------------------------------------
// Aggregation (§8)
// ---------------------------------------------------------------------------

export interface AggregateLabels {
  /** Text when every member is ok, e.g. "All closed" or "OK". */
  allOk: string;
  /** Verb appended to offender names, e.g. "open" or "warning". */
  problemVerb: string;
  unknownValue?: string;
}

export function aggregate(
  refs: ResolvedEntityRef[],
  states: HassStates,
  labels: AggregateLabels,
  memberNames?: string[],
): AggregateResult {
  const unknownValue = labels.unknownValue ?? DEFAULT_UNKNOWN_VALUE;
  if (refs.length === 0) {
    return { status: 'unknown', text: '', offenders: [], targetEntity: null };
  }

  const results = refs.map((ref, i) => ({
    ref,
    name: memberNames?.[i] ?? ref.name ?? ref.entity,
    state: normalize(states[ref.entity], { invert: ref.invert }),
  }));

  const problems = results.filter((r) => r.state === 'problem');
  const unknowns = results.filter((r) => r.state === 'unknown');
  const firstEntity = refs[0]?.entity ?? null;

  if (problems.length > 0) {
    const offenders = problems.map((p) => p.name);
    let text: string;
    if (problems.length === 1) {
      text = `${offenders[0]} ${labels.problemVerb}`;
    } else if (problems.length <= 3) {
      const [first, ...rest] = offenders;
      text = `${first}, ${rest.map((n) => n.toLowerCase()).join(', ')} ${labels.problemVerb}`;
    } else {
      text = `${problems.length} ${labels.problemVerb}`;
    }
    return {
      status: 'problem',
      text,
      offenders,
      targetEntity: problems[0]?.ref.entity ?? firstEntity,
    };
  }

  if (unknowns.length > 0) {
    // Never claim the car is secure on incomplete data.
    return { status: 'unknown', text: unknownValue, offenders: [], targetEntity: firstEntity };
  }

  return { status: 'ok', text: labels.allOk, offenders: [], targetEntity: firstEntity };
}

// ---------------------------------------------------------------------------
// Fuel (§5)
// ---------------------------------------------------------------------------

export function fuelPercent(
  states: HassStates,
  levelEntity?: string,
  amountEntity?: string,
  capacityEntity?: string,
): number | null {
  if (levelEntity) {
    const level = numericState(states[levelEntity]);
    if (level !== null) return clampPercent(level);
  }
  if (amountEntity && capacityEntity) {
    const amount = numericState(states[amountEntity]);
    const capacity = numericState(states[capacityEntity]);
    if (amount !== null && capacity !== null && capacity > 0) {
      return clampPercent((amount / capacity) * 100);
    }
  }
  return null;
}

function numericState(stateObj: HassEntity | undefined): number | null {
  if (!stateObj || UNKNOWN_STATES.has(stateObj.state.toLowerCase())) return null;
  const value = Number(stateObj.state);
  return Number.isFinite(value) ? value : null;
}

function clampPercent(value: number): number {
  return Math.min(100, Math.max(0, Math.round(value)));
}

// ---------------------------------------------------------------------------
// Badge (§9)
// ---------------------------------------------------------------------------

export interface BadgeInput {
  apertures: { label: string; refs: ResolvedEntityRef[] }[];
  maintenance: { label: string; refs: ResolvedEntityRef[] }[];
}

export function computeBadge(input: BadgeInput, states: HassStates): BadgeResult {
  const problemsIn = (groups: { label: string; refs: ResolvedEntityRef[] }[]): string[] =>
    groups
      .filter((g) =>
        g.refs.some((ref) => normalize(states[ref.entity], { invert: ref.invert }) === 'problem'),
      )
      .map((g) => g.label);

  const maintenanceProblems = problemsIn(input.maintenance);
  if (maintenanceProblems.length > 0) return { tier: 'warning', items: maintenanceProblems };

  const apertureProblems = problemsIn(input.apertures);
  if (apertureProblems.length > 0) return { tier: 'attention', items: apertureProblems };

  return { tier: null, items: [] };
}

// ---------------------------------------------------------------------------
// Auto-discovery (§6)
// ---------------------------------------------------------------------------

function probe(prefix: string, suffixes: string[], states: HassStates): string | undefined {
  for (const suffix of suffixes) {
    for (const domain of PROBE_DOMAINS) {
      const id = `${domain}.${prefix}_${suffix}`;
      if (id in states) return id;
    }
  }
  return undefined;
}

function probeGroup(prefix: string, suffixes: string[], states: HassStates): ResolvedEntityRef[] {
  const hits: ResolvedEntityRef[] = [];
  for (const suffix of suffixes) {
    for (const domain of PROBE_DOMAINS) {
      const id = `${domain}.${prefix}_${suffix}`;
      if (id in states) {
        hits.push({ entity: id });
        break;
      }
    }
  }
  return hits;
}

/**
 * Resolve every slot from explicit config first, then fill gaps by probing
 * `prefix`-based candidates. Explicit config always wins (§6.3).
 */
export function resolveEntities(
  config: CompactVehicleCardConfig,
  states: HassStates,
): ResolvedEntities {
  const prefix = config.prefix;
  const slot = (explicit: string | undefined, key: string): string | undefined => {
    if (explicit) return explicit;
    if (!prefix) return undefined;
    const suffixes = SLOT_SUFFIXES[key];
    return suffixes ? probe(prefix, suffixes, states) : undefined;
  };
  const group = (explicit: EntityRef[] | undefined, key: string): ResolvedEntityRef[] => {
    if (explicit && explicit.length > 0) return explicit.map(toResolvedRef);
    if (!prefix) return [];
    const suffixes = GROUP_SUFFIXES[key];
    return suffixes ? probeGroup(prefix, suffixes, states) : [];
  };

  const overview = config.overview ?? {};
  const maintenance = config.maintenance ?? {};
  const fuel = overview.fuel ?? {};

  return {
    engine: slot(config.engine_entity, 'engine'),
    lock: slot(config.lock_entity, 'lock'),
    odometer: slot(overview.odometer_entity, 'odometer'),
    range: slot(overview.range_entity, 'range'),
    fuel_level: slot(fuel.level_entity, 'fuel_level'),
    fuel_amount: slot(fuel.amount_entity, 'fuel_amount'),
    fuel_capacity: slot(fuel.capacity_entity, 'fuel_capacity'),
    doors: group(overview.doors, 'doors'),
    windows: group(overview.windows, 'windows'),
    sunroof: slot(overview.sunroof_entity, 'sunroof'),
    tailgate: slot(overview.tailgate_entity, 'tailgate'),
    hood: slot(overview.hood_entity, 'hood'),
    tires: group(maintenance.tires, 'tires'),
    oil: slot(maintenance.oil_level_entity, 'oil'),
    brake_fluid: slot(maintenance.brake_fluid_entity, 'brake_fluid'),
    coolant: slot(maintenance.coolant_level_entity, 'coolant'),
    washer_fluid: slot(maintenance.washer_fluid_entity, 'washer_fluid'),
  };
}

// ---------------------------------------------------------------------------
// Row model (§7 row suppression, §10 layout)
// ---------------------------------------------------------------------------

export type RowKind = 'value' | 'status' | 'aggregate';

export interface Row {
  key: string;
  section: 'overview' | 'maintenance';
  kind: RowKind;
  label: string;
  icon: string;
  value: string;
  status: NormalizedState;
  /** Entity opened by more-info on tap. */
  targetEntity: string | null;
  /** Full offender list for the title attribute on truncated aggregates. */
  title?: string;
  /** True when the value should render in the warning color (low fuel, open aperture). */
  warn?: boolean;
  /** Fuel bar percent, only set on the fuel row. */
  fuelPercent?: number | null;
}

export interface VisibleRowsOptions {
  unknownValue?: string;
  fuelWarnPercent?: number;
  /** Entity IDs that have rendered a real (non-unknown) state during this element's lifetime. */
  seen?: ReadonlySet<string>;
  vehicleName?: string;
}

const APERTURE_LABELS = { allOk: 'All closed', problemVerb: 'open' };
const TIRE_LABELS = { allOk: 'OK', problemVerb: 'warning' };

export function displayState(stateObj: HassEntity | undefined, unknownValue: string): string {
  if (!stateObj || UNKNOWN_STATES.has(stateObj.state.toLowerCase())) return unknownValue;
  const raw = stateObj.state.replace(/_/g, ' ');
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

export function formatValue(stateObj: HassEntity | undefined, unknownValue: string): string {
  if (!stateObj || UNKNOWN_STATES.has(stateObj.state.toLowerCase())) return unknownValue;
  const unit = stateObj.attributes.unit_of_measurement;
  const num = Number(stateObj.state);
  const text = Number.isFinite(num) ? Math.trunc(num).toLocaleString('en-US') : stateObj.state;
  return unit ? `${text} ${unit}` : text;
}

interface StatusRowSpec {
  key: string;
  section: 'overview' | 'maintenance';
  label: string;
  icon: string;
  entity: string | undefined;
  okText: string;
  problemText: string;
}

/**
 * Build the full visible-row model for both sections. Pure: seen-entity
 * tracking is passed in, not stored.
 */
export function visibleRows(
  resolved: ResolvedEntities,
  states: HassStates,
  icons: Record<string, string>,
  opts: VisibleRowsOptions = {},
): Row[] {
  const unknownValue = opts.unknownValue ?? DEFAULT_UNKNOWN_VALUE;
  const fuelWarn = opts.fuelWarnPercent ?? DEFAULT_FUEL_WARN_PERCENT;
  const seen = opts.seen ?? new Set<string>();
  const rows: Row[] = [];

  // -- Value rows: never suppressed once configured (§7 guard 2).
  if (resolved.odometer) {
    rows.push({
      key: 'odometer',
      section: 'overview',
      kind: 'value',
      label: 'Odometer',
      icon: icons.odometer ?? '',
      value: formatValue(states[resolved.odometer], unknownValue),
      status: 'ok',
      targetEntity: resolved.odometer,
    });
  }

  const hasFuel =
    resolved.fuel_level !== undefined ||
    (resolved.fuel_amount !== undefined && resolved.fuel_capacity !== undefined);
  if (hasFuel) {
    const percent = fuelPercent(
      states,
      resolved.fuel_level,
      resolved.fuel_amount,
      resolved.fuel_capacity,
    );
    rows.push({
      key: 'fuel',
      section: 'overview',
      kind: 'value',
      label: 'Fuel level',
      icon: icons.fuel ?? '',
      value: percent === null ? unknownValue : `${percent}%`,
      status: 'ok',
      targetEntity: resolved.fuel_level ?? resolved.fuel_amount ?? null,
      warn: percent !== null && percent < fuelWarn,
      fuelPercent: percent,
    });
  }

  if (resolved.range) {
    rows.push({
      key: 'range',
      section: 'overview',
      kind: 'value',
      label: 'Range',
      icon: icons.range ?? '',
      value: formatValue(states[resolved.range], unknownValue),
      status: 'ok',
      targetEntity: resolved.range,
    });
  }

  // -- Aggregate rows: rendered whenever the group has resolved members (§8).
  const aggregates: {
    key: string;
    section: 'overview' | 'maintenance';
    label: string;
    icon: string;
    refs: ResolvedEntityRef[];
    labels: AggregateLabels;
    noun: string;
  }[] = [
    {
      key: 'doors',
      section: 'overview',
      label: 'Doors',
      icon: icons.doors ?? '',
      refs: resolved.doors,
      labels: APERTURE_LABELS,
      noun: 'door',
    },
    {
      key: 'windows',
      section: 'overview',
      label: 'Windows',
      icon: icons.windows ?? '',
      refs: resolved.windows,
      labels: APERTURE_LABELS,
      noun: 'window',
    },
  ];

  const statusRows: StatusRowSpec[] = [
    {
      key: 'sunroof',
      section: 'overview',
      label: 'Sunroof',
      icon: icons.sunroof ?? '',
      entity: resolved.sunroof,
      okText: 'Closed',
      problemText: 'Open',
    },
    {
      key: 'tailgate',
      section: 'overview',
      label: 'Tailgate',
      icon: icons.tailgate ?? '',
      entity: resolved.tailgate,
      okText: 'Closed',
      problemText: 'Open',
    },
    {
      key: 'hood',
      section: 'overview',
      label: 'Hood',
      icon: icons.hood ?? '',
      entity: resolved.hood,
      okText: 'Closed',
      problemText: 'Open',
    },
  ];

  const pushAggregate = (spec: (typeof aggregates)[number]): void => {
    if (spec.refs.length === 0) return; // group with zero members is suppressed
    const names = spec.refs.map((ref) => memberLabel(ref, states, opts.vehicleName, spec.noun));
    const agg = aggregate(spec.refs, states, { ...spec.labels, unknownValue }, names);
    rows.push({
      key: spec.key,
      section: spec.section,
      kind: 'aggregate',
      label: spec.label,
      icon: spec.icon,
      value: agg.text,
      status: agg.status,
      targetEntity: agg.targetEntity,
      title: agg.offenders.length > 0 ? agg.offenders.join(', ') : undefined,
      warn: spec.section === 'overview' && agg.status === 'problem',
    });
  };

  const pushStatus = (spec: StatusRowSpec): void => {
    if (!spec.entity) return;
    const stateObj = states[spec.entity];
    const status = normalize(stateObj);
    const everSeen = seen.has(spec.entity);
    if (status === 'unknown' && !everSeen) return; // never-seen unknown rows are suppressed (§7)
    // Binary sensors report raw on/off; show the row's own ok/problem wording instead.
    const isBinary = spec.entity.startsWith('binary_sensor.');
    const value =
      status === 'unknown'
        ? unknownValue
        : isBinary
          ? status === 'problem'
            ? spec.problemText
            : spec.okText
          : displayState(stateObj, unknownValue);
    rows.push({
      key: spec.key,
      section: spec.section,
      kind: 'status',
      label: spec.label,
      icon: spec.icon,
      value,
      status,
      targetEntity: spec.entity,
      warn: spec.section === 'overview' && status === 'problem',
    });
  };

  for (const agg of aggregates) pushAggregate(agg);
  for (const spec of statusRows) pushStatus(spec);

  // -- Maintenance section.
  pushAggregate({
    key: 'tires',
    section: 'maintenance',
    label: 'Tire pressure',
    icon: icons.tires ?? '',
    refs: resolved.tires,
    labels: TIRE_LABELS,
    noun: 'tire',
  });

  const fluidRows: StatusRowSpec[] = [
    {
      key: 'oil',
      section: 'maintenance',
      label: 'Oil level',
      icon: icons.oil ?? '',
      entity: resolved.oil,
      okText: 'OK',
      problemText: 'Low',
    },
    {
      key: 'brake_fluid',
      section: 'maintenance',
      label: 'Brake fluid',
      icon: icons.brake_fluid ?? '',
      entity: resolved.brake_fluid,
      okText: 'OK',
      problemText: 'Low',
    },
    {
      key: 'coolant',
      section: 'maintenance',
      label: 'Coolant level',
      icon: icons.coolant ?? '',
      entity: resolved.coolant,
      okText: 'OK',
      problemText: 'Low',
    },
    {
      key: 'washer_fluid',
      section: 'maintenance',
      label: 'Washer fluid',
      icon: icons.washer_fluid ?? '',
      entity: resolved.washer_fluid,
      okText: 'OK',
      problemText: 'Low',
    },
  ];
  for (const spec of fluidRows) pushStatus(spec);

  return rows;
}

/** Badge input derived from the resolved entity map (§9: engine and lock never contribute). */
export function badgeInput(resolved: ResolvedEntities): BadgeInput {
  const single = (entity: string | undefined): ResolvedEntityRef[] => (entity ? [{ entity }] : []);
  return {
    apertures: [
      { label: 'Doors', refs: resolved.doors },
      { label: 'Windows', refs: resolved.windows },
      { label: 'Sunroof', refs: single(resolved.sunroof) },
      { label: 'Tailgate', refs: single(resolved.tailgate) },
      { label: 'Hood', refs: single(resolved.hood) },
    ],
    maintenance: [
      { label: 'Tire pressure', refs: resolved.tires },
      { label: 'Oil level', refs: single(resolved.oil) },
      { label: 'Brake fluid', refs: single(resolved.brake_fluid) },
      { label: 'Coolant level', refs: single(resolved.coolant) },
      { label: 'Washer fluid', refs: single(resolved.washer_fluid) },
    ],
  };
}
