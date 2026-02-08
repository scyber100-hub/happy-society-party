// Shared types for international data
// These types match the intl_* tables in Supabase

export interface IntlChapter {
  id: string;
  country_code: string;
  country_name_en: string;
  country_name_native: string | null;
  status: 'forming' | 'established' | 'active' | 'inactive';
  founded_at: string | null;
  website_url: string | null;
  contact_email: string | null;
  description_en: string | null;
  description_native: string | null;
  member_count: number;
  leader_name: string | null;
  leader_email: string | null;
  social_links: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export interface IntlMember {
  id: string;
  user_id: string | null;
  email: string;
  first_name: string;
  last_name: string;
  country_code: string;
  chapter_id: string | null;
  preferred_language: string;
  membership_type: 'supporter' | 'member' | 'organizer' | 'leader';
  status: 'pending' | 'active' | 'inactive' | 'suspended';
  bio: string | null;
  interests: string[] | null;
  skills: string[] | null;
  wants_newsletter: boolean;
  wants_event_updates: boolean;
  joined_at: string;
  verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface IntlPartner {
  id: string;
  organization_name: string;
  organization_type: 'political_party' | 'union' | 'ngo' | 'civil_society' | 'academic' | 'other';
  country_code: string;
  website_url: string | null;
  contact_email: string;
  contact_person: string | null;
  description: string | null;
  partnership_level: 'affiliate' | 'partner' | 'ally' | 'founding';
  status: 'pending' | 'approved' | 'active' | 'inactive';
  logo_url: string | null;
  social_links: Record<string, string>;
  member_count: number | null;
  joined_at: string | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface IntlContact {
  id?: string;
  name: string;
  email: string;
  country_code?: string;
  subject: string;
  category: 'general' | 'membership' | 'chapter' | 'partnership' | 'press' | 'other';
  message: string;
  preferred_language?: string;
  status?: 'new' | 'read' | 'in_progress' | 'resolved' | 'archived';
  responded_at?: string;
  created_at?: string;
}

export interface IntlNewsletterSubscriber {
  id?: string;
  email: string;
  name?: string;
  country_code?: string;
  preferred_language?: string;
  topics?: string[];
  status?: 'pending' | 'confirmed' | 'unsubscribed';
  confirmation_token?: string;
  confirmed_at?: string;
  created_at?: string;
}

// Country code to flag emoji mapping
export const countryFlags: Record<string, string> = {
  KR: '\uD83C\uDDF0\uD83C\uDDF7', // 🇰🇷
  US: '\uD83C\uDDFA\uD83C\uDDF8', // 🇺🇸
  JP: '\uD83C\uDDEF\uD83C\uDDF5', // 🇯🇵
  GB: '\uD83C\uDDEC\uD83C\uDDE7', // 🇬🇧
  DE: '\uD83C\uDDE9\uD83C\uDDEA', // 🇩🇪
  FR: '\uD83C\uDDEB\uD83C\uDDF7', // 🇫🇷
  CA: '\uD83C\uDDE8\uD83C\uDDE6', // 🇨🇦
  AU: '\uD83C\uDDE6\uD83C\uDDFA', // 🇦🇺
  NZ: '\uD83C\uDDF3\uD83C\uDDFF', // 🇳🇿
  SG: '\uD83C\uDDF8\uD83C\uDDEC', // 🇸🇬
  HK: '\uD83C\uDDED\uD83C\uDDF0', // 🇭🇰
  TW: '\uD83C\uDDF9\uD83C\uDDFC', // 🇹🇼
  CN: '\uD83C\uDDE8\uD83C\uDDF3', // 🇨🇳
  ES: '\uD83C\uDDEA\uD83C\uDDF8', // 🇪🇸
  IT: '\uD83C\uDDEE\uD83C\uDDF9', // 🇮🇹
  NL: '\uD83C\uDDF3\uD83C\uDDF1', // 🇳🇱
  SE: '\uD83C\uDDF8\uD83C\uDDEA', // 🇸🇪
  NO: '\uD83C\uDDF3\uD83C\uDDF4', // 🇳🇴
  DK: '\uD83C\uDDE9\uD83C\uDDF0', // 🇩🇰
  FI: '\uD83C\uDDEB\uD83C\uDDEE', // 🇫🇮
  BR: '\uD83C\uDDE7\uD83C\uDDF7', // 🇧🇷
  MX: '\uD83C\uDDF2\uD83C\uDDFD', // 🇲🇽
  AR: '\uD83C\uDDE6\uD83C\uDDF7', // 🇦🇷
  IN: '\uD83C\uDDEE\uD83C\uDDF3', // 🇮🇳
  ID: '\uD83C\uDDEE\uD83C\uDDE9', // 🇮🇩
  MY: '\uD83C\uDDF2\uD83C\uDDFE', // 🇲🇾
  TH: '\uD83C\uDDF9\uD83C\uDDED', // 🇹🇭
  VN: '\uD83C\uDDFB\uD83C\uDDF3', // 🇻🇳
  PH: '\uD83C\uDDF5\uD83C\uDDED', // 🇵🇭
};

// Status colors and labels
export const chapterStatusColors: Record<string, string> = {
  forming: 'bg-yellow-100 text-yellow-800',
  established: 'bg-blue-100 text-blue-800',
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-600',
};

export const chapterStatusLabels: Record<string, { ko: string; en: string; ja: string }> = {
  forming: { ko: '결성 중', en: 'Forming', ja: '結成中' },
  established: { ko: '설립됨', en: 'Established', ja: '設立済み' },
  active: { ko: '활동 중', en: 'Active', ja: '活動中' },
  inactive: { ko: '비활성', en: 'Inactive', ja: '非活動' },
};

export const partnershipLevelLabels: Record<string, { ko: string; en: string; ja: string }> = {
  affiliate: { ko: '제휴', en: 'Affiliate', ja: '提携' },
  partner: { ko: '파트너', en: 'Partner', ja: 'パートナー' },
  ally: { ko: '동맹', en: 'Ally', ja: '同盟' },
  founding: { ko: '창립 멤버', en: 'Founding', ja: '創設メンバー' },
};

// International bulletin board types
export interface IntlPost {
  id: string;
  author_id: string | null;
  chapter_id: string | null;
  title: string;
  content: string;
  category: 'general' | 'announcement' | 'discussion' | 'event' | 'resource';
  language: string;
  is_global: boolean;
  is_pinned: boolean;
  is_published: boolean;
  view_count: number;
  like_count: number;
  comment_count: number;
  created_at: string;
  updated_at: string;
  // Joined fields
  author?: IntlMember;
  chapter?: IntlChapter;
}

export interface IntlPostComment {
  id: string;
  post_id: string;
  author_id: string | null;
  parent_id: string | null;
  content: string;
  like_count: number;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  // Joined fields
  author?: IntlMember;
  replies?: IntlPostComment[];
}

export interface IntlPostLike {
  id: string;
  member_id: string;
  post_id: string | null;
  comment_id: string | null;
  created_at: string;
}

// Post category labels
export const postCategoryLabels: Record<string, { ko: string; en: string; ja: string }> = {
  general: { ko: '일반', en: 'General', ja: '一般' },
  announcement: { ko: '공지', en: 'Announcement', ja: 'お知らせ' },
  discussion: { ko: '토론', en: 'Discussion', ja: '議論' },
  event: { ko: '행사', en: 'Event', ja: 'イベント' },
  resource: { ko: '자료', en: 'Resource', ja: '資料' },
};

export const postCategoryColors: Record<string, string> = {
  general: 'bg-gray-100 text-gray-800',
  announcement: 'bg-red-100 text-red-800',
  discussion: 'bg-blue-100 text-blue-800',
  event: 'bg-purple-100 text-purple-800',
  resource: 'bg-green-100 text-green-800',
};

// International voting types
export interface IntlVote {
  id: string;
  title: string;
  description: string | null;
  vote_type: 'general' | 'policy' | 'election' | 'initiative' | 'resolution';
  scope: 'global' | 'chapter';
  chapter_id: string | null;
  options: VoteOption[];
  allow_multiple: boolean;
  max_selections: number;
  start_date: string;
  end_date: string;
  deliberation_start: string | null;
  min_participation: number;
  status: 'draft' | 'deliberation' | 'voting' | 'counting' | 'completed' | 'cancelled';
  result: Record<string, number> | null;
  total_votes: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  chapter?: IntlChapter;
  creator?: IntlMember;
}

export interface VoteOption {
  id: string;
  label: string;
  description?: string;
}

export interface IntlVoteRecord {
  id: string;
  vote_id: string;
  member_id: string;
  selected_options: string[];
  voted_at: string;
}

export interface IntlVoteDiscussion {
  id: string;
  vote_id: string;
  author_id: string;
  content: string;
  parent_id: string | null;
  like_count: number;
  created_at: string;
  updated_at: string;
  author?: IntlMember;
  replies?: IntlVoteDiscussion[];
}

// Vote type labels
export const voteTypeLabels: Record<string, { ko: string; en: string; ja: string }> = {
  general: { ko: '일반', en: 'General', ja: '一般' },
  policy: { ko: '정책', en: 'Policy', ja: '政策' },
  election: { ko: '선거', en: 'Election', ja: '選挙' },
  initiative: { ko: '발의', en: 'Initiative', ja: '発議' },
  resolution: { ko: '결의', en: 'Resolution', ja: '決議' },
};

export const voteStatusLabels: Record<string, { ko: string; en: string; ja: string }> = {
  draft: { ko: '초안', en: 'Draft', ja: '下書き' },
  deliberation: { ko: '숙의', en: 'Deliberation', ja: '審議' },
  voting: { ko: '투표중', en: 'Voting', ja: '投票中' },
  counting: { ko: '개표중', en: 'Counting', ja: '開票中' },
  completed: { ko: '완료', en: 'Completed', ja: '完了' },
  cancelled: { ko: '취소', en: 'Cancelled', ja: 'キャンセル' },
};

export const voteStatusColors: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-800',
  deliberation: 'bg-yellow-100 text-yellow-800',
  voting: 'bg-green-100 text-green-800',
  counting: 'bg-blue-100 text-blue-800',
  completed: 'bg-purple-100 text-purple-800',
  cancelled: 'bg-red-100 text-red-800',
};
