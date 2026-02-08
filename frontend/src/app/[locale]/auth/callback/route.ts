import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/portal';

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // 프로필이 없으면 생성
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('id', data.user.id)
        .single();

      if (!existingProfile) {
        // 소셜 로그인 사용자의 프로필 생성
        const userName = data.user.user_metadata?.full_name ||
                        data.user.user_metadata?.name ||
                        data.user.email?.split('@')[0] ||
                        '사용자';

        await supabase.from('user_profiles').insert({
          id: data.user.id,
          name: userName,
          avatar_url: data.user.user_metadata?.avatar_url,
        });
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // 오류 발생 시 로그인 페이지로 리다이렉트
  return NextResponse.redirect(`${origin}/auth/login?error=oauth_error`);
}
