/**
 * Localization stub — English only in v1.0. Kept as the single funnel for
 * user-facing strings so a real localizer can drop in later without touching
 * the component.
 */
const STRINGS: Record<string, string> = {
  'badge.warning': 'Warning',
  'badge.attention': 'Attention',
  'section.overview': 'Overview',
  'section.maintenance': 'Maintenance',
  'state.not_running': 'Not running',
  'state.running': 'Running',
};

export function localize(key: string): string {
  return STRINGS[key] ?? key;
}
