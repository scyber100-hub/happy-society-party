import { test, expect } from '@playwright/test';

test.describe('커뮤니티 페이지', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/community');
  });

  test('커뮤니티 목록 페이지가 렌더링된다', async ({ page }) => {
    await expect(page.locator('h1')).toBeVisible();
  });

  test('지역 커뮤니티 섹션이 표시된다', async ({ page }) => {
    const regionSection = page.locator('text=지역');
    await expect(regionSection.first()).toBeVisible();
  });

  test('상임위원회 커뮤니티 섹션이 표시된다', async ({ page }) => {
    const committeeSection = page.locator('text=상임위');
    await expect(committeeSection.first()).toBeVisible();
  });
});

test.describe('정책 페이지', () => {
  test('정책 목록 페이지가 렌더링된다', async ({ page }) => {
    await page.goto('/policies');
    await expect(page.locator('h1')).toBeVisible();
  });
});

test.describe('소식 페이지', () => {
  test('보도자료 페이지가 렌더링된다', async ({ page }) => {
    await page.goto('/news/press');
    await expect(page).toHaveURL('/news/press');
  });

  test('성명서 페이지가 렌더링된다', async ({ page }) => {
    await page.goto('/news/statements');
    await expect(page).toHaveURL('/news/statements');
  });

  test('일정 페이지가 렌더링된다', async ({ page }) => {
    await page.goto('/news/schedule');
    await expect(page).toHaveURL('/news/schedule');
  });
});

test.describe('당 소개 페이지', () => {
  test('비전 페이지가 렌더링된다', async ({ page }) => {
    await page.goto('/about/vision');
    await expect(page).toHaveURL('/about/vision');
  });

  test('역사 페이지가 렌더링된다', async ({ page }) => {
    await page.goto('/about/history');
    await expect(page).toHaveURL('/about/history');
  });

  test('조직도 페이지가 렌더링된다', async ({ page }) => {
    await page.goto('/about/organization');
    await expect(page).toHaveURL('/about/organization');
  });

  test('당헌당규 페이지가 렌더링된다', async ({ page }) => {
    await page.goto('/about/constitution');
    await expect(page).toHaveURL('/about/constitution');
  });
});
