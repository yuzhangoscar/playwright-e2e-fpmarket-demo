import { test as base, expect, Locator } from '@playwright/test';
import {
  BASE_URL,
  NAV_BUTTONS_TEXT,
  MOBILE_MENU_TOGGLE,
  MOBILE_NAV_MENU,
  LOADING_SPINNER,
  DEFAULT_TIMEOUT,
  NAVIGATION_TIMEOUT,
  ELEMENT_VISIBLE_TIMEOUT,
} from '@root/data/constant';

type CryptoComPageFixture = {
  navigateToExchange: () => Promise<void>;
  getNavigationItem: (itemText: string) => Locator;
  clickNavigationItem: (itemText: string) => Promise<void>;
  hoverNavigationItem: (itemText: string) => Promise<void>;
  verifyAllNavigationItemsVisible: () => Promise<boolean>;
  dismissCookieBanner: () => Promise<void>;
  waitForPageLoad: () => Promise<void>;
  isMobileView: () => Promise<boolean>;
  openMobileMenu: () => Promise<void>;
  verifyTradingPairLoaded: (pair?: string) => Promise<boolean>;
  getVisibleNavigationItems: () => Promise<string[]>;
};

export const test = base.extend<CryptoComPageFixture>({
  navigateToExchange: async ({ page }, use) => {
    const navigate = async (): Promise<void> => {
      await page.goto(BASE_URL, {
        waitUntil: 'domcontentloaded',
        timeout: DEFAULT_TIMEOUT,
      });
      await page.waitForLoadState('domcontentloaded', { timeout: DEFAULT_TIMEOUT });
    };

    await use(navigate);
  },

  getNavigationItem: async ({ page }, use) => {
    const getNavItem = (itemText: string): Locator => {
      // Multiple selector strategies for crypto.com navigation
      const selectors = [
        `nav a:has-text("${itemText}")`,
        `header a:has-text("${itemText}")`,
        `[role="navigation"] a:has-text("${itemText}")`,
        `a[href*="${itemText.toLowerCase()}"]`,
        `button:has-text("${itemText}")`,
        `[data-testid="${itemText.toLowerCase()}"]`,
        `[data-cy="${itemText.toLowerCase()}"]`,
      ];

      for (const selector of selectors) {
        const element = page.locator(selector).first();
        if (element) {
          return element;
        }
      }

      // Fallback to text search
      return page.locator(`text="${itemText}"`).first();
    };

    await use(getNavItem);
  },

  clickNavigationItem: async ({ page, getNavigationItem }, use) => {
    const clickNav = async (itemText: string): Promise<void> => {
      const navItem = getNavigationItem(itemText);

      // Wait for element to be visible and clickable
      await navItem.waitFor({ state: 'visible', timeout: ELEMENT_VISIBLE_TIMEOUT });
      await navItem.scrollIntoViewIfNeeded();

      // Check if element is clickable
      await expect(navItem).toBeEnabled({ timeout: 5000 });

      await navItem.click({ timeout: 10000 });

      // Wait for navigation to complete
      await page.waitForLoadState('domcontentloaded', { timeout: NAVIGATION_TIMEOUT });
    };

    await use(clickNav);
  },

  hoverNavigationItem: async ({ page, getNavigationItem }, use) => {
    const hoverNav = async (itemText: string): Promise<void> => {
      const navItem = getNavigationItem(itemText);

      await navItem.waitFor({ state: 'visible', timeout: ELEMENT_VISIBLE_TIMEOUT });
      await navItem.hover();

      // Wait for any dropdown/submenu to appear
      await page.waitForTimeout(1000);
    };

    await use(hoverNav);
  },

  verifyAllNavigationItemsVisible: async ({ getNavigationItem }, use) => {
    const verifyAllVisible = async (): Promise<boolean> => {
      try {
        for (const itemText of NAV_BUTTONS_TEXT) {
          const navItem = getNavigationItem(itemText);

          // Check if item is visible with a reasonable timeout
          const isVisible = await navItem.isVisible({ timeout: 5000 });

          if (!isVisible) {
            return false;
          }
        }

        return true;
      } catch {
        return false;
      }
    };

    await use(verifyAllVisible);
  },

  dismissCookieBanner: async ({ page }, use) => {
    const dismissCookies = async (): Promise<void> => {
      // Wait for page to settle
      await page.waitForTimeout(3000);

      // First, handle the cookie dialog
      const cookieDialog = page.locator('[role="dialog"]').first();

      if (await cookieDialog.isVisible({ timeout: 5000 })) {
        const dialogText = await cookieDialog.textContent();
        if (dialogText && dialogText.includes('We use cookies')) {
          // Try to click Accept button
          const acceptButton = cookieDialog.locator(
            'button:has-text("Accept non-essential cookies")'
          );
          if (await acceptButton.isVisible({ timeout: 2000 })) {
            await acceptButton.click();
            await page.waitForTimeout(2000);
          }
        }
      }

      // Second, handle the Skip/Next popup
      // Look for Skip button specifically
      const skipButton = page.locator('button:has-text("Skip")').first();
      if (await skipButton.isVisible({ timeout: 5000 })) {
        await skipButton.click();
        await page.waitForTimeout(2000);
        return;
      }

      // Alternative: look for any dialog with Skip/Next buttons
      const dialogs = await page
        .locator('[role="dialog"], .modal, [class*="modal"], [class*="popup"]')
        .all();
      for (let i = 0; i < dialogs.length; i++) {
        const dialog = dialogs[i];
        if (await dialog.isVisible({ timeout: 1000 })) {
          const skipBtn = dialog.locator('button:has-text("Skip")');
          if (await skipBtn.isVisible({ timeout: 1000 })) {
            await skipBtn.click();
            await page.waitForTimeout(2000);
            return;
          }
        }
      }
    };

    await use(dismissCookies);
  },

  waitForPageLoad: async ({ page }, use) => {
    const waitForLoad = async (): Promise<void> => {
      // Wait for loading spinners to disappear
      const loadingSpinner = page.locator(LOADING_SPINNER);
      if (await loadingSpinner.isVisible({ timeout: 5000 })) {
        await loadingSpinner.waitFor({ state: 'hidden', timeout: DEFAULT_TIMEOUT });
      }

      // Wait for main content to be loaded
      await page.waitForSelector('main, [role="main"], .main-content', {
        timeout: DEFAULT_TIMEOUT,
        state: 'visible',
      });
    };

    await use(waitForLoad);
  },

  isMobileView: async ({ page }, use) => {
    const checkMobile = async (): Promise<boolean> => {
      const viewport = page.viewportSize();
      return viewport ? viewport.width < 768 : false;
    };

    await use(checkMobile);
  },

  openMobileMenu: async ({ page }, use) => {
    const openMenu = async (): Promise<void> => {
      const mobileToggle = page.locator(MOBILE_MENU_TOGGLE);
      if (await mobileToggle.isVisible({ timeout: 5000 })) {
        await mobileToggle.click();

        // Wait for mobile menu to appear
        const mobileMenu = page.locator(MOBILE_NAV_MENU);
        await mobileMenu.waitFor({ state: 'visible', timeout: 5000 });
      }
    };

    await use(openMenu);
  },

  verifyTradingPairLoaded: async ({ page }, use) => {
    const verifyPair = async (pair: string = 'BTC_USD'): Promise<boolean> => {
      return page.url().includes(pair);
    };

    await use(verifyPair);
  },

  getVisibleNavigationItems: async ({ page }, use) => {
    const getVisibleItems = async (): Promise<string[]> => {
      const visibleItems: string[] = [];

      for (const itemText of NAV_BUTTONS_TEXT) {
        const navItem = page
          .locator(`a:has-text("${itemText}"), header a:has-text("${itemText}")`)
          .first();

        if (await navItem.isVisible({ timeout: 2000 })) {
          visibleItems.push(itemText);
        }
      }

      return visibleItems;
    };

    await use(getVisibleItems);
  },
});

export { expect };
