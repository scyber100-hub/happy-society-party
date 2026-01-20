# 행복사회당 홈페이지 배포 가이드

## 배포 옵션

### 1. Cloudflare Pages (권장)

Cloudflare Pages는 글로벌 엣지 네트워크를 통해 빠른 성능을 제공합니다.

#### 사전 준비
1. Cloudflare 계정 생성
2. GitHub 저장소 연결

#### 배포 방법

**방법 A: Cloudflare 대시보드에서 직접 배포**

1. [Cloudflare Dashboard](https://dash.cloudflare.com/) 접속
2. Workers & Pages > Create application > Pages
3. Connect to Git > GitHub 연결
4. 저장소 선택: `happy-society-party`
5. 빌드 설정:
   - Framework preset: `Next.js`
   - Build command: `cd frontend && npm run build`
   - Build output directory: `frontend/.next`
6. 환경 변수 설정:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY=your_client_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   TOSS_PAYMENTS_SECRET_KEY=your_secret_key
   ```
7. Save and Deploy 클릭

**방법 B: GitHub Actions 자동 배포**

1. GitHub 저장소 Settings > Secrets에 추가:
   - `CLOUDFLARE_API_TOKEN`: Cloudflare API 토큰
   - `CLOUDFLARE_ACCOUNT_ID`: Cloudflare 계정 ID
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY`
   - `TOSS_PAYMENTS_SECRET_KEY`

2. `main` 브랜치에 푸시하면 자동 배포

#### 커스텀 도메인 설정
1. Cloudflare Pages > Custom domains
2. 도메인 추가: `happysociety.party`
3. DNS 설정이 자동으로 구성됨

---

### 2. Docker 배포 (자체 서버)

VPS나 클라우드 서버에 Docker로 배포합니다.

#### 사전 준비
- Docker & Docker Compose 설치
- 서버 (최소 1GB RAM)
- 도메인 및 SSL 인증서

#### 배포 단계

```bash
# 1. 저장소 클론
git clone https://github.com/your-org/happy-society-party.git
cd happy-society-party

# 2. 환경 변수 설정
cp frontend/.env.example frontend/.env.local
nano frontend/.env.local  # 환경 변수 수정

# 3. SSL 인증서 설정 (Let's Encrypt)
mkdir -p nginx/ssl
certbot certonly --standalone -d happysociety.party
cp /etc/letsencrypt/live/happysociety.party/fullchain.pem nginx/ssl/
cp /etc/letsencrypt/live/happysociety.party/privkey.pem nginx/ssl/

# 4. 프로덕션 빌드 및 실행
docker-compose up -d --build

# 5. 상태 확인
docker-compose ps
curl http://localhost:3000/api/health
```

#### Docker Compose 명령어

```bash
# 시작
docker-compose up -d

# 중지
docker-compose down

# 로그 확인
docker-compose logs -f frontend

# 재빌드
docker-compose up -d --build

# 완전 초기화
docker-compose down -v --rmi all
```

---

### 3. Vercel 배포

Next.js 공식 플랫폼입니다.

#### 배포 방법

1. [Vercel](https://vercel.com) 접속 및 로그인
2. Import Git Repository
3. `frontend` 폴더를 Root Directory로 설정
4. 환경 변수 설정
5. Deploy 클릭

---

## 환경 변수

| 변수명 | 필수 | 설명 |
|--------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | O | Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | O | Supabase 공개 키 |
| `SUPABASE_SERVICE_ROLE_KEY` | O | Supabase 서비스 역할 키 |
| `NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY` | O | 토스페이먼츠 클라이언트 키 |
| `TOSS_PAYMENTS_SECRET_KEY` | O | 토스페이먼츠 시크릿 키 |
| `NEXT_PUBLIC_SITE_URL` | - | 사이트 URL |

---

## 배포 후 체크리스트

- [ ] 메인 페이지 로딩 확인
- [ ] 로그인/회원가입 동작 확인
- [ ] OAuth (Google/Kakao) 리다이렉트 URL 설정
- [ ] 결제 테스트 (테스트 모드)
- [ ] 이메일 발송 확인
- [ ] SSL 인증서 확인
- [ ] 모바일 반응형 확인
- [ ] 404/500 에러 페이지 확인

---

## 모니터링

### Health Check
```bash
curl https://happysociety.party/api/health
```

### Cloudflare Analytics
- Cloudflare Dashboard > Analytics & Logs

### 로그 확인 (Docker)
```bash
docker-compose logs -f frontend
```

---

## 롤백

### Cloudflare Pages
1. Deployments 탭에서 이전 배포 선택
2. "Rollback to this deployment" 클릭

### Docker
```bash
# 이전 이미지로 롤백
docker-compose down
docker tag happy-society-party:latest happy-society-party:backup
docker pull happy-society-party:previous-tag
docker-compose up -d
```

---

## 문제 해결

### 빌드 실패
```bash
# 로컬에서 빌드 테스트
cd frontend
npm run build
```

### 환경 변수 오류
- Cloudflare/Vercel 대시보드에서 환경 변수 확인
- `NEXT_PUBLIC_` 접두사 확인 (클라이언트용)

### SSL 인증서 갱신 (Docker)
```bash
certbot renew
cp /etc/letsencrypt/live/happysociety.party/* nginx/ssl/
docker-compose restart nginx
```

---

*최종 업데이트: 2026-01-19*
