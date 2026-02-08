# 행복사회당 홈페이지 개발 계획

## 1. 프로젝트 개요

### 1.1 비전
"모든 당원이 정책 논의에 쉽게 참여하고, 지역과 관심사 기반 커뮤니티에서 활발히 소통하는 디지털 정당 플랫폼"

### 1.2 핵심 목표
- 온라인 입당 및 당비 납부 전환율 향상
- 지역/상임위원회 기반 커뮤니티 활성화
- 당원 참여도 및 재방문율 증대

---

## 2. 기술 스택

| 구분 | 기술 |
|------|------|
| Frontend | Next.js 14+ (App Router), TypeScript, Tailwind CSS |
| Backend | NestJS (또는 Django) |
| Database | PostgreSQL |
| Storage | S3 호환 스토리지 |
| 인증 | JWT + 휴대폰/이메일 인증 |
| 결제 | PG 연동 (토스페이먼츠/아임포트) |

---

## 3. 시스템 아키텍처

```
┌─────────────────────────────────────────────────────────┐
│                    3-Tier Architecture                   │
├─────────────────┬─────────────────┬─────────────────────┤
│  공개 웹사이트   │   회원 포털      │    관리자 백엔드     │
│  (Public)       │   (Member)      │    (Admin)          │
├─────────────────┴─────────────────┴─────────────────────┤
│                      Next.js Frontend                    │
├─────────────────────────────────────────────────────────┤
│                      REST API (NestJS)                   │
├─────────────────────────────────────────────────────────┤
│                      PostgreSQL + S3                     │
└─────────────────────────────────────────────────────────┘
```

---

## 4. 사용자 역할 및 권한

| 역할 | 코드 | 설명 |
|------|------|------|
| 게스트 | G | 비로그인 방문자 |
| 일반회원 | U | 가입했으나 입당 전 |
| 당원 | M | 입당 완료 당원 |
| 운영자 | MOD | 커뮤니티 관리자 |
| 관리자 | ADM | 시스템 전체 관리 |

---

## 5. 핵심 기능 (MVP)

### 5.1 공개 웹사이트
- 메인 페이지 (히어로, 최신 소식, CTA)
- 당 소개 (비전, 역사, 조직도, 당헌당규)
- 정책 (카테고리별 정책 목록)
- 소식 (보도자료, 성명서, 일정)
- 참여 (입당안내, 후원안내)

### 5.2 회원가입 4단계
1. 기본 정보 (이름, 휴대폰, 이메일, 비밀번호)
2. 지역 선택 (시도 → 시군구)
3. 상임위원회 선택 (관심 정책 분야)
4. 당비 결제 (월/연 선택, PG 연동)

### 5.3 회원 포털
- 대시보드 (내 활동 요약, 알림)
- 내 커뮤니티 (지역, 상임위)
- 프로필 관리

### 5.4 커뮤니티
- 지역별 게시판 (시도/시군구)
- 상임위별 게시판 (정책 분야)
- 게시글 CRUD, 댓글, 좋아요
- 신고 기능

### 5.5 관리자
- 회원 관리
- 게시판/게시글 관리
- 신고 처리
- 기본 통계

---

## 6. 디자인 시스템

### 6.1 컬러
- Primary: #1F6F6B (청록색)
- Primary Light: #E6F2F1
- Secondary: #F5A623 (주황색)
- Error: #DC3545
- Success: #28A745

### 6.2 타이포그래피
- 주 폰트: Pretendard
- 보조 폰트: Noto Sans KR

### 6.3 간격
- 기본 단위: 4px
- 컴포넌트 간격: 8px, 16px, 24px, 32px

---

## 7. 데이터베이스 주요 테이블

```
users          - 사용자 기본 정보
user_profiles  - 상세 프로필
regions        - 지역 (시도/시군구)
committees     - 상임위원회
communities    - 커뮤니티 (지역/상임위 매핑)
posts          - 게시글
comments       - 댓글
reports        - 신고
payments       - 결제 내역
```

---

## 8. API 설계 원칙

