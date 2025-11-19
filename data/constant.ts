export const BASE_URL: string = process.env.BASE_URL || 'https://crypto.com/exchange/trade/BTC_USD';

// Main navigation menu items for crypto.com exchange
export const NAV_BUTTONS_TEXT: string[] = [
  'Markets',
  'Trade',
  'Bots',
  'Yield',
  'Institutions & Partners',
  'VIP',
  'More',
];

export const LOADING_SPINNER: string = "[data-testid='loading-spinner']";

// Timeouts (in milliseconds)
export const DEFAULT_TIMEOUT: number = 15000;
export const NAVIGATION_TIMEOUT: number = 8000;
export const ELEMENT_VISIBLE_TIMEOUT: number = 10000;
