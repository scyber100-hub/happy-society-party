import { Card, CardContent } from '@/components/ui/Card';

export const metadata = {
  title: '개인정보처리방침 | 행복사회당',
  description: '행복사회당 개인정보처리방침',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[var(--gray-50)] py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-[var(--gray-900)] mb-8">개인정보처리방침</h1>

        <Card variant="default" className="bg-white">
          <CardContent className="prose prose-gray max-w-none">
            <p className="text-[var(--gray-600)] mb-6">
              행복사회당(이하 "당")은 개인정보보호법 등 관련 법령상의 개인정보보호 규정을 준수하며,
              당원 및 후원자의 개인정보 보호에 최선을 다하고 있습니다.
            </p>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-[var(--gray-900)] mb-4">제1조 (개인정보의 수집 및 이용 목적)</h2>
              <p className="text-[var(--gray-700)] mb-4">당은 다음의 목적을 위하여 개인정보를 처리합니다.</p>
              <ol className="list-decimal list-inside space-y-2 text-[var(--gray-700)]">
                <li>당원 관리: 당원 가입 및 관리, 당원 자격 확인, 서비스 제공 및 관련 공지사항 전달</li>
                <li>후원금 관리: 후원금 접수 및 관리, 기부금 영수증 발급, 정치자금법에 따른 보고</li>
                <li>민원 처리: 민원인의 신원 확인, 민원사항 확인, 처리 결과 통보</li>
                <li>커뮤니티 서비스: 게시글 작성, 댓글 작성 등 커뮤니티 기능 제공</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-[var(--gray-900)] mb-4">제2조 (수집하는 개인정보 항목)</h2>
              <p className="text-[var(--gray-700)] mb-4">당은 다음의 개인정보 항목을 수집하고 있습니다.</p>
              <ul className="list-disc list-inside space-y-2 text-[var(--gray-700)]">
                <li><strong>필수항목:</strong> 성명, 이메일 주소, 비밀번호, 휴대전화번호</li>
                <li><strong>선택항목:</strong> 거주지역, 관심 분야, 프로필 사진</li>
                <li><strong>후원 시 추가 수집:</strong> 생년월일, 주소, 직업, 국적</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-[var(--gray-900)] mb-4">제3조 (개인정보의 보유 및 이용 기간)</h2>
              <p className="text-[var(--gray-700)] mb-4">
                당은 법령에 따른 개인정보 보유 및 이용 기간 또는 정보주체로부터 개인정보 수집 시 동의받은
                개인정보 보유 및 이용 기간 내에서 개인정보를 처리 및 보유합니다.
              </p>
              <ul className="list-disc list-inside space-y-2 text-[var(--gray-700)]">
                <li>당원 정보: 당원 자격 유지 기간 및 탈당 후 1년</li>
                <li>후원 정보: 정치자금법에 따라 5년간 보존</li>
                <li>웹사이트 이용 기록: 3개월</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-[var(--gray-900)] mb-4">제4조 (개인정보의 제3자 제공)</h2>
              <p className="text-[var(--gray-700)] mb-4">
                당은 원칙적으로 정보주체의 개인정보를 제3자에게 제공하지 않습니다.
                다만, 다음의 경우에는 예외로 합니다.
              </p>
              <ul className="list-disc list-inside space-y-2 text-[var(--gray-700)]">
                <li>정보주체의 동의가 있는 경우</li>
                <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
                <li>정치자금법 등 관련 법령에 따른 보고 의무 이행</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-[var(--gray-900)] mb-4">제5조 (개인정보의 파기)</h2>
              <p className="text-[var(--gray-700)] mb-4">
                당은 개인정보 보유 기간의 경과, 처리 목적 달성 등 개인정보가 불필요하게 되었을 때에는
                지체 없이 해당 개인정보를 파기합니다.
              </p>
              <ul className="list-disc list-inside space-y-2 text-[var(--gray-700)]">
                <li>전자적 파일 형태: 복구 및 재생이 불가능하도록 안전하게 삭제</li>
                <li>종이 문서: 분쇄기로 분쇄하거나 소각</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-[var(--gray-900)] mb-4">제6조 (정보주체의 권리와 행사방법)</h2>
              <p className="text-[var(--gray-700)] mb-4">
                정보주체는 당에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.
              </p>
              <ol className="list-decimal list-inside space-y-2 text-[var(--gray-700)]">
                <li>개인정보 열람 요구</li>
                <li>오류 등이 있을 경우 정정 요구</li>
                <li>삭제 요구</li>
                <li>처리 정지 요구</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-[var(--gray-900)] mb-4">제7조 (개인정보의 안전성 확보 조치)</h2>
              <p className="text-[var(--gray-700)] mb-4">
                당은 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.
              </p>
              <ul className="list-disc list-inside space-y-2 text-[var(--gray-700)]">
                <li>관리적 조치: 내부관리계획 수립 및 시행, 직원 교육</li>
                <li>기술적 조치: 개인정보처리시스템 접근 권한 관리, 암호화 기술 적용, 보안프로그램 설치</li>
                <li>물리적 조치: 전산실, 자료보관실 등의 접근 통제</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-[var(--gray-900)] mb-4">제8조 (개인정보 보호책임자)</h2>
              <div className="bg-[var(--gray-50)] p-4 rounded-[var(--radius-md)] text-[var(--gray-700)]">
                <p><strong>개인정보 보호책임자</strong></p>
                <p>성명: 행복사회당 사무처장</p>
                <p>연락처: privacy@happysociety.party</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-[var(--gray-900)] mb-4">제9조 (개인정보처리방침의 변경)</h2>
              <p className="text-[var(--gray-700)]">
                이 개인정보처리방침은 2026년 1월 1일부터 적용됩니다.
                이전의 개인정보처리방침은 아래에서 확인하실 수 있습니다.
              </p>
            </section>

            <div className="text-sm text-[var(--gray-500)] mt-8 pt-4 border-t border-[var(--gray-200)]">
              <p>시행일: 2026년 1월 1일</p>
              <p>최종 수정일: 2026년 1월 22일</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
