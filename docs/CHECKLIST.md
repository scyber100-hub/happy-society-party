# 행복사회당 홈페이지 작업 진행 체크리스트

## 진행 상태 범례
- ⬜ 미시작
- 🔄 진행중
- ✅ 완료
- ⏸️ 보류

---

## 1. 프로젝트 셋업

| 항목 | 상태 | 비고 |
|------|------|------|
| 프로젝트 디렉토리 생성 | ✅ | ~/happy-society-party |
| 개발 계획 문서 작성 | ✅ | docs/DEVELOPMENT_PLAN.md |
| TODO 리스트 작성 | ✅ | docs/TODO.md |
| 체크리스트 작성 | ✅ | docs/CHECKLIST.md |
| Next.js 프로젝트 초기화 | ✅ | Next.js 16.1.1 |
| Tailwind CSS 설정 | ✅ | globals.css |
| 디자인 토큰 설정 | ✅ | CSS Variables |
| 폴더 구조 정리 | ✅ | components, lib, types, hooks |
| Supabase 연동 | ✅ | 프로젝트 생성 및 클라이언트 설정 |

---

## 2. 디자인 시스템 & 공통 컴포넌트

| 항목 | 상태 | 비고 |
|------|------|------|
| 컬러 시스템 | ✅ | Primary: #1F6F6B |
| 타이포그래피 | ✅ | Noto Sans KR |
| 당 로고 | ✅ | public/images/logo.svg (3인 커뮤니티 형상) |
| Button 컴포넌트 | ✅ | components/ui/Button.tsx |
| Input 컴포넌트 | ✅ | components/ui/Input.tsx |
| Card 컴포넌트 | ✅ | components/ui/Card.tsx |
| Modal 컴포넌트 | ✅ | PostActions 내 신고 모달 구현 |
| Header 컴포넌트 | ✅ | components/layout/Header.tsx |
| Footer 컴포넌트 | ✅ | components/layout/Footer.tsx |
| Navigation 컴포넌트 | ✅ | Header에 포함 |

---

## 3. 공개 웹사이트 페이지

| 페이지 | 상태 | 라우트 |
|--------|------|--------|
| 메인 페이지 | ✅ | / |
| 당 소개 - 비전 | ✅ | /about/vision |
| 당 소개 - 역사 | ✅ | /about/history |
| 당 소개 - 조직도 | ✅ | /about/organization |
| 당 소개 - 당헌당규 | ✅ | /about/constitution |
| 정책 목록 | ✅ | /policies |
| 정책 상세 | ✅ | /policies/[id] |
| 소식 - 보도자료 | ✅ | /news/press |
| 소식 - 성명서 | ✅ | /news/statements |
| 소식 - 일정 | ✅ | /news/schedule |
| 입당 안내 | ✅ | /join |
| 후원 안내 | ✅ | /donate |

---

## 4. 회원 인증 시스템

| 항목 | 상태 | 비고 |
|------|------|------|
| 회원가입 4단계 통합 | ✅ | /join (Step 1~4) |
| 로그인 | ✅ | /auth/login |
| Supabase Auth 연동 | ✅ | useAuth 훅 구현 |
| OAuth (Google/Kakao) | ✅ | signInWithGoogle, signInWithKakao |
| 비밀번호 찾기 | ✅ | /auth/forgot-password |
| 비밀번호 재설정 | ✅ | /auth/reset-password |
| 휴대폰 인증 | ✅ | PhoneVerification 컴포넌트, RPC 함수 |
| 이메일 인증 | ✅ | /auth/verify-email, Supabase Auth |

---

## 5. 회원 포털

| 항목 | 상태 | 비고 |
|------|------|------|
| 대시보드 | ✅ | /portal |
| 내 프로필 | ✅ | /portal/profile |
| 프로필 수정 | ✅ | /portal/profile (수정 모드 포함) |
| 알림 목록 | ✅ | /portal/notifications |
| 당비 납부 현황 | ✅ | /portal/payments |

---

## 6. 커뮤니티

| 항목 | 상태 | 비고 |
|------|------|------|
| 커뮤니티 메인 | ✅ | /community |
| 지역/상임위 커뮤니티 통합 | ✅ | /community/[communityId] |
| 게시글 목록 | ✅ | 페이지네이션 포함 |
| 게시글 작성 | ✅ | /community/[communityId]/write |
| 게시글 상세 | ✅ | /community/[communityId]/posts/[postId] |
| 게시글 수정/삭제 | ✅ | edit 페이지 및 PostActions |
| 댓글 기능 | ✅ | CommentSection 컴포넌트 |
| 좋아요 기능 | ✅ | toggle_like RPC 함수 |
| 신고 기능 | ✅ | PostActions 내 신고 모달 |

---

## 7. 관리자 백엔드

| 항목 | 상태 | 비고 |
|------|------|------|
| 관리자 대시보드 | ✅ | /admin |
| 회원 관리 | ✅ | /admin/members (검색, 권한변경) |
| 게시글 관리 | ✅ | /admin/posts |
| 신고 관리 | ✅ | /admin/reports (상태변경, 삭제) |
| 커뮤니티 관리 | ✅ | /admin/communities |
| 설정 | ✅ | /admin/settings |

---

## 8. 백엔드 API (Supabase)

| 카테고리 | 상태 | 비고 |
|----------|------|------|
| 데이터베이스 스키마 | ✅ | 전체 테이블 설계 완료 |
| RLS 정책 | ✅ | 모든 테이블에 적용 |
| 인증 API | ✅ | Supabase Auth 사용 |
| 사용자 API | ✅ | user_profiles 테이블 |
| 커뮤니티 API | ✅ | communities 테이블 |
| 게시글 API | ✅ | posts 테이블 |
| 댓글 API | ✅ | comments 테이블 |
| 좋아요 API | ✅ | toggle_like RPC |
| 신고 API | ✅ | reports 테이블 |
| 결제 API | ✅ | 토스페이먼츠 연동 완료 |

---

## 9. 테스트 & 배포

| 항목 | 상태 | 비고 |
|------|------|------|
| 빌드 테스트 | ✅ | TypeScript 오류 없음 |
| 단위 테스트 작성 | ✅ | Jest + React Testing Library |
| 통합 테스트 작성 | ✅ | API 테스트 포함 |
| E2E 테스트 작성 | ✅ | Playwright |
| Docker 설정 | ✅ | Dockerfile, docker-compose.yml |
| CI/CD 설정 | ✅ | GitHub Actions |
| 스테이징 배포 | ✅ | Cloudflare Pages 설정 완료 |
| 프로덕션 배포 | ✅ | Cloudflare Pages 설정 완료 |

---

## 진행률 요약

| Phase | 완료 | 전체 | 진행률 |
|-------|------|------|--------|
| 1. 프로젝트 셋업 | 9 | 9 | 100% |
| 2. 디자인 시스템 | 10 | 10 | 100% |
| 3. 공개 웹사이트 | 12 | 12 | 100% |
| 4. 회원 인증 | 8 | 8 | 100% |
| 5. 회원 포털 | 5 | 5 | 100% |
| 6. 커뮤니티 | 9 | 9 | 100% |
| 7. 관리자 | 6 | 6 | 100% |
| 8. 백엔드 API | 10 | 10 | 100% |
| 9. 테스트 & 배포 | 8 | 8 | 100% |
| **전체** | **77** | **77** | **100%** |

---

*최종 업데이트: 2026-01-19*
