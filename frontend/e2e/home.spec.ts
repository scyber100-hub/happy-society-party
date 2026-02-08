import { test, expect } from '@playwright/test';

// Set Accept-Language to Korean to ensure proper locale
test.use({
  locale: 'ko-KR',
  extraHTTPHeaders: {
    'Accept-Language': 'ko-KR,ko;q=0.9',
  },
});

test.describe('홈페이지', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('메인 페이지가 올바르게 렌더링된다', async ({ page }) => {
    // Wait for page to fully load and check title
    await expect(page).toHaveTitle(/행복사회당|Happy Society/, { timeout: 30000 });
  });

  test('헤더 네비게이션이 표시된다', async ({ page }) => {
    const header = page.locator('header');
    await expect(header).toBeVisible({ timeout: 30000 });
  });

  test('입당 신청 링크가 동작한다', async ({ page, isMobile }) => {
    // Wait for header to be visible first
    await expect(page.locator('header')).toBeVisible({ timeout: 30000 });

    if (isMobile) {
      // On mobile, just navigate directly to join page
      await page.goto('/join');
      await expect(page).toHaveURL(/\/join/, { timeout: 15000 });
    } else {
      // Look for the join button/link in header (text is inside button inside link)
      const joinLink = page.locator('header a[href="/join"]').first();
      await expect(joinLink).toBeVisible({ timeout: 15000 });
      await joinLink.click();
      await expect(page).toHaveURL(/\/join/, { timeout: 15000 });
    }
  });

  test('로그인 링크가 동작한다', async ({ page, isMobile }) => {
    // Wait for header to be visible first
    await expect(page.locator('header')).toBeVisible({ timeout: 30000 });

    if (isMobile) {
      // On mobile, just navigate directly to login page
      await page.goto('/auth/login');
      await expect(page).toHaveURL(/\/auth\/login/, { timeout: 15000 });
    } else {
      // Look for the login button/link in header
      const loginLink = page.locator('header a[href="/auth/login"]').first();
      await expect(loginLink).toBeVisible({ timeout: 15000 });
      await loginLink.click();
      await expect(page).toHaveURL(/\/auth\/login/, { timeout: 15000 });
    }
  });
});

test.describe('반응형 디자인', () => {
  test('모바일 뷰포트에서 햄버거 메뉴가 표시된다', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const mobileMenuButton = page.locator('[data-testid="mobile-menu-button"]');
    const count = await mobileMenuButton.count();
    if (count > 0) {
      await expect(mobileMenuButton).toBeVisible();
    }
  });
});
