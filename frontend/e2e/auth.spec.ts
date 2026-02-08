import { test, expect } from '@playwright/test';

// Set Accept-Language to Korean to ensure proper locale
test.use({
  locale: 'ko-KR',
  extraHTTPHeaders: {
    'Accept-Language': 'ko-KR,ko;q=0.9',
  },
});

test.describe('인증 페이지', () => {
  test.describe('로그인', () => {
    test.beforeEach(async ({ page }) => {
      // Go directly to login page (default locale doesn't need prefix)
      await page.goto('/auth/login');
      await page.waitForLoadState('networkidle');
    });

    test('로그인 폼이 올바르게 렌더링된다', async ({ page }) => {
      await expect(page.locator('input[name="email"]')).toBeVisible({ timeout: 15000 });
      await expect(page.locator('input[name="password"]')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
    });

    test('빈 폼 제출 시 에러 메시지가 표시된다', async ({ page }) => {
      const submitButton = page.locator('button[type="submit"]');
      await submitButton.click();
      // Check for required attribute or validation
      const emailInput = page.locator('input[name="email"]');
      await expect(emailInput).toHaveAttribute('required', '');
    });

    test('회원가입 링크가 동작한다', async ({ page }) => {
      // Use the signup link in the login form area (not header/footer)
      const signupLink = page.getByRole('link', { name: '입당 신청하기' });
      await expect(signupLink).toBeVisible({ timeout: 15000 });
      await signupLink.click();
      await expect(page).toHaveURL(/\/join/, { timeout: 15000 });
    });

    test('비밀번호 찾기 링크가 동작한다', async ({ page }) => {
      const forgotLink = page.getByRole('link', { name: '비밀번호 찾기' });
      await expect(forgotLink).toBeVisible({ timeout: 15000 });
      await forgotLink.click();
      await expect(page).toHaveURL(/\/auth\/forgot-password/, { timeout: 15000 });
    });
  });

  test.describe('회원가입', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/join');
      await page.waitForLoadState('networkidle');
    });

    test('회원가입 폼이 올바르게 렌더링된다', async ({ page }) => {
      await expect(page.locator('input[name="name"]')).toBeVisible({ timeout: 15000 });
      await expect(page.locator('input[name="email"]')).toBeVisible();
      await expect(page.locator('input[name="password"]')).toBeVisible();
    });

    test('Step 1에서 다음 버튼 클릭 시 Step 2로 이동한다', async ({ page }) => {
      // Wait for the form to load
      await expect(page.locator('input[name="name"]')).toBeVisible({ timeout: 15000 });

      await page.fill('input[name="name"]', '테스트 사용자');
      await page.fill('input[name="email"]', 'test@example.com');
      await page.fill('input[name="password"]', 'password123');
      await page.fill('input[name="passwordConfirm"]', 'password123');

      const nextButton = page.locator('button:has-text("다음")');
      await nextButton.click();

      // Step 2 - 지역 선택 화면 확인
      await expect(page.locator('text=지역').first()).toBeVisible({ timeout: 15000 });
    });

    test('진행 바가 올바르게 표시된다', async ({ page }) => {
      const progressIndicators = page.locator('.rounded-full');
      await expect(progressIndicators.first()).toBeVisible({ timeout: 15000 });
    });
  });

  test.describe('비밀번호 찾기', () => {
    test('비밀번호 찾기 폼이 올바르게 렌더링된다', async ({ page }) => {
      await page.goto('/auth/forgot-password');
      await page.waitForLoadState('networkidle');
      await expect(page.locator('input[name="email"]')).toBeVisible({ timeout: 15000 });
    });
  });
});
