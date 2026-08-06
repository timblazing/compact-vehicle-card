# Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.3] - 2026-08-05

### Changed

- Visual editor sections are now rendered directly as expansion panels holding small
  `ha-form` blocks instead of one `ha-form` with `expandable` groups. `ha-form` fixes its
  own row spacing inside its shadow root, so this is what makes the spacing fixes possible.
- More breathing room between the Entity prefix field and its description.
- Tighter spacing between the **Auto-expand on maintenance warning** and **Show row icons**
  toggles in Advanced.

### Fixed

- Display mode showed no selection until the user picked one. It now shows **Expandable**,
  which is what the card has always done by default, and can no longer be cleared to empty.
  New cards get `display.mode: expandable` in their stub config.

### Added

- README section covering planned features (v1.1 through v2.1) and what is deliberately
  out of scope.

## [1.0.2] - 2026-08-05

### Changed

- Visual editor restructured: all explicit entity pickers now live in a single
  **Custom Entities** section, keeping `prefix` auto-discovery the primary setup path.
  General is now prefix, name, icon, and display mode; the Display section became
  **Advanced** (auto-expand, row icons, unknown value text, low fuel threshold).
- Odometer and range values display as whole numbers (68,962 instead of 68,962.882).
- Binary-sensor status rows show meaningful text instead of raw on/off: sunroof,
  tailgate, and hood show Closed/Open; oil, brake fluid, coolant, and washer fluid
  show OK/Low.

### Removed

- `show_dividers` option (dividers are always on).
- Engine status dot in the header — just the status text now.
- Fuel level bar under the fuel row (temporarily).

## [1.0.1] - 2026-08-05

### Fixed

- Visual editor: typed values (name, prefix) and entity selections were erased instead of
  saving. The expandable form sections nested their data under the section name while the
  change handler expected flat keys; sections now use `flatten: true` and the handler also
  tolerates nested data from older frontends.

## [1.0.0] - 2026-08-05

### Added

- Initial release: slim collapsed vehicle row with expandable Overview and Maintenance sections.
- Integration-agnostic entity configuration with `prefix`-based auto-discovery.
- Three-tier status badge (Warning / Attention / none) with Warning precedence.
- State normalization handling `binary_sensor`, `lock`, and text-state sensors, with `invert` support.
- Aggregate rows for doors, windows, and tires with offender naming and safe unknown handling.
- Fuel percent from a direct level entity or amount/capacity, with a low-fuel bar and threshold.
- Row suppression for never-seen unknown sensors, with sticky rows across outages.
- `ha-form` visual editor showing auto-discovered entities.
- Keyboard-operable header, `aria-expanded`, `prefers-reduced-motion` support.
- HACS packaging (`hacs.json`, named `dist/` bundle, release workflow).
