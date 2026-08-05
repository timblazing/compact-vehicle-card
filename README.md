# Compact Vehicle Card

A slim, integration-agnostic vehicle card for Home Assistant. Your vehicle as a single
compact row that expands into **Overview** (odometer, fuel, range, doors, windows, …) and
**Maintenance** (tires, oil, brake fluid, coolant, washer fluid) sections.

Works with any vehicle integration — Volvo, Mercedes, BMW, Ford, Tesla, Kia/Hyundai
(`kia_uvo`), and anything else that exposes entities. Nothing manufacturer-specific is
hardcoded.

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=timblazing&repository=compact-vehicle-card&category=plugin)

## Screenshots

> Screenshots pending first release: collapsed clean, collapsed with Warning badge, expanded.

## Installation

### HACS (recommended)

1. HACS → three-dot menu (⋮) → **Custom repositories**
2. Repository: `https://github.com/timblazing/compact-vehicle-card` — Type: **Dashboard**
3. Search for **Compact Vehicle Card** in HACS and install it
4. Reload your browser (see [Troubleshooting](#troubleshooting) if the card doesn't appear)

### Manual

Download `compact-vehicle-card.js` from the [latest release](https://github.com/timblazing/compact-vehicle-card/releases),
copy it to `config/www/`, then add it as a dashboard resource:

```yaml
url: /local/compact-vehicle-card.js
type: module
```

## Quick start

The fast path is `prefix` auto-discovery. If your entities share a common prefix
(`sensor.volvo_xc60_odometer`, `lock.volvo_xc60_lock`, …), this is the whole config:

```yaml
type: custom:compact-vehicle-card
name: Volvo XC60
icon: mdi:car-estate
prefix: volvo_xc60
```

The card probes `sensor`, `binary_sensor`, `lock`, `cover`, and `switch` entities matching
the prefix and a list of well-known suffixes (odometer, range, fuel, doors, windows, tires,
fluids, …). Anything it can't find is simply omitted. Anything you set explicitly always
wins over auto-discovery — the visual editor shows what was discovered so you can override
it per slot.

## Configuration reference

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | string | **required** | `custom:compact-vehicle-card` |
| `name` | string | `Vehicle` | Header title |
| `icon` | string | `mdi:car` | Header icon |
| `prefix` | string | — | Entity object-ID prefix for auto-discovery |
| `engine_entity` | string | auto | Engine state; shown in the subtitle. Never raises a badge |
| `lock_entity` | string | auto | Lock; always-visible header icon, amber when unlocked |

### `display`

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `mode` | string | `expandable` | `expandable`, `expanded` (always open), or `compact` (header only) |
| `auto_expand_maintenance` | bool | `false` | Expand automatically when a maintenance Warning appears |
| `show_section_icons` | bool | `true` | Show the muted leading icon on each row |
| `show_dividers` | bool | `true` | Show 1px dividers between rows |
| `unknown_value` | string | `-` | Text shown for unknown/unavailable values |
| `fuel_warn_percent` | number | `15` | Fuel percent below which the fuel row turns amber |

### `overview`

| Option | Type | Description |
| --- | --- | --- |
| `odometer_entity` | string | Odometer sensor |
| `range_entity` | string | Remaining range sensor |
| `fuel.level_entity` | string | Direct fuel percent — wins if present |
| `fuel.amount_entity` | string | Fuel amount; used with capacity when no level entity |
| `fuel.capacity_entity` | string | Tank capacity |
| `doors` | list | Door sensors (see entity list format below) |
| `windows` | list | Window sensors |
| `sunroof_entity` | string | Sunroof sensor |
| `tailgate_entity` | string | Tailgate/trunk sensor |
| `hood_entity` | string | Hood sensor |

### `maintenance`

| Option | Type | Description |
| --- | --- | --- |
| `tires` | list | Tire pressure warning sensors |
| `oil_level_entity` | string | Oil level |
| `brake_fluid_entity` | string | Brake fluid |
| `coolant_level_entity` | string | Coolant level |
| `washer_fluid_entity` | string | Washer fluid |

### Entity list format

`doors`, `windows`, and `tires` accept bare entity IDs or objects:

```yaml
doors:
  - binary_sensor.car_door_front_left           # bare ID — name derived from friendly_name
  - entity: binary_sensor.car_door_front_right
    name: Front right                            # explicit name
  - entity: sensor.car_door_rear_left
    invert: true                                 # swap ok/problem interpretation
```

## Behavior notes

- `unknown` / `unavailable` render as `-` and never raise a warning. Aggregates never claim
  "All closed" while any member is unreadable.
- A status row (sunroof, tailgate, hood, fluids) whose entity has *never* reported a real
  state is hidden entirely — no permanent `-` noise from sensors your car doesn't have. Once
  a row has shown data, it sticks and shows `-` during outages instead of vanishing.
- The badge shows **Warning** (red) for any maintenance problem, **Attention** (amber) for
  any open aperture, and nothing when all is well. Low fuel colors the fuel row amber but
  never raises a badge.

## Supported integrations

Any integration whose entities describe a vehicle works. `prefix` auto-discovery is the fast
path when your integration names entities with a common prefix; explicit per-slot
configuration covers everything else.

## Troubleshooting

**"Custom element doesn't exist: compact-vehicle-card"** — the resource isn't loaded.
Confirm the card is installed in HACS (or the manual resource entry exists), then hard-refresh
the browser (Ctrl/Cmd+Shift+R). On mobile apps, pull down to refresh or clear the app cache.

**Card not updating after an upgrade** — browsers cache dashboard resources aggressively.
Hard-refresh, or bump the resource URL with a query string (`/local/compact-vehicle-card.js?v=2`).

**A row is missing** — either the entity didn't resolve (open the visual editor to see what
auto-discovery found) or the entity has never reported a real state (see Behavior notes).

## Contributing

```bash
npm ci
npm test         # vitest against the pure logic in src/entity-utils.ts
npm run build    # bundles dist/compact-vehicle-card.js
```

Manual acceptance checklist before a release: default light theme, default dark theme, a
custom theme, mobile width 380 px, sections view, masonry view, entity removed mid-session,
HA restart while expanded.

## License

[MIT](LICENSE)
