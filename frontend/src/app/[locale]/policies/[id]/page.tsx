import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { PolicySummary } from '@/components/ai';
import {
  Briefcase,
  HeartPulse,
  GraduationCap,
  Leaf,
  Bot,
  Vote,
  Home,
  Handshake,
  Scale,
  HardHat,
  Hospital,
  Users,
  BookOpen,
  Globe,
  Zap,
  Cpu,
  ShieldCheck,
  Landmark,
  Building2,
  type LucideIcon,
} from 'lucide-react';

// 카테고리별 아이콘
const categoryIcons: Record<string, LucideIcon> = {
  economy: Briefcase,
  welfare: HeartPulse,
  education: GraduationCap,
  environment: Leaf,
  technology: Bot,
  democracy: Vote,
  housing: Home,
};

// 정책별 아이콘
const policyIcons: Record<string, LucideIcon> = {
  'cooperative-economy': Handshake,
  'inequality-reduction': Scale,
  'labor-respect': HardHat,
  'public-healthcare': Hospital,
  'care-society': Users,
  'equal-education': BookOpen,
  'climate-action': Globe,
  'green-energy': Zap,
  'ai-governance': Cpu,
  'digital-rights': ShieldCheck,
  'economic-democracy': Landmark,
  'participatory-democracy': Vote,
  'housing-stability': Building2,
};

// 정책 카테고리
const categories: Record<string, { name: string }> = {
  economy: { name: '경제·노동' },
  welfare: { name: '복지·돌봄' },
  education: { name: '교육' },
  environment: { name: '환경·에너지' },
  technology: { name: '기술·AI' },
  democracy: { name: '민주주의' },
  housing: { name: '주거' },
};

