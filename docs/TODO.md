# 행복사회당 홈페이지 TODO 리스트

## Phase 1: 프로젝트 기반 구축

### 1.1 프로젝트 셋업
- [ ] Next.js 14 프로젝트 생성 (App Router)
- [ ] TypeScript 설정
- [ ] Tailwind CSS 설정
- [ ] ESLint/Prettier 설정
- [ ] 폴더 구조 정리

### 1.2 디자인 시스템
- [ ] 디자인 토큰 설정 (colors, spacing, typography)
- [ ] Tailwind 테마 커스터마이징
- [ ] 기본 컴포넌트 라이브러리 구축
  - [ ] Button
  - [ ] Input
  - [ ] Card
  - [ ] Modal
  - [ ] Navigation
  - [ ] Footer

### 1.3 레이아웃
- [ ] 공개 웹사이트 레이아웃
- [ ] 회원 포털 레이아웃
- [ ] 관리자 레이아웃

---

## Phase 2: 공개 웹사이트

### 2.1 메인 페이지
- [ ] 히어로 섹션 (슬로건, CTA 버튼)
- [ ] 최신 소식 섹션
- [ ] 주요 정책 섹션
- [ ] 입당/후원 CTA 섹션
- [ ] 반응형 디자인

### 2.2 당 소개
- [ ] 비전 & 가치 페이지
- [ ] 역사 페이지
- [ ] 조직도 페이지
- [ ] 당헌당규 페이지

### 2.3 정책
- [ ] 정책 목록 페이지 (카테고리 필터)
- [ ] 정책 상세 페이지

### 2.4 소식
- [ ] 보도자료 목록/상세
- [ ] 성명서 목록/상세
- [ ] 일정 페이지

### 2.5 참여
- [ ] 입당 안내 페이지
- [ ] 후원 안내 페이지

---

## Phase 3: 회원 시스템

### 3.1 인증
- [ ] 회원가입 Step 1: 기본 정보
- [ ] 회원가입 Step 2: 지역 선택
- [ ] 회원가입 Step 3: 상임위 선택
- [ ] 회원가입 Step 4: 당비 결제
- [ ] 로그인 페이지
- [ ] 비밀번호 찾기
- [ ] 이메일/휴대폰 인증

### 3.2 결제
- [ ] PG 연동 (토스페이먼츠/아임포트)
- [ ] 당비 결제 (월/연)
- [ ] 후원 결제
- [ ] 결제 내역 조회

---

## Phase 4: 회원 포털

### 4.1 대시보드
- [ ] 내 활동 요약
- [ ] 알림 목록
- [ ] 내 커뮤니티 바로가기

### 4.2 프로필
- [ ] 프로필 조회
- [ ] 프로필 수정
- [ ] 비밀번호 변경
- [ ] 당비 납부 현황

---

## Phase 5: 커뮤니티

### 5.1 게시판
- [ ] 지역 커뮤니티 목록
- [ ] 상임위 커뮤니티 목록
- [ ] 게시글 목록 (페이지네이션, 검색)
- [ ] 게시글 작성
- [ ] 게시글 상세/수정/삭제
- [ ] 이미지 업로드

### 5.2 상호작용
- [ ] 댓글 CRUD
- [ ] 좋아요 기능
- [ ] 신고 기능

---

## Phase 6: 관리자 백엔드

### 6.1 대시보드
- [ ] 통계 요약 (회원수, 게시글, 신고)
- [ ] 최근 활동

### 6.2 회원 관리
- [ ] 회원 목록/검색
- [ ] 회원 상세/수정
- [ ] 역할 변경

### 6.3 콘텐츠 관리
- [ ] 게시글 관리
- [ ] 댓글 관리
- [ ] 신고 처리

### 6.4 설정
- [ ] 사이트 설정
- [ ] 커뮤니티 관리

---

## Phase 7: 백엔드 API

### 7.1 인증 API
- [ ] POST /api/v1/auth/register
- [ ] POST /api/v1/auth/login
- [ ] POST /api/v1/auth/logout
- [ ] POST /api/v1/auth/refresh
- [ ] POST /api/v1/auth/verify-phone
- [ ] POST /api/v1/auth/verify-email

### 7.2 사용자 API
- [ ] GET /api/v1/users/me
- [ ] PATCH /api/v1/users/me
- [ ] GET /api/v1/users/:id (admin)

### 7.3 커뮤니티 API
- [ ] GET /api/v1/communities
- [ ] GET /api/v1/communities/:id

### 7.4 게시글 API
- [ ] GET /api/v1/posts
- [ ] POST /api/v1/posts
- [ ] GET /api/v1/posts/:id
- [ ] PATCH /api/v1/posts/:id
- [ ] DELETE /api/v1/posts/:id

### 7.5 댓글 API
- [ ] GET /api/v1/posts/:postId/comments
- [ ] POST /api/v1/posts/:postId/comments
- [ ] PATCH /api/v1/comments/:id
- [ ] DELETE /api/v1/comments/:id

### 7.6 결제 API
- [ ] POST /api/v1/payments
- [ ] GET /api/v1/payments/history
- [ ] POST /api/v1/payments/webhook

---

## Phase 8: 테스트 & 배포

### 8.1 테스트
- [ ] 단위 테스트
- [ ] 통합 테스트
- [ ] E2E 테스트

### 8.2 배포
- [ ] 환경 변수 설정
- [ ] Docker 설정
- [ ] CI/CD 파이프라인
- [ ] 프로덕션 배포

---

*최종 업데이트: 2026-01-14*
