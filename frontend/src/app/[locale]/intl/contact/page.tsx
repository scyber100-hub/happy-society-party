'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Globe,
  Mail,
  Send,
  CheckCircle,
  MapPin,
  Users,
  MessageSquare
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const categories = [
  { value: 'general', label: 'General Inquiry', labelKo: '일반 문의' },
  { value: 'membership', label: 'Membership', labelKo: '회원 가입' },
  { value: 'chapter', label: 'Start a Chapter', labelKo: '지부 설립' },
  { value: 'partnership', label: 'Partnership', labelKo: '파트너십' },
  { value: 'press', label: 'Press/Media', labelKo: '언론/미디어' },
  { value: 'other', label: 'Other', labelKo: '기타' },
];

const languages = [
  { value: 'en', label: 'English' },
  { value: 'ko', label: '한국어' },
  { value: 'ja', label: '日本語' },
  { value: 'zh', label: '中文' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
];

export default function IntlContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    country_code: '',
    category: 'general',
    subject: '',
    message: '',
    preferred_language: 'en',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const supabase = createClient();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: submitError } = await (supabase as any)
        .from('intl_contacts')
        .insert({
          name: formData.name,
          email: formData.email,
          country_code: formData.country_code || null,
          category: formData.category,
          subject: formData.subject,
          message: formData.message,
          preferred_language: formData.preferred_language,
        });

      if (submitError) throw submitError;

      setIsSubmitted(true);
    } catch (err) {
      console.error('Failed to submit:', err);
      setError('Failed to submit your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[var(--gray-50)]">
        <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] text-white py-12">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <Globe className="w-12 h-12 mx-auto mb-4" />
            <h1 className="text-3xl md:text-4xl font-bold">Contact Us</h1>
          </div>
        </div>
        <div className="max-w-2xl mx-auto px-4 py-16">
          <Card className="bg-white">
            <CardContent className="p-12 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Thank You!
              </h2>
              <p className="text-gray-600 mb-6">
                Your message has been received. We will get back to you as soon as possible.
              </p>
              <Button
                variant="primary"
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({
                    name: '',
                    email: '',
                    country_code: '',
                    category: 'general',
                    subject: '',
                    message: '',
                    preferred_language: 'en',
                  });
                }}
              >
                Send Another Message
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--gray-50)]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Globe className="w-8 h-8" />
            <h1 className="text-3xl md:text-4xl font-bold">Contact Us</h1>
          </div>
          <p className="text-white/90 max-w-2xl mx-auto">
            Get in touch with Happy Society International. We&apos;d love to hear from you!
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="bg-white">
              <CardContent className="p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-[var(--primary)]" />
                  Send us a message
                </h2>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Input
                      label="Your Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                    />
                    <Input
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country (Optional)
                      </label>
                      <input
                        type="text"
                        name="country_code"
                        value={formData.country_code}
                        onChange={handleChange}
                        placeholder="e.g., KR, US, JP"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Language
                      </label>
                      <select
                        name="preferred_language"
                        value={formData.preferred_language}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                      >
                        {languages.map(lang => (
                          <option key={lang.value} value={lang.value}>
                            {lang.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label} / {cat.labelKo}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Input
                    label="Subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Brief subject of your message"
                    required
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      placeholder="Tell us how we can help..."
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    isLoading={isSubmitting}
                    className="flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card className="bg-white">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-[var(--primary)] mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Email</p>
                      <a href="mailto:international@happysociety.party" className="text-[var(--primary)] hover:underline">
                        international@happysociety.party
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Globe className="w-5 h-5 text-[var(--primary)] mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Website</p>
                      <a href="https://happy-society.org" target="_blank" rel="noopener noreferrer" className="text-[var(--primary)] hover:underline">
                        happy-society.org
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card className="bg-white">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Links
                </h3>
                <div className="space-y-3">
                  <Link
                    href="/intl/board"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <MessageSquare className="w-5 h-5 text-[var(--primary)]" />
                    <span className="text-gray-700">Global Board</span>
                  </Link>
                  <Link
                    href="/intl/chapters"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <MapPin className="w-5 h-5 text-[var(--primary)]" />
                    <span className="text-gray-700">Find a Chapter</span>
                  </Link>
                  <Link
                    href="/intl/join"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Users className="w-5 h-5 text-[var(--primary)]" />
                    <span className="text-gray-700">Join Us</span>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Start a Chapter */}
            <Card className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-white">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">
                  Start a Chapter in Your Country
                </h3>
                <p className="text-white/80 text-sm mb-4">
                  Interested in bringing the Happy Society movement to your community?
                  Select &quot;Start a Chapter&quot; in the form and tell us about yourself!
                </p>
                <div className="text-white/90 text-sm">
                  <p className="font-medium mb-1">What we provide:</p>
                  <ul className="list-disc list-inside space-y-1 text-white/80">
                    <li>Organizational support</li>
                    <li>Resources and materials</li>
                    <li>Connection with global network</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
