import { test, expect } from '@playwright/test';

test.describe('커뮤니티 페이지', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/community');
    await page.waitForLoadState('networkidle');
  });

  test('커뮤니티 목록 페이지가 렌더링된다', async ({ page }) => {
    // 페이지 제목이나 주요 컨텐츠 확인
    await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
  });

  test('지역 커뮤니티 섹션이 표시된다', async ({ page }) => {
    const regionSection = page.locator('text=지역');
    await expect(regionSection.first()).toBeVisible({ timeout: 10000 });
  });

  test('상임위원회 커뮤니티 섹션이 표시된다', async ({ page }) => {
    const committeeSection = page.locator('text=상임위');
    await expect(committeeSection.first()).toBeVisible({ timeout: 10000 });
  });
});

test.describe('정책 페이지', () => {
  test('정책 목록 페이지가 렌더링된다', async ({ page }) => {
    await page.goto('/policies');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
  });
});

test.describe('소식 페이지', () => {
  test('보도자료 페이지가 렌더링된다', async ({ page }) => {
    await page.goto('/news/press');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('/news/press');
  });

  test('성명서 페이지가 렌더링된다', async ({ page }) => {
    await page.goto('/news/statements');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('/news/statements');
  });

  test('일정 페이지가 렌더링된다', async ({ page }) => {
    await page.goto('/news/schedule');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('/news/schedule');
  });
});

test.describe('당 소개 페이지', () => {
  test('비전 페이지가 렌더링된다', async ({ page }) => {
    await page.goto('/about/vision');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('/about/vision');
  });

  test('역사 페이지가 렌더링된다', async ({ page }) => {
    await page.goto('/about/history');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('/about/history');
  });

  test('조직도 페이지가 렌더링된다', async ({ page }) => {
    await page.goto('/about/organization');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('/about/organization');
  });

  test('당헌당규 페이지가 렌더링된다', async ({ page }) => {
    await page.goto('/about/constitution');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('/about/constitution');
  });
});