- RESTful API
- 버전 관리: `/api/v1/`
- 응답 형식:
```json
{
  "success": true,
  "data": {},
  "message": "성공",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

---

## 9. 보안 요구사항

- HTTPS 필수
- JWT 토큰 기반 인증
- 비밀번호 bcrypt 해싱
- SQL Injection 방지
- XSS 방지
- CORS 설정
- Rate Limiting

---

## 10. 개발 우선순위

### Phase 1: 기반 구축
- 프로젝트 셋업
- 디자인 시스템 구현
- 인증 시스템

### Phase 2: 공개 웹사이트
- 메인 페이지
- 당 소개
- 정책/소식

### Phase 3: 회원 시스템
- 회원가입 플로우
- 로그인/로그아웃
- 결제 연동

### Phase 4: 커뮤니티
- 게시판 구현
- 댓글/좋아요
- 신고 기능

### Phase 5: 관리자
- 관리자 대시보드
- 회원/게시물 관리

---

---

## 11. 추가 기능 개발 계획 (Phase 9~12)

### 11.1 사용자 등급 체계 확장

기존 5단계 등급을 7단계로 확장:

| 등급 | 코드 | 조건 | 주요 권한 |
|------|------|------|----------|
| 게스트 | G | 미가입 | 공개 콘텐츠 열람 |
| 회원 | U | 이메일 인증 | 일부 커뮤니티, 후원 |
| 당원 | M | 입당 승인 + 당비 납부 | 전체 커뮤니티, 투표권, 활동 기록 |
| 활동당원 | AM | 활동점수 100점↑ | 공천 신청, 운영위원 피선거권 |
| 후보자 | C | 공천 신청 승인 | 공천 평가 대상 |
| 운영자 | MOD | 임명/선출 | 지역/위원회 관리 |
| 관리자 | ADM | 최고위 임명 | 시스템 전체 관리 |

### 11.2 활동 추적 시스템

#### 활동 유형 및 점수
| 활동 유형 | 점수 | 설명 |
|----------|------|------|
| 게시글 작성 | 5점 | 커뮤니티 게시글 |
| 댓글 작성 | 2점 | 게시글 댓글 |
| 행사 참여 | 10점 | 오프라인 행사 (QR 체크인) |
| 정책 제안 | 15점 | 정책 제안 작성 |
| 투표 참여 | 5점 | 당내 투표 참여 |
| 후원 | 별도 | 후원금액 비례 |

#### 활동 영역
- **지역 활동**: 소속 지역위원회 커뮤니티 활동
- **위원회 활동**: 소속 상임위원회 커뮤니티 활동
- **전국 활동**: 전국 단위 행사, 정책 투표

### 11.3 공천 시스템

#### 공천 프로세스
1. **신청** → 2. **자격심사** → 3. **3축평가** → 4. **심의** → 5. **확정**

#### 3축 평가 체계
```
최종점수 = (직접투표 × 0.4) + (지역활동 × 0.3) + (위원회활동 × 0.3)
```

| 평가 축 | 비중 | 평가 방법 |
|--------|------|----------|
| 직접 투표 | 40% | 당원 직접 투표 |
| 지역 활동 점수 | 30% | 해당 지역 활동 이력 |
| 위원회 활동 점수 | 30% | 소속 위원회 활동 이력 |

### 11.4 투표 시스템

#### 투표 유형
| 유형 | 참여 자격 | 용도 |
|------|----------|------|
| 당원 투표 | 당원 이상 | 당 대표 선출, 정책 결정 |
| 공천 투표 | 당원 이상 | 공천 후보 평가 |
| 위원회 투표 | 해당 위원회 당원 | 위원회 내부 결정 |
| 지역 투표 | 해당 지역 당원 | 지역위원회 결정 |

#### 투표 절차
1. **투표 공고** (숙의 기간 최소 7일)
2. **숙의 기간** (토론 게시판)
3. **투표 기간** (온라인 투표)
4. **개표** (자동 개표 및 결과 발표)
5. **이의 신청** (결과 이의 신청 기간)

### 11.5 국제 멀티테넌시 시스템

#### 테넌트 구조
```
국제연합 (happy-society.org)
├── 한국 지부 (happysociety.kr)
├── 일본 지부 (japan.happy-society.org)
├── 미국 지부 (usa.happy-society.org)
└── 기타 지부
```

#### 테넌트 격리
- **공유 DB + tenant_id**: 행 레벨 격리
- **RLS 정책**: Supabase RLS로 자동 격리
- **도메인 매핑**: 커스텀 도메인 지원

#### 국제 연대 모듈
- 국제 게시판 (각국 지부 공유)
- 국제 투표 (국제연합 의사결정)
- 연대 활동 (국제 행사, 공동 성명)
- 번역 시스템 (next-intl + AI 번역)

---

## 12. 추가 데이터베이스 스키마

### 12.1 활동 기록 테이블
```sql
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id),
  activity_type VARCHAR(50) NOT NULL,
  points INTEGER NOT NULL,
  scope VARCHAR(20) NOT NULL, -- 'national', 'regional', 'committee'
  scope_id UUID,
  reference_type VARCHAR(50),
  reference_id UUID,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 12.2 공천 테이블
```sql
CREATE TABLE nominations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id),
  election_type VARCHAR(50) NOT NULL,
  region_id UUID REFERENCES regions(id),
  status VARCHAR(20) DEFAULT 'pending',
  application_text TEXT,
  regional_score DECIMAL(5,2),
  committee_score DECIMAL(5,2),
  vote_score DECIMAL(5,2),
  final_score DECIMAL(5,2),
  reviewed_by UUID,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 12.3 투표 테이블
```sql
CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  vote_type VARCHAR(50) NOT NULL,
  scope VARCHAR(20) NOT NULL,
  scope_id UUID,
  options JSONB NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  deliberation_start TIMESTAMPTZ,
  min_participation INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'draft',
  result JSONB,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE vote_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vote_id UUID REFERENCES votes(id),
  user_id UUID REFERENCES user_profiles(id),
  selected_options JSONB NOT NULL,
  voted_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(vote_id, user_id)
);
```

### 12.4 테넌트 테이블 (국제연합용)
```sql
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  domain VARCHAR(255),
  logo_url TEXT,
  primary_color VARCHAR(7) DEFAULT '#1F6F6B',
  language VARCHAR(10) DEFAULT 'ko',
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

*작성일: 2026-01-14*
*업데이트: 2026-02-01 (Phase 9~12 추가)*
