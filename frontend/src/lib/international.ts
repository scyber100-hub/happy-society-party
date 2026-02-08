// API functions for international data
// Shared between both projects via the same Supabase instance

import { createBrowserClient } from '@supabase/ssr';
import type {
  IntlChapter,
  IntlMember,
  IntlPartner,
  IntlContact,
  IntlNewsletterSubscriber,
  IntlPost,
  IntlPostComment,
  IntlVote,
  IntlVoteDiscussion,
} from '@/types/international';

// Create a generic Supabase client for intl tables
const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Chapters
export async function getChapters(): Promise<IntlChapter[]> {
  const { data, error } = await supabase
    .from('intl_chapters')
    .select('*')
    .order('status', { ascending: true })
    .order('member_count', { ascending: false });

  if (error) throw error;
  return (data || []) as IntlChapter[];
}

export async function getActiveChapters(): Promise<IntlChapter[]> {
  const { data, error } = await supabase
    .from('intl_chapters')
    .select('*')
    .in('status', ['established', 'active'])
    .order('member_count', { ascending: false });

  if (error) throw error;
  return (data || []) as IntlChapter[];
}

export async function getChapterByCountry(countryCode: string): Promise<IntlChapter | null> {
  const { data, error } = await supabase
    .from('intl_chapters')
    .select('*')
    .eq('country_code', countryCode)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data as IntlChapter | null;
}

export async function getChapterStats(): Promise<{
  totalChapters: number;
  activeChapters: number;
  totalMembers: number;
}> {
  const { data, error } = await supabase
    .from('intl_chapters')
    .select('status, member_count');

  if (error) throw error;

  const chapters = (data || []) as { status: string; member_count: number }[];
  return {
    totalChapters: chapters.length,
    activeChapters: chapters.filter(c => c.status === 'active').length,
    totalMembers: chapters.reduce((sum, c) => sum + (c.member_count || 0), 0),
  };
}

// Partners
export async function getPartners(): Promise<IntlPartner[]> {
  const { data, error } = await supabase
    .from('intl_partners')
    .select('*')
    .order('partnership_level', { ascending: false })
    .order('organization_name');

  if (error) throw error;
  return (data || []) as IntlPartner[];
}

export async function getActivePartners(): Promise<IntlPartner[]> {
  const { data, error } = await supabase
    .from('intl_partners')
    .select('*')
    .in('status', ['approved', 'active'])
    .order('partnership_level', { ascending: false });

  if (error) throw error;
  return (data || []) as IntlPartner[];
}

// Members
export async function registerIntlMember(
  member: Omit<IntlMember, 'id' | 'joined_at' | 'verified_at' | 'created_at' | 'updated_at' | 'status'>
): Promise<void> {
  const { error } = await supabase
    .from('intl_members')
    .insert({
      ...member,
      status: 'pending',
    });

  if (error) throw error;
}

export async function getIntlMemberByEmail(email: string): Promise<IntlMember | null> {
  const { data, error } = await supabase
    .from('intl_members')
    .select('*')
    .eq('email', email)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data as IntlMember | null;
}

// Contact
export async function submitIntlContact(contact: IntlContact): Promise<void> {
  const { error } = await supabase
    .from('intl_contacts')
    .insert({
      ...contact,
      status: 'new',
    });

  if (error) throw error;
}

// Newsletter
export async function subscribeNewsletter(subscriber: IntlNewsletterSubscriber): Promise<void> {
  const { error } = await supabase
    .from('intl_newsletter_subscribers')
    .insert({
      ...subscriber,
      status: 'pending',
    });

  if (error) throw error;
}

export async function confirmNewsletterSubscription(token: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('intl_newsletter_subscribers')
    .update({
      status: 'confirmed',
      confirmed_at: new Date().toISOString(),
    })
    .eq('confirmation_token', token)
    .eq('status', 'pending')
    .select()
    .single();

  if (error) return false;
  return !!data;
}