// 정책 상세 데이터
const policiesDetailData: Record<string, {
  id: string;
  category: string;
  title: string;
  summary: string;
  background: string;
  vision: string;
  keyPolicies: { title: string; description: string }[];
  expectedEffects: string[];
  relatedPolicies: string[];
}> = {
  'cooperative-economy': {
    id: 'cooperative-economy',
    category: 'economy',
    title: '협력경제 실현',
    summary: '무한 경쟁 대신 협력과 연대의 가치가 존중받는 경제 체제를 만듭니다.',
    background: `현재 우리 사회는 무한 경쟁의 논리가 지배하고 있습니다. 기업은 생존을 위해 경쟁에 매몰되고, 노동자는 고용 불안에 시달리며, 자영업자는 대기업의 골목상권 진출로 생존을 위협받고 있습니다.

이러한 경쟁 중심의 경제 체제는 승자독식의 구조를 만들어 양극화를 심화시키고, 사회 전체의 지속가능성을 위협합니다. 우리는 경쟁이 아닌 협력을 통해 모두가 함께 잘 살 수 있는 경제 체제로 전환해야 합니다.`,
    vision: `협력경제는 경쟁보다 협력을, 이윤보다 사람을, 성장보다 지속가능성을 우선시하는 경제 체제입니다. 협동조합, 사회적기업, 마을기업 등 사회적경제 조직을 중심으로 지역사회와 구성원이 함께 성장하는 경제를 만들어 갑니다.`,
    keyPolicies: [
      {
        title: '협동조합 및 사회적경제 기업 육성',
        description: '사회적경제 기업에 대한 금융 지원 확대, 공공조달 우선구매 확대, 사회적경제 전문인력 양성 등을 통해 협동조합과 사회적경제 생태계를 강화합니다.',
      },
      {
        title: '상생협력 중심의 산업생태계 구축',
        description: '대기업과 중소기업 간의 불공정 거래 관행을 근절하고, 납품단가 공정화, 기술탈취 방지, 상생결제 시스템 확대를 통해 협력적 산업생태계를 조성합니다.',
      },
      {
        title: '지역순환경제 활성화',
        description: '지역 내 생산-소비-재투자가 순환하는 지역경제 모델을 구축합니다. 지역화폐 활성화, 로컬푸드 직거래 확대, 지역 일자리 창출을 지원합니다.',
      },
      {
        title: '플랫폼 협동조합 육성',
        description: '독점적 플랫폼 기업에 대항하여 이용자와 노동자가 소유하고 운영하는 플랫폼 협동조합을 육성합니다.',
      },
    ],
    expectedEffects: [
      '사회적경제 기업 일자리 50만개 창출',
      '지역경제 자립도 30% 향상',
      '중소기업-대기업 격차 축소',
      '지역 내 경제순환율 증가',
    ],
    relatedPolicies: ['inequality-reduction', 'labor-respect', 'economic-democracy'],
  },
  'inequality-reduction': {
    id: 'inequality-reduction',
    category: 'economy',
    title: '불평등 해소',
    summary: '자산과 소득의 불평등을 해소하고 누구나 존엄한 삶을 보장합니다.',
    background: `대한민국의 소득 및 자산 불평등은 OECD 국가 중 최악의 수준입니다. 상위 10%가 전체 자산의 60% 이상을 보유하고, 청년층은 '수저론'에 절망하며, 노인 빈곤율은 OECD 1위입니다.

불평등은 단순히 경제 문제가 아닙니다. 건강, 교육, 주거, 문화 등 삶의 모든 영역에서 격차를 만들어내고, 사회 이동성을 저하시켜 세대를 넘어 불평등이 대물림됩니다.`,
    vision: `우리는 능력에 따른 정당한 차이는 인정하되, 출발선의 불평등과 과도한 부의 집중은 해소해야 한다고 믿습니다. 누구나 열심히 일하면 인간다운 삶을 영위할 수 있고, 타고난 배경과 관계없이 자신의 가능성을 펼칠 수 있는 사회를 만들겠습니다.`,
    keyPolicies: [
      {
        title: '누진적 자산세 및 상속세 강화',
        description: '초고액 자산가에 대한 자산세를 도입하고, 상속세 최고세율 인상 및 공제 축소를 통해 부의 세습을 억제합니다.',
      },
      {
        title: '최저임금 현실화 및 생활임금 확대',
        description: '최저임금을 중위임금의 60% 수준으로 현실화하고, 지방자치단체의 생활임금 제도를 전국적으로 확대합니다.',
      },
      {
        title: '기본소득 단계적 도입',
        description: '청년, 농민, 예술인 등 취약계층을 대상으로 한 기본소득제를 시행하고, 단계적으로 전 국민 기본소득으로 확대합니다.',
      },
      {
        title: '공정한 조세 체계 확립',
        description: '금융소득 종합과세 강화, 주식 양도차익 과세 확대, 법인세 정상화를 통해 조세 정의를 실현합니다.',
      },
    ],
    expectedEffects: [
      '소득 하위 20% 실질소득 30% 향상',
      '자산 상위 10% 집중도 10%p 감소',
      '청년층 자산형성 기회 확대',
      '노인 빈곤율 OECD 평균 수준으로 개선',
    ],
    relatedPolicies: ['cooperative-economy', 'labor-respect', 'public-healthcare'],
  },
  'labor-respect': {
    id: 'labor-respect',
    category: 'economy',
    title: '노동 존중',
    summary: '일하는 사람이 정당한 대우를 받고 안전하게 일할 수 있게 합니다.',
    background: `대한민국은 OECD 국가 중 가장 긴 노동시간, 높은 산업재해율, 낮은 노동소득분배율을 기록하고 있습니다. 비정규직 노동자는 정규직의 절반 수준 임금을 받고, 플랫폼 노동자는 기본적인 노동권도 보장받지 못합니다.

노동은 단순한 비용이 아니라 사회의 근간입니다. 노동이 존중받지 못하는 사회는 지속가능하지 않습니다.`,
    vision: `우리는 모든 노동이 정당하게 평가받고, 노동자가 안전하고 건강하게 일할 수 있으며, 일과 삶의 균형을 이룰 수 있는 사회를 만들겠습니다.`,
    keyPolicies: [
      {
        title: '노동시간 단축 및 워라밸 보장',
        description: '주 4일제 근무를 단계적으로 도입하고, 연장근로 제한 강화, 휴가 사용 활성화를 통해 일과 삶의 균형을 보장합니다.',
      },
      {
        title: '산업안전 강화 및 중대재해 근절',
        description: '중대재해처벌법 강화, 산업안전 감독 인력 확대, 사업주 안전보건 의무 강화를 통해 일터에서 더 이상 죽지 않도록 합니다.',
      },
      {
        title: '플랫폼 노동자 권리 보장',
        description: '플랫폼 노동자를 노동자로 인정하고, 사회보험 적용 확대, 단체교섭권 보장 등 기본적인 노동권을 보장합니다.',
      },
      {
        title: '비정규직 차별 철폐',
        description: '동일노동 동일임금 원칙 확립, 비정규직 사용 사유 제한, 정규직 전환 지원을 통해 비정규직 차별을 해소합니다.',
      },
    ],
    expectedEffects: [
      '산업재해 사망률 50% 감소',
      '비정규직 임금격차 80% 수준으로 개선',
      '주당 평균 노동시간 OECD 평균 수준으로 단축',
      '노동소득분배율 5%p 향상',
    ],
    relatedPolicies: ['cooperative-economy', 'inequality-reduction', 'economic-democracy'],
  },
  'public-healthcare': {
    id: 'public-healthcare',
    category: 'welfare',
    title: '공공의료 강화',
    summary: '의료의 공공성을 강화하여 모든 시민이 건강권을 누립니다.',
    background: `코로나19 팬데믹은 우리 의료체계의 민낯을 드러냈습니다. 공공의료 비중이 OECD 최하위인 상황에서, 지방의 의료 공백, 필수의료 기피, 응급실 뺑뺑이 등 의료 접근성 문제가 심각합니다.

건강은 기본권입니다. 소득이나 지역에 관계없이 누구나 양질의 의료 서비스를 받을 수 있어야 합니다.`,
    vision: `우리는 의료를 시장이 아닌 공공의 영역으로 전환하여, 모든 시민이 필요할 때 적절한 의료 서비스를 받을 수 있는 사회를 만들겠습니다.`,
    keyPolicies: [
      {
        title: '공공병원 확충 및 의료 공공성 강화',
        description: '권역별 공공병원을 확충하고, 공공의대 설립, 공공의료 인력 확대를 통해 의료의 공공성을 강화합니다.',
      },
      {
        title: '건강보험 보장성 확대',
        description: '비급여 항목의 급여화를 확대하고, 본인부담 상한제 강화, 재난적 의료비 지원 확대로 의료비 부담을 낮춥니다.',
      },
      {
        title: '지역의료 격차 해소',
        description: '의료 취약지역 의료기관 지원, 원격진료 시범사업, 응급의료체계 강화를 통해 지역 간 의료 격차를 해소합니다.',
      },
      {
        title: '필수의료 살리기',
        description: '응급·외상·소아·산부인과 등 필수의료에 대한 수가 현실화, 의료인력 처우 개선, 의료사고 안전망 구축을 추진합니다.',
      },
    ],
    expectedEffects: [
      '공공의료 병상 비율 30%로 확대',
      '건강보험 보장률 80% 달성',
      '의료 취약지역 50% 감소',
      '응급실 이송 시간 전국 평균화',
    ],
    relatedPolicies: ['care-society', 'inequality-reduction'],
  },
  'care-society': {
    id: 'care-society',
    category: 'welfare',
    title: '돌봄사회 구현',
    summary: '아동, 노인, 장애인 돌봄의 사회적 책임을 강화합니다.',
    background: `저출생·고령화 시대에 돌봄은 개인과 가족의 문제가 아닌 사회 전체의 과제입니다. 현재 돌봄의 대부분은 여성이 담당하고 있으며, 이는 여성의 경력단절과 경제적 불평등으로 이어지고 있습니다.

또한 돌봄노동자들은 저임금과 열악한 노동조건에 시달리고 있어, 돌봄의 질도 담보되지 못하고 있습니다.`,
    vision: `우리는 돌봄을 사회가 함께 책임지는 '돌봄사회'를 만들겠습니다. 돌봄을 받는 사람도, 돌봄을 제공하는 사람도 존엄하게 대우받는 사회입니다.`,
    keyPolicies: [
      {
        title: '국공립 어린이집 확대',
        description: '국공립 어린이집 이용률을 50%까지 확대하고, 공보육 체계를 강화하여 양질의 보육 서비스를 보장합니다.',
      },
      {
        title: '노인돌봄 공공서비스 강화',
        description: '장기요양보험 확대, 공공요양시설 확충, 재가돌봄 서비스 강화를 통해 노인 돌봄의 공공성을 높입니다.',
      },
      {
        title: '장애인 자립생활 지원 확대',
        description: '활동지원서비스 확대, 탈시설화 지원, 장애인 권익옹호 체계 강화를 통해 장애인의 자립과 사회참여를 지원합니다.',
      },
      {
        title: '돌봄노동자 처우 개선',
        description: '돌봄노동자의 임금 인상, 고용 안정, 사회적 인정을 통해 돌봄의 가치를 높입니다.',
      },
    ],
    expectedEffects: [
      '국공립 어린이집 이용률 50% 달성',
      '돌봄노동자 임금 평균 30% 인상',
      '여성 경력단절 비율 20%p 감소',
      '장애인 탈시설 비율 2배 확대',
    ],
    relatedPolicies: ['public-healthcare', 'equal-education'],
  },
  'equal-education': {
    id: 'equal-education',
    category: 'education',
    title: '평등한 교육',
    summary: '모든 아이에게 평등한 교육 기회를 보장합니다.',
    background: `대한민국의 교육은 극심한 경쟁과 불평등으로 얼룩져 있습니다. 부모의 경제력이 자녀의 교육 수준을 결정하고, 사교육비 부담은 가계를 압박합니다. 입시 위주의 교육은 학생들의 다양한 가능성을 억압하고 있습니다.

교육은 계층 이동의 사다리여야 합니다. 그러나 현재의 교육은 오히려 불평등을 고착화하는 도구가 되고 있습니다.`,
    vision: `우리는 부모의 배경과 관계없이 모든 아이가 자신의 잠재력을 충분히 발휘할 수 있는 평등한 교육을 실현하겠습니다.`,
    keyPolicies: [
      {
        title: '무상교육 확대 및 교육비 부담 해소',
        description: '고등학교까지 완전 무상교육을 실현하고, 대학 등록금 부담 경감, 학자금 대출 이자 면제를 추진합니다.',
      },
      {
        title: '공교육 정상화 및 사교육비 경감',
        description: '학교 내 방과후 프로그램 강화, 돌봄교실 확대, 교육과정 내실화를 통해 공교육만으로 충분한 교육이 이뤄지도록 합니다.',
      },
      {
        title: '입시경쟁 완화 및 다양한 진로 보장',
        description: '대입 전형 단순화, 고교학점제 내실화, 직업교육 강화를 통해 다양한 진로를 존중하는 교육을 실현합니다.',
      },
      {
        title: '교육격차 해소',
        description: '저소득층 교육 지원 확대, 농어촌 교육 투자 강화, 교육복지 프로그램 확대로 출발선의 평등을 보장합니다.',
      },
    ],
    expectedEffects: [
      '가계 사교육비 부담 30% 경감',
      '대학 등록금 OECD 평균 수준으로 인하',
      '교육 격차 지수 20% 개선',
      '공교육 만족도 80% 달성',
    ],
    relatedPolicies: ['care-society', 'inequality-reduction'],
  },
  'climate-action': {
    id: 'climate-action',
    category: 'environment',
    title: '기후위기 대응',
    summary: '탄소중립을 실현하고 지속가능한 미래를 만듭니다.',
    background: `기후위기는 더 이상 미래의 문제가 아닙니다. 폭염, 홍수, 산불 등 이상기후 현상이 일상화되고 있으며, 이로 인한 피해는 취약계층에게 집중되고 있습니다.

파리협정에 따라 전 세계는 2050년 탄소중립을 목표로 하고 있으나, 현재의 정책으로는 목표 달성이 어렵습니다.`,
    vision: `우리는 기후위기에 적극적으로 대응하여 2050년 탄소중립을 실현하고, 기후정의에 기반한 공정한 전환을 추진하겠습니다.`,
    keyPolicies: [
      {
        title: '2035년 재생에너지 50% 목표',
        description: '태양광, 풍력 등 재생에너지 발전 비중을 2035년까지 50%로 확대하고, 에너지 효율 향상을 통해 전력 수요를 관리합니다.',
      },
      {
        title: '정의로운 전환 지원',
        description: '석탄발전소 폐쇄 지역, 내연기관 산업 노동자 등 전환 과정에서 피해를 입는 계층에 대한 지원 프로그램을 마련합니다.',
      },
      {
        title: '그린뉴딜 일자리 100만개 창출',
        description: '재생에너지, 전기차, 건물 에너지 효율화 등 녹색 산업에서 양질의 일자리 100만개를 만듭니다.',
      },
      {
        title: '탄소세 도입 및 탄소배당',
        description: '탄소에 가격을 부과하는 탄소세를 도입하고, 그 수익을 시민에게 균등하게 배당하는 탄소배당제를 시행합니다.',
      },
    ],
    expectedEffects: [
      '2030년 온실가스 2018년 대비 50% 감축',
      '재생에너지 일자리 50만개 창출',
      '에너지 수입 의존도 20%p 감소',
      '탄소배당을 통한 저소득층 지원',
    ],
    relatedPolicies: ['green-energy', 'cooperative-economy'],
  },
  'green-energy': {
    id: 'green-energy',
    category: 'environment',
    title: '에너지 전환',
    summary: '화석연료에서 벗어나 재생에너지 중심의 에너지 체계로 전환합니다.',
    background: `우리나라는 에너지의 94%를 수입에 의존하고 있으며, 화석연료와 원자력 중심의 에너지 체계는 기후위기와 안전 문제를 야기하고 있습니다.

반면 재생에너지 비중은 OECD 최하위 수준으로, 에너지 전환이 시급합니다.`,
    vision: `우리는 안전하고 깨끗한 에너지로의 전환을 통해 에너지 자립과 기후위기 대응을 동시에 달성하겠습니다.`,
    keyPolicies: [
      {
        title: '탈석탄·탈핵 에너지 정책 추진',
        description: '석탄발전소를 단계적으로 폐쇄하고, 신규 원전 건설을 중단하며, 기존 원전의 안전한 폐로를 추진합니다.',
      },
      {
        title: '재생에너지 발전 확대',
        description: '태양광, 풍력, 수소 등 재생에너지 발전 용량을 대폭 확대하고, 재생에너지 산업 육성을 지원합니다.',
      },
      {
        title: '에너지 자립 마을 조성',
        description: '지역 주민이 참여하는 에너지 협동조합, 마을 발전소 등을 육성하여 에너지 자립 마을을 조성합니다.',
      },
      {
        title: '건물 에너지 효율화',
        description: '건물 단열 강화, 제로에너지 건물 확대 등을 통해 에너지 효율을 높이고 에너지 비용을 절감합니다.',
      },
    ],
    expectedEffects: [
      '재생에너지 비중 2035년 50% 달성',
      '에너지 자립률 30%로 향상',
      '에너지 빈곤층 50% 감소',
      '관련 산업 일자리 30만개 창출',
    ],
    relatedPolicies: ['climate-action', 'cooperative-economy'],
  },
  'ai-governance': {
    id: 'ai-governance',
    category: 'technology',
    title: 'AI 시대 대응',
    summary: 'AI와 기술 발전이 사람을 위해 작동하고 혜택이 공평하게 나눠지도록 합니다.',
    background: `AI 기술의 급속한 발전은 사회 전반에 큰 변화를 가져오고 있습니다. 생산성 향상과 새로운 가능성을 열어주는 동시에, 일자리 대체, 알고리즘 차별, 프라이버시 침해 등 새로운 문제도 야기하고 있습니다.

기술 발전의 혜택이 소수에게 집중되고 피해는 다수에게 전가되는 상황을 방지해야 합니다.`,
    vision: `우리는 AI 기술이 모든 사람을 위해 작동하고, 그 혜택이 공평하게 나눠지는 사회를 만들겠습니다.`,
    keyPolicies: [
      {
        title: 'AI 윤리 가이드라인 법제화',
        description: '알고리즘 투명성 의무화, AI 차별 금지, AI 활용 분야 제한 등을 포함하는 AI 기본법을 제정합니다.',
      },
      {
        title: 'AI 일자리 대체 대응 정책',
        description: 'AI로 인한 일자리 변화에 대비하여 직업 재교육 프로그램 확대, 전환 지원금 지급, 새로운 일자리 창출을 지원합니다.',
      },
      {
        title: '디지털 격차 해소',
        description: '디지털 교육 확대, 공공 디지털 인프라 구축, 취약계층 디지털 접근성 지원을 통해 디지털 격차를 해소합니다.',
      },
      {
        title: 'AI 이익 공유 제도',
        description: "AI 기업의 이익 일부를 사회에 환원하는 'AI 이익 공유 기금'을 조성하여 전 국민이 기술 발전의 혜택을 나눕니다.",
      },
    ],
    expectedEffects: [
      'AI 관련 일자리 전환 지원 50만명',
      '디지털 리터러시 교육 전 국민 확대',
      '알고리즘 투명성 지수 OECD 상위권 진입',
      'AI 관련 민원 및 피해 50% 감소',
    ],
    relatedPolicies: ['digital-rights', 'labor-respect'],
  },
  'digital-rights': {
    id: 'digital-rights',
    category: 'technology',
    title: '디지털 권리 보장',
    summary: '디지털 시대의 새로운 시민권을 확립합니다.',
    background: `디지털 기술의 발전으로 우리 삶의 많은 부분이 온라인으로 이동했습니다. 그러나 개인정보 유출, 플랫폼 기업의 독점, 디지털 감시 등 새로운 형태의 권리 침해도 늘어나고 있습니다.

디지털 시대에 맞는 새로운 권리 개념과 보호 체계가 필요합니다.`,
    vision: `우리는 디지털 공간에서도 시민의 자유와 권리가 보장되고, 개인의 데이터 주권이 존중받는 사회를 만들겠습니다.`,
    keyPolicies: [
      {
        title: '개인정보 자기결정권 강화',
        description: '개인정보의 수집, 이용, 제공에 대한 동의 제도를 강화하고, 정보 주체의 열람·정정·삭제 요구권을 확대합니다.',
      },
      {
        title: '플랫폼 기업 규제 및 공정경쟁',
        description: '대형 플랫폼의 시장지배력 남용을 규제하고, 입점업체 및 이용자 보호, 알고리즘 공정성 확보를 추진합니다.',
      },
      {
        title: '디지털 리터러시 교육 확대',
        description: '학교 및 평생교육 과정에 디지털 리터러시 교육을 필수화하여 시민의 디지털 역량을 강화합니다.',
      },
      {
        title: '공공 디지털 인프라 구축',
        description: '공공 클라우드, 공공 메신저 등 공공 디지털 인프라를 구축하여 민간 플랫폼에 대한 의존도를 낮춥니다.',
      },
    ],
    expectedEffects: [
      '개인정보 침해 사고 50% 감소',
      '플랫폼 시장 공정경쟁 지수 개선',
      '디지털 리터러시 보유율 80% 달성',
      '공공 디지털 서비스 이용률 50% 확대',
    ],
    relatedPolicies: ['ai-governance', 'participatory-democracy'],
  },
  'economic-democracy': {
    id: 'economic-democracy',
    category: 'democracy',
    title: '경제민주주의',
    summary: '기업과 경제에서도 민주주의를 실현합니다.',
    background: `정치적 민주주의의 발전에도 불구하고 경제 영역에서 민주주의는 여전히 요원합니다. 기업 내에서 노동자의 목소리는 무시되고, 경제력 집중으로 인해 소수의 재벌이 경제를 좌우하고 있습니다.

헌법 119조 2항은 경제민주화를 명시하고 있으나, 제대로 실현되지 못하고 있습니다.`,
    vision: `우리는 기업과 경제 영역에서도 민주주의 원리가 작동하는 진정한 경제민주주의를 실현하겠습니다.`,
    keyPolicies: [
      {
        title: '노동이사제 및 공동결정제 도입',
        description: '일정 규모 이상 기업에 노동자 대표가 이사회에 참여하는 노동이사제를 의무화하고, 주요 경영사항에 대한 노동자 참여를 보장합니다.',
      },
      {
        title: '재벌개혁 및 경제력 집중 해소',
        description: '순환출자 금지, 사익편취 규제 강화, 집단소송제 및 징벌적 손해배상제 도입을 통해 재벌의 전횡을 막습니다.',
      },
      {
        title: '중소기업·소상공인 보호 강화',
        description: '대기업의 골목상권 진출 제한, 납품단가 공정화, 창업 지원 확대를 통해 중소기업과 소상공인을 보호합니다.',
      },
      {
        title: '금융민주화',
        description: '금융기관의 공공적 책임 강화, 서민금융 확대, 금융소비자 보호 강화를 추진합니다.',
      },
    ],
    expectedEffects: [
      '노동이사제 도입 기업 1000개 달성',
      '경제력 집중도 지수 개선',
      '중소기업 생존율 20%p 향상',
      '서민금융 접근성 30% 개선',
    ],
    relatedPolicies: ['cooperative-economy', 'labor-respect', 'participatory-democracy'],
  },
  'participatory-democracy': {
    id: 'participatory-democracy',
    category: 'democracy',
    title: '참여민주주의',
    summary: '시민의 일상적인 정치 참여를 보장합니다.',
    background: `대의민주주의만으로는 시민의 다양한 요구를 충분히 반영하기 어렵습니다. 선거 때만 참여하는 민주주의가 아닌, 일상적으로 시민이 정치에 참여할 수 있는 통로가 필요합니다.

주민자치, 국민발안, 국민투표 등 직접민주주의 요소를 강화하여 민주주의의 질을 높여야 합니다.`,
    vision: `우리는 시민이 일상적으로 정치에 참여하고, 자신의 삶에 영향을 미치는 결정에 직접 목소리를 낼 수 있는 참여민주주의를 실현하겠습니다.`,
    keyPolicies: [
      {
        title: '국민발안·국민투표 제도 활성화',
        description: '일정 수 이상의 국민 청원으로 법률안을 발의할 수 있는 국민발안제를 도입하고, 주요 정책에 대한 국민투표를 활성화합니다.',
      },
      {
        title: '참여예산제 확대',
        description: '지방자치단체 예산의 일정 비율을 주민이 직접 결정하는 참여예산제를 전면 확대하고 실질화합니다.',
      },
      {
        title: '지방분권 강화',
        description: '중앙정부의 권한과 재원을 지방으로 이양하고, 주민자치회의 권한을 강화하여 풀뿌리 민주주의를 활성화합니다.',
      },
      {
        title: '숙의민주주의 확대',
        description: '공론화위원회, 시민의회 등 숙의 기구를 확대하여 주요 정책 결정에 시민이 직접 참여할 수 있도록 합니다.',
      },
    ],
    expectedEffects: [
      '참여예산제 예산 비율 10%로 확대',
      '지방재정자립도 20%p 향상',
      '정치 참여율 OECD 평균 수준 달성',
      '정치 신뢰도 지수 개선',
    ],
    relatedPolicies: ['economic-democracy', 'digital-rights'],
  },
  'housing-stability': {
    id: 'housing-stability',
    category: 'housing',
    title: '주거안정 실현',
    summary: '모든 시민의 주거권을 보장하고 집값 안정을 실현합니다.',
    background: `주거는 인간의 기본권입니다. 그러나 치솟는 집값과 전세난으로 많은 시민이 내 집 마련의 꿈을 포기하고, 주거 불안에 시달리고 있습니다.

부동산은 투기의 대상이 아닌 삶의 터전이 되어야 합니다.`,
    vision: `우리는 주거를 투기의 대상이 아닌 시민의 권리로 보장하고, 누구나 안정적으로 거주할 수 있는 사회를 만들겠습니다.`,
    keyPolicies: [
      {
        title: '공공임대주택 100만호 확대',
        description: '장기 공공임대주택을 대폭 확대하고, 청년·신혼부부·노인 등 주거 취약계층에 대한 지원을 강화합니다.',
      },
      {
        title: '투기억제 및 실수요자 보호',
        description: '다주택자에 대한 과세 강화, 전매제한 강화, 실거주 의무 확대를 통해 투기를 억제하고 실수요자를 보호합니다.',
      },
      {
        title: '전월세 상한제 강화',
        description: '임대료 인상률 상한을 낮추고, 계약갱신청구권을 확대하여 세입자의 주거 안정을 보장합니다.',
      },
      {
        title: '주거급여 확대',
        description: '주거급여 지원 대상과 금액을 확대하여 저소득층의 주거비 부담을 낮춥니다.',
      },
    ],
    expectedEffects: [
      '공공임대주택 재고 OECD 평균 수준 달성',
      '무주택 가구 주거비 부담률 30% 개선',
      '전월세 가격 상승률 물가 수준으로 안정화',
      '주거급여 수급 가구 100만 가구 확대',
    ],
    relatedPolicies: ['inequality-reduction', 'care-society'],
  },
};

