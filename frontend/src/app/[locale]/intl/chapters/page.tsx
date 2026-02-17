'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  Globe,
  MapPin,
  Users,
  ExternalLink,
  Mail,
  Calendar
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { countryFlags } from '@/types/international';

interface Chapter {
  id: string;
  country_code: string;
  country_name_en: string;
  country_name_native: string | null;
  status: 'forming' | 'established' | 'active' | 'inactive';
  founded_at: string | null;
  website_url: string | null;
  contact_email: string | null;
  description_en: string | null;
  member_count: number;
  leader_name: string | null;
}

const statusLabels: Record<string, { label: string; color: string }> = {
  forming: { label: 'Forming', color: 'bg-yellow-100 text-yellow-800' },
  established: { label: 'Established', color: 'bg-blue-100 text-blue-800' },
  active: { label: 'Active', color: 'bg-green-100 text-green-800' },
  inactive: { label: 'Inactive', color: 'bg-gray-100 text-gray-600' },
};

export default function IntlChaptersPage() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadChapters = async () => {
      try {
        const supabase = createClient();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabase as any)
          .from('intl_chapters')
          .select('*')
          .order('member_count', { ascending: false });

        if (error) throw error;
        setChapters((data as Chapter[]) || []);
      } catch (error) {
        console.error('Failed to load chapters:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadChapters();
  }, []);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  };

  return (
    <div className="min-h-screen bg-[var(--gray-50)]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <MapPin className="w-8 h-8" />
            <h1 className="text-3xl md:text-4xl font-bold">Global Chapters</h1>
          </div>
          <p className="text-white/90 max-w-2xl mx-auto">
            Find Happy Society chapters around the world or start one in your country
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Card className="bg-white">
            <CardContent className="p-6 text-center">
              <Globe className="w-8 h-8 text-[var(--primary)] mx-auto mb-2" />
              <p className="text-3xl font-bold text-gray-900">{chapters.length}</p>
              <p className="text-gray-600">Countries</p>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-[var(--primary)] mx-auto mb-2" />
              <p className="text-3xl font-bold text-gray-900">
                {chapters.reduce((sum, c) => sum + c.member_count, 0)}
              </p>
              <p className="text-gray-600">Global Members</p>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardContent className="p-6 text-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {chapters.filter(c => c.status === 'active').length}
              </p>
              <p className="text-gray-600">Active Chapters</p>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardContent className="p-6 text-center">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {chapters.filter(c => c.status === 'forming').length}
              </p>
              <p className="text-gray-600">Forming</p>
            </CardContent>
          </Card>
        </div>

        {/* Chapters List */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="h-16 bg-gray-200 rounded mb-4"></div>
                <div className="flex gap-2">
                  <div className="h-8 bg-gray-200 rounded w-20"></div>
                  <div className="h-8 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        ) : chapters.length === 0 ? (
          <Card className="bg-white">
            <CardContent className="p-12 text-center">
              <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No chapters yet
              </h3>
              <p className="text-gray-500 mb-6">
                Be the first to start a Happy Society chapter in your country!
              </p>
              <Link href="/intl/contact">
                <Button variant="primary">Start a Chapter</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chapters.map(chapter => (
              <Card key={chapter.id} className="bg-white hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">
                        {countryFlags[chapter.country_code] || '🌍'}
                      </span>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {chapter.country_name_en}
                        </h3>
                        {chapter.country_name_native && (
                          <p className="text-sm text-gray-500">
                            {chapter.country_name_native}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${statusLabels[chapter.status]?.color}`}>
                      {statusLabels[chapter.status]?.label}
                    </span>
                  </div>

                  {chapter.description_en && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {chapter.description_en}
                    </p>
                  )}

                  <div className="space-y-2 mb-4 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{chapter.member_count} members</span>
                    </div>
                    {chapter.founded_at && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Founded {formatDate(chapter.founded_at)}</span>
                      </div>
                    )}
                    {chapter.leader_name && (
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>Lead by {chapter.leader_name}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {chapter.website_url && (
                      <a
                        href={chapter.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Website
                      </a>
                    )}
                    {chapter.contact_email && (
                      <a
                        href={`mailto:${chapter.contact_email}`}
                        className="flex items-center gap-1 px-3 py-2 text-sm bg-[var(--primary-light)] text-[var(--primary)] rounded-lg hover:bg-[var(--primary)] hover:text-white transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                        Contact
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Start a Chapter CTA */}
        <Card className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] text-white mt-12">
          <CardContent className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold mb-2">
                  Don&apos;t see your country?
                </h3>
                <p className="text-white/80">
                  Start a Happy Society chapter in your community and join the global movement for a happier world.
                </p>
              </div>
              <Link href="/intl/contact">
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-[var(--primary)] whitespace-nowrap"
                >
                  Start a Chapter
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