// Chapter application
export async function applyForChapter(application: {
  country_code: string;
  country_name_en: string;
  country_name_native?: string;
  contact_email: string;
  leader_name: string;
  leader_email: string;
  description_en?: string;
}): Promise<void> {
  const { error } = await supabase
    .from('intl_chapters')
    .insert({
      ...application,
      status: 'forming',
      member_count: 1,
    });

  if (error) throw error;
}

// Partnership application
export async function applyForPartnership(
  partner: Omit<IntlPartner, 'id' | 'status' | 'joined_at' | 'approved_at' | 'created_at' | 'updated_at'>
): Promise<void> {
  const { error } = await supabase
    .from('intl_partners')
    .insert({
      ...partner,
      status: 'pending',
    });

  if (error) throw error;
}

// International site URL (for linking)
export const INTERNATIONAL_SITE_URL = process.env.NEXT_PUBLIC_INTL_SITE_URL || 'https://happy-society.org';

// ===== International Bulletin Board =====

// Get global posts (visible to all)
export async function getGlobalPosts(options?: {
  category?: string;
  limit?: number;
  offset?: number;
}): Promise<{ posts: IntlPost[]; total: number }> {
  let query = supabase
    .from('intl_posts')
    .select(`
      *,
      author:intl_members!author_id(id, first_name, last_name, country_code),
      chapter:intl_chapters!chapter_id(id, country_code, country_name_en)
    `, { count: 'exact' })
    .eq('is_published', true)
    .eq('is_global', true)
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false });

  if (options?.category) {
    query = query.eq('category', options.category);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }
  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  }

  const { data, error, count } = await query;
  if (error) throw error;
  return { posts: (data || []) as IntlPost[], total: count || 0 };
}

// Get chapter posts
export async function getChapterPosts(
  chapterId: string,
  options?: {
    category?: string;
    includeGlobal?: boolean;
    limit?: number;
    offset?: number;
  }
): Promise<{ posts: IntlPost[]; total: number }> {
  let query = supabase
    .from('intl_posts')
    .select(`
      *,
      author:intl_members!author_id(id, first_name, last_name, country_code),
      chapter:intl_chapters!chapter_id(id, country_code, country_name_en)
    `, { count: 'exact' })
    .eq('is_published', true);

  if (options?.includeGlobal) {
    query = query.or(`chapter_id.eq.${chapterId},is_global.eq.true`);
  } else {
    query = query.eq('chapter_id', chapterId);
  }

  query = query
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false });

  if (options?.category) {
    query = query.eq('category', options.category);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }
  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  }

  const { data, error, count } = await query;
  if (error) throw error;
  return { posts: (data || []) as IntlPost[], total: count || 0 };
}

