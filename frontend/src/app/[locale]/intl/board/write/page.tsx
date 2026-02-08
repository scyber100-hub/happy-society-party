'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ArrowLeft, Globe, Send } from 'lucide-react';
import {
  createIntlPost,
  getActiveChapters,
  getIntlMemberByUserId
} from '@/lib/international';
import {
  type IntlChapter,
  type IntlMember
} from '@/types/international';
import { useAuth } from '@/hooks/useAuth';

const categories = [
  { value: 'general', label: 'General' },
  { value: 'announcement', label: 'Announcement' },
  { value: 'discussion', label: 'Discussion' },
  { value: 'event', label: 'Event' },
  { value: 'resource', label: 'Resource' },
];

const languages = [
  { value: 'en', label: 'English' },
  { value: 'ko', label: 'Korean' },
  { value: 'ja', label: 'Japanese' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'zh', label: 'Chinese' },
];

export default function WriteIntlPostPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [currentMember, setCurrentMember] = useState<IntlMember | null>(null);
  const [chapters, setChapters] = useState<IntlChapter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('general');
  const [language, setLanguage] = useState('en');
  const [chapterId, setChapterId] = useState<string>('');
  const [isGlobal, setIsGlobal] = useState(true);

  const loadData = useCallback(async () => {
    if (!user?.id) return;
    try {
      setIsLoading(true);
      const [member, chaptersData] = await Promise.all([
        getIntlMemberByUserId(user.id),
        getActiveChapters(),
      ]);
      setCurrentMember(member);
      setChapters(chaptersData);

      if (member?.chapter_id) {
        setChapterId(member.chapter_id);
      }
      if (member?.preferred_language) {
        setLanguage(member.preferred_language);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      loadData();
    } else {
      setIsLoading(false);
    }
  }, [user?.id, loadData]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!currentMember) return;

    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }
    if (!content.trim()) {
      setError('Please enter content');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const post = await createIntlPost({
        author_id: currentMember.id,
        chapter_id: chapterId || undefined,
        title: title.trim(),
        content: content.trim(),
        category,
        language,
        is_global: isGlobal,
      });

      router.push(`/intl/board/${post.id}`);
    } catch (err) {
      console.error('Failed to create post:', err);
      setError('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--gray-50)] py-8">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-lg p-8 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="space-y-4">
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-48 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--gray-50)] py-8">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Login Required</h2>
          <p className="text-gray-500 mb-4">Please login to write a post.</p>
          <Link href="/auth/login">
            <Button variant="primary">Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!currentMember) {
    return (
      <div className="min-h-screen bg-[var(--gray-50)] py-8">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Membership Required</h2>
          <p className="text-gray-500 mb-4">You need to be an international member to write posts.</p>
          <Link href="/intl/join">
            <Button variant="primary">Become a Member</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--gray-50)]">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <Link
            href="/intl/board"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Board
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <Card className="bg-white">
          <CardContent className="p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Globe className="w-6 h-6 text-[var(--primary)]" />
              Write New Post
            </h1>

            {error && (
              <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Enter post title"
                  className="w-full"
                  maxLength={255}
                />
              </div>

              {/* Category & Language Row */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    value={language}
                    onChange={e => setLanguage(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  >
                    {languages.map(lang => (
                      <option key={lang.value} value={lang.value}>
                        {lang.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Chapter & Global Options */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chapter (optional)
                  </label>
                  <select
                    value={chapterId}
                    onChange={e => setChapterId(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  >
                    <option value="">No specific chapter</option>
                    {chapters.map(chapter => (
                      <option key={chapter.id} value={chapter.id}>
                        {chapter.country_name_en}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isGlobal}
                      onChange={e => setIsGlobal(e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300 text-[var(--primary)] focus:ring-[var(--primary)]"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-700">Global Post</span>
                      <p className="text-xs text-gray-500">Visible to all chapters</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Write your post content here..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  rows={12}
                />
                <p className="text-xs text-gray-500 mt-1">
                  You can use basic HTML tags for formatting.
                </p>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-4 pt-4 border-t">
                <Link href="/intl/board">
                  <Button type="button" variant="ghost">
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting || !title.trim() || !content.trim()}
                  className="flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? 'Publishing...' : 'Publish Post'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