// 관련 정책 이름 조회 함수
function getPolicyTitle(id: string): string {
  return policiesDetailData[id]?.title || id;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PolicyDetailPage({ params }: PageProps) {
  const { id } = await params;
  const policy = policiesDetailData[id];

  if (!policy) {
    notFound();
  }

  const category = categories[policy.category];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-[var(--primary)] text-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/policies" className="text-white/70 hover:text-white transition-colors">
              정책
            </Link>
            <span className="text-white/50">›</span>
            <span className="text-white/70">{category?.name}</span>
          </div>
          <div className="flex items-center gap-4 mb-6">
            {(() => {
              const PolicyIcon = policyIcons[policy.id] || Handshake;
              return (
                <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center">
                  <PolicyIcon className="w-10 h-10 text-white" />
                </div>
              );
            })()}
            <div>
              {(() => {
                const CategoryIcon = categoryIcons[policy.category] || Briefcase;
                return (
                  <span className="inline-flex items-center gap-2 px-3 py-1 text-sm font-medium bg-white/20 rounded-full mb-2">
                    <CategoryIcon className="w-4 h-4" />
                    {category?.name}
                  </span>
                );
              })()}
              <h1 className="text-4xl md:text-5xl font-bold">{policy.title}</h1>
            </div>
          </div>
          <p className="text-xl text-white/90 max-w-3xl">
            {policy.summary}
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          {/* AI 정책 요약 */}
          <div className="mb-12">
            <PolicySummary
              policyId={policy.id}
              title={policy.title}
              content={`${policy.background}\n\n${policy.vision}\n\n${policy.keyPolicies.map(p => `${p.title}: ${p.description}`).join('\n\n')}`}
            />
          </div>

          {/* 배경 */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-[var(--gray-900)] mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-[var(--primary)] rounded"></span>
              정책 배경
            </h2>
            <div className="prose prose-lg max-w-none text-[var(--gray-700)]">
              {policy.background.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-4 leading-relaxed">{paragraph}</p>
              ))}
            </div>
          </div>

          {/* 비전 */}
          <div className="mb-12">
            <div className="bg-[var(--primary-light)] rounded-[var(--radius-xl)] p-8">
              <h2 className="text-2xl font-bold text-[var(--primary)] mb-4">우리의 비전</h2>
              <p className="text-lg text-[var(--primary-dark)] leading-relaxed">
                {policy.vision}
              </p>
            </div>
          </div>

          {/* 핵심 정책 */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-[var(--gray-900)] mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-[var(--primary)] rounded"></span>
              핵심 정책
            </h2>
            <div className="space-y-4">
              {policy.keyPolicies.map((item, index) => (
                <Card key={index} variant="bordered" className="hover:border-[var(--primary)] transition-colors">
                  <h3 className="text-lg font-bold text-[var(--gray-900)] mb-2 flex items-center gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-[var(--primary)] text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    {item.title}
                  </h3>
                  <CardContent className="ml-11">
                    <p className="text-[var(--gray-600)] leading-relaxed">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* 기대 효과 */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-[var(--gray-900)] mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-[var(--secondary)] rounded"></span>
              기대 효과
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {policy.expectedEffects.map((effect, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-[var(--gray-50)] rounded-[var(--radius-md)]">
                  <span className="text-[var(--secondary)] text-xl">✓</span>
                  <span className="text-[var(--gray-700)]">{effect}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 관련 정책 */}
          {policy.relatedPolicies.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[var(--gray-900)] mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-[var(--primary)] rounded"></span>
                관련 정책
              </h2>
              <div className="flex flex-wrap gap-3">
                {policy.relatedPolicies.map((relatedId) => (
                  <Link key={relatedId} href={`/policies/${relatedId}`}>
                    <span className="inline-block px-4 py-2 bg-[var(--gray-100)] text-[var(--gray-700)] rounded-full hover:bg-[var(--primary-light)] hover:text-[var(--primary)] transition-colors">
                      {getPolicyTitle(relatedId)} →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[var(--gray-50)] py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--gray-900)] mb-4">
            이 정책에 대한 의견을 나눠주세요
          </h2>
          <p className="text-[var(--gray-600)] mb-8">
            행복사회당은 당원들의 의견을 바탕으로 정책을 발전시켜 나갑니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/community">
              <Button variant="primary">정책 토론 참여하기</Button>
            </Link>
            <Link href="/policies">
              <Button variant="outline">다른 정책 보기</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// 정적 경로 생성
export function generateStaticParams() {
  return Object.keys(policiesDetailData).map((id) => ({
    id,
  }));
}
