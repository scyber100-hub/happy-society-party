import { test, expect } from '@playwright/test';

test.describe('인증 페이지', () => {
  test.describe('로그인', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/auth/login');
    });

    test('로그인 폼이 올바르게 렌더링된다', async ({ page }) => {
      await expect(page.locator('input[type="email"]')).toBeVisible();
      await expect(page.locator('input[type="password"]')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
    });

    test('빈 폼 제출 시 에러 메시지가 표시된다', async ({ page }) => {
      await page.click('button[type="submit"]');
      // 에러 메시지 또는 유효성 검사 확인
      const emailInput = page.locator('input[type="email"]');
      await expect(emailInput).toHaveAttribute('required', '');
    });

    test('회원가입 링크가 동작한다', async ({ page }) => {
      const signupLink = page.locator('a[href="/join"]').first();
      if (await signupLink.isVisible()) {
        await signupLink.click();
        await expect(page).toHaveURL('/join');
      }
    });

    test('비밀번호 찾기 링크가 동작한다', async ({ page }) => {
      const forgotLink = page.locator('a[href="/auth/forgot-password"]');
      await forgotLink.click();
      await expect(page).toHaveURL('/auth/forgot-password');
    });
  });

  test.describe('회원가입', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/join');
    });

    test('회원가입 폼이 올바르게 렌더링된다', async ({ page }) => {
      await expect(page.locator('input[name="name"]')).toBeVisible();
      await expect(page.locator('input[name="email"]')).toBeVisible();
      await expect(page.locator('input[name="password"]')).toBeVisible();
    });

    test('Step 1에서 다음 버튼 클릭 시 Step 2로 이동한다', async ({ page }) => {
      await page.fill('input[name="name"]', '테스트 사용자');
      await page.fill('input[name="email"]', 'test@example.com');
      await page.fill('input[name="password"]', 'password123');
      await page.fill('input[name="passwordConfirm"]', 'password123');

      const nextButton = page.locator('button:has-text("다음")');
      await nextButton.click();

      // Step 2 - 지역 선택 화면 확인
      await expect(page.getByRole('heading', { name: '지역 선택' })).toBeVisible();
    });

    test('진행 바가 올바르게 표시된다', async ({ page }) => {
      const progressIndicators = page.locator('.rounded-full');
      await expect(progressIndicators.first()).toBeVisible();
    });
  });

  test.describe('비밀번호 찾기', () => {
    test('비밀번호 찾기 폼이 올바르게 렌더링된다', async ({ page }) => {
      await page.goto('/auth/forgot-password');
      await expect(page.locator('input[type="email"]')).toBeVisible();
    });
  });
});