// Get a single post
export async function getIntlPost(postId: string): Promise<IntlPost | null> {
  const { data, error } = await supabase
    .from('intl_posts')
    .select(`
      *,
      author:intl_members!author_id(id, first_name, last_name, country_code, email),
      chapter:intl_chapters!chapter_id(id, country_code, country_name_en)
    `)
    .eq('id', postId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;

  // Increment view count
  if (data) {
    await supabase
      .from('intl_posts')
      .update({ view_count: (data.view_count || 0) + 1 })
      .eq('id', postId);
  }

  return data as IntlPost | null;
}

// Create a new post
export async function createIntlPost(post: {
  author_id: string;
  chapter_id?: string;
  title: string;
  content: string;
  category?: string;
  language?: string;
  is_global?: boolean;
}): Promise<IntlPost> {
  const { data, error } = await supabase
    .from('intl_posts')
    .insert({
      ...post,
      category: post.category || 'general',
      language: post.language || 'en',
      is_global: post.is_global || false,
    })
    .select()
    .single();

  if (error) throw error;
  return data as IntlPost;
}

// Update a post
export async function updateIntlPost(
  postId: string,
  updates: Partial<{
    title: string;
    content: string;
    category: string;
    language: string;
    is_global: boolean;
    is_pinned: boolean;
    is_published: boolean;
  }>
): Promise<void> {
  const { error } = await supabase
    .from('intl_posts')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', postId);

  if (error) throw error;
}

// Delete a post
export async function deleteIntlPost(postId: string): Promise<void> {
  const { error } = await supabase
    .from('intl_posts')
    .delete()
    .eq('id', postId);

  if (error) throw error;
}

// Get comments for a post
export async function getIntlPostComments(postId: string): Promise<IntlPostComment[]> {
  const { data, error } = await supabase
    .from('intl_post_comments')
    .select(`
      *,
      author:intl_members!author_id(id, first_name, last_name, country_code)
    `)
    .eq('post_id', postId)
    .eq('is_deleted', false)
    .order('created_at', { ascending: true });

  if (error) throw error;

  // Organize comments into tree structure
  const comments = (data || []) as IntlPostComment[];
  const commentMap = new Map<string, IntlPostComment>();
  const rootComments: IntlPostComment[] = [];

  comments.forEach(comment => {
    comment.replies = [];
    commentMap.set(comment.id, comment);
  });

  comments.forEach(comment => {
    if (comment.parent_id) {
      const parent = commentMap.get(comment.parent_id);
      if (parent) {
        parent.replies!.push(comment);
      }
    } else {
      rootComments.push(comment);
    }
  });

  return rootComments;
}

// Create a comment
export async function createIntlPostComment(comment: {
  post_id: string;
  author_id: string;
  content: string;
  parent_id?: string;
}): Promise<IntlPostComment> {
  const { data, error } = await supabase
    .from('intl_post_comments')
    .insert(comment)
    .select(`
      *,
      author:intl_members!author_id(id, first_name, last_name, country_code)
    `)
    .single();

  if (error) throw error;
  return data as IntlPostComment;
}

// Update a comment
export async function updateIntlPostComment(
  commentId: string,
  content: string
): Promise<void> {
  const { error } = await supabase
    .from('intl_post_comments')
    .update({ content, updated_at: new Date().toISOString() })
    .eq('id', commentId);

  if (error) throw error;
}

// Delete a comment (soft delete)
export async function deleteIntlPostComment(commentId: string): Promise<void> {
  const { error } = await supabase
    .from('intl_post_comments')
    .update({ is_deleted: true, content: '[Deleted]' })
    .eq('id', commentId);

  if (error) throw error;
}

// Toggle like on a post
export async function toggleIntlPostLike(postId: string, memberId: string): Promise<boolean> {
  const { data, error } = await supabase.rpc('toggle_intl_post_like', {
    p_post_id: postId,
    p_member_id: memberId,
  });

  if (error) throw error;
  return data as boolean;
}

// Toggle like on a comment
export async function toggleIntlCommentLike(commentId: string, memberId: string): Promise<boolean> {
  const { data, error } = await supabase.rpc('toggle_intl_comment_like', {
    p_comment_id: commentId,
    p_member_id: memberId,
  });

  if (error) throw error;
  return data as boolean;
}

// Check if current user has liked a post
export async function hasLikedPost(postId: string, memberId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('intl_post_likes')
    .select('id')
    .eq('post_id', postId)
    .eq('member_id', memberId)
    .maybeSingle();

  if (error) throw error;
  return !!data;
}

// Get member by user_id (auth user id)
export async function getIntlMemberByUserId(userId: string): Promise<IntlMember | null> {
  const { data, error } = await supabase
    .from('intl_members')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data as IntlMember | null;
}

// ===== International Voting =====

// Get active/public votes
export async function getIntlVotes(options?: {
  scope?: 'global' | 'chapter';
  chapterId?: string;
  status?: string | string[];
  limit?: number;
  offset?: number;
}): Promise<{ votes: IntlVote[]; total: number }> {
  let query = supabase
    .from('intl_votes')
    .select(`
      *,
      chapter:intl_chapters!chapter_id(id, country_code, country_name_en),
      creator:intl_members!created_by(id, first_name, last_name, country_code)
    `, { count: 'exact' });

  if (options?.scope) {
    query = query.eq('scope', options.scope);
  }
  if (options?.chapterId) {
    query = query.eq('chapter_id', options.chapterId);
  }
  if (options?.status) {
    if (Array.isArray(options.status)) {
      query = query.in('status', options.status);
    } else {
      query = query.eq('status', options.status);
    }
  } else {
    // Default to active statuses
    query = query.in('status', ['deliberation', 'voting', 'completed']);
  }

  query = query.order('start_date', { ascending: false });

  if (options?.limit) {
    query = query.limit(options.limit);
  }
  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  }

  const { data, error, count } = await query;
  if (error) throw error;
  return { votes: (data || []) as IntlVote[], total: count || 0 };
}

