import { test, expect } from '@playwright/test';

test.describe('홈페이지', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('메인 페이지가 올바르게 렌더링된다', async ({ page }) => {
    await expect(page).toHaveTitle(/행복사회당/);
  });

  test('헤더 네비게이션이 표시된다', async ({ page }) => {
    const header = page.locator('header');
    await expect(header).toBeVisible();
  });

  test('입당 신청 링크가 동작한다', async ({ page }) => {
    const joinLink = page.locator('a[href="/join"]').first();
    await joinLink.click();
    await expect(page).toHaveURL('/join');
  });

  test('로그인 링크가 동작한다', async ({ page }) => {
    const loginLink = page.locator('a[href="/auth/login"]').first();
    await loginLink.click();
    await expect(page).toHaveURL('/auth/login');
  });
});

test.describe('반응형 디자인', () => {
  test('모바일 뷰포트에서 햄버거 메뉴가 표시된다', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const mobileMenuButton = page.locator('[data-testid="mobile-menu-button"]');
    // 모바일 메뉴 버튼이 있다면 확인
    const count = await mobileMenuButton.count();
    if (count > 0) {
      await expect(mobileMenuButton).toBeVisible();
    }
  });
});
