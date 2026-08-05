import { css } from 'lit';

export const cardStyles = css`
  :host {
    display: block;
  }

  ha-card {
    overflow: hidden;
  }

  /* ---- Header (collapsed state) ---- */
  .header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 14px;
    min-height: 60px;
    box-sizing: border-box;
    cursor: pointer;
    outline: none;
  }
  .header.no-toggle {
    cursor: default;
  }
  .header:focus-visible {
    box-shadow: inset 0 0 0 2px var(--primary-color, #03a9f4);
    border-radius: var(--ha-card-border-radius, 12px);
  }

  .marque {
    flex: none;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.06);
    color: var(--primary-text-color, #212121);
  }
  .marque ha-icon {
    --mdc-icon-size: 22px;
  }

  .titles {
    flex: 1;
    min-width: 0;
  }
  .title {
    font-size: 15px;
    font-weight: 600;
    color: var(--primary-text-color, #212121);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .subtitle {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: var(--secondary-text-color, #727272);
  }
  .badge {
    flex: none;
    display: flex;
    align-items: center;
    gap: 4px;
    height: 26px;
    padding: 0 10px;
    border-radius: 13px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
  }
  .badge ha-icon {
    --mdc-icon-size: 14px;
  }
  .badge.warning {
    color: var(--error-color, #db4437);
    background: color-mix(in srgb, var(--error-color, #db4437) 16%, transparent);
  }
  .badge.attention {
    color: var(--warning-color, #ffa600);
    background: color-mix(in srgb, var(--warning-color, #ffa600) 16%, transparent);
  }

  .lock-button {
    flex: none;
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    color: var(--secondary-text-color, #727272);
    cursor: pointer;
    padding: 0;
  }
  .lock-button ha-icon {
    --mdc-icon-size: 20px;
  }
  .lock-button.unlocked {
    color: var(--warning-color, #ffa600);
  }
  .lock-button:hover,
  .lock-button:focus-visible {
    background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.06);
    outline: none;
  }

  .chevron {
    flex: none;
    color: var(--secondary-text-color, #727272);
    transition: transform 0.28s ease;
  }
  .chevron ha-icon {
    --mdc-icon-size: 20px;
  }
  .chevron.open {
    transform: rotate(180deg);
  }
  @media (prefers-reduced-motion: reduce) {
    .chevron {
      transition: none;
    }
  }

  /* ---- Expand/collapse mechanics (§10) ---- */
  .body {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.28s ease;
  }
  .body.open {
    grid-template-rows: 1fr;
  }
  .body > .inner {
    overflow: hidden;
    min-height: 0;
  }
  @media (prefers-reduced-motion: reduce) {
    .body {
      transition: none;
    }
  }

  .sections {
    padding: 0 14px 14px;
  }

  .section-heading {
    font-size: 14px;
    font-weight: 600;
    color: var(--primary-text-color, #212121);
    margin: 4px 0 6px;
  }

  .section {
    border-radius: 12px;
    background: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.04);
    padding: 0 10px;
  }

  /* ---- Rows ---- */
  .row {
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: 38px;
    cursor: pointer;
    border-bottom: 1px solid var(--divider-color, #e0e0e0);
  }
  .row:last-child {
    border-bottom: none;
  }

  .row-icon {
    flex: none;
    color: var(--secondary-text-color, #727272);
    opacity: 0.7;
    display: flex;
  }
  .row-icon ha-icon {
    --mdc-icon-size: 18px;
  }

  .row-label {
    flex: none;
    font-size: 13px;
    color: var(--primary-text-color, #212121);
  }

  .row-value {
    flex: 1;
    min-width: 0;
    font-size: 13px;
    font-weight: 500;
    text-align: right;
    color: var(--secondary-text-color, #727272);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .row-value.warn {
    color: var(--warning-color, #ffa600);
  }
  .row-value.error {
    color: var(--error-color, #db4437);
    font-weight: 600;
  }
`;