// Get a single vote
export async function getIntlVote(voteId: string): Promise<IntlVote | null> {
  const { data, error } = await supabase
    .from('intl_votes')
    .select(`
      *,
      chapter:intl_chapters!chapter_id(id, country_code, country_name_en),
      creator:intl_members!created_by(id, first_name, last_name, country_code)
    `)
    .eq('id', voteId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data as IntlVote | null;
}

// Check if member has voted
export async function hasVotedIntl(voteId: string, memberId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('intl_vote_records')
    .select('id')
    .eq('vote_id', voteId)
    .eq('member_id', memberId)
    .maybeSingle();

  if (error) throw error;
  return !!data;
}

// Get member's vote record
export async function getIntlVoteRecord(voteId: string, memberId: string): Promise<string[] | null> {
  const { data, error } = await supabase
    .from('intl_vote_records')
    .select('selected_options')
    .eq('vote_id', voteId)
    .eq('member_id', memberId)
    .maybeSingle();

  if (error) throw error;
  return data?.selected_options || null;
}

// Cast a vote
export async function castIntlVote(
  voteId: string,
  memberId: string,
  selectedOptions: string[]
): Promise<boolean> {
  const { data, error } = await supabase.rpc('cast_intl_vote', {
    p_vote_id: voteId,
    p_member_id: memberId,
    p_selected_options: selectedOptions,
  });

  if (error) throw error;
  return data as boolean;
}

// Get vote discussions
export async function getIntlVoteDiscussions(voteId: string): Promise<IntlVoteDiscussion[]> {
  const { data, error } = await supabase
    .from('intl_vote_discussions')
    .select(`
      *,
      author:intl_members!author_id(id, first_name, last_name, country_code)
    `)
    .eq('vote_id', voteId)
    .order('created_at', { ascending: true });

  if (error) throw error;

  // Organize into tree
  const discussions = (data || []) as IntlVoteDiscussion[];
  const discussionMap = new Map<string, IntlVoteDiscussion>();
  const rootDiscussions: IntlVoteDiscussion[] = [];

  discussions.forEach(d => {
    d.replies = [];
    discussionMap.set(d.id, d);
  });

  discussions.forEach(d => {
    if (d.parent_id) {
      const parent = discussionMap.get(d.parent_id);
      if (parent) {
        parent.replies!.push(d);
      }
    } else {
      rootDiscussions.push(d);
    }
  });

  return rootDiscussions;
}

// Create a discussion comment
export async function createIntlVoteDiscussion(discussion: {
  vote_id: string;
  author_id: string;
  content: string;
  parent_id?: string;
}): Promise<IntlVoteDiscussion> {
  const { data, error } = await supabase
    .from('intl_vote_discussions')
    .insert(discussion)
    .select(`
      *,
      author:intl_members!author_id(id, first_name, last_name, country_code)
    `)
    .single();

  if (error) throw error;
  return data as IntlVoteDiscussion;
}

// Get vote participation statistics
export async function getIntlVoteStats(voteId: string): Promise<{
  totalVotes: number;
  participationByChapter: Record<string, number>;
}> {
  const { data, error } = await supabase
    .from('intl_vote_records')
    .select(`
      member:intl_members!member_id(chapter_id)
    `)
    .eq('vote_id', voteId);

  if (error) throw error;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const records = (data || []) as any[];
  const byChapter: Record<string, number> = {};

  records.forEach((record) => {
    // Supabase returns joined records as objects
    const chapterId = record.member?.chapter_id || 'no_chapter';
    byChapter[chapterId] = (byChapter[chapterId] || 0) + 1;
  });

  return {
    totalVotes: records.length,
    participationByChapter: byChapter,
  };
}
