import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const TOSS_SECRET_KEY = process.env.TOSS_PAYMENTS_SECRET_KEY!;

export async function POST(request: NextRequest) {
  try {
    const { paymentKey, orderId, amount } = await request.json();

    if (!paymentKey || !orderId || !amount) {
      return NextResponse.json(
        { error: '필수 파라미터가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 토스페이먼츠 결제 승인 API 호출
    const confirmResponse = await fetch(
      'https://api.tosspayments.com/v1/payments/confirm',
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${TOSS_SECRET_KEY}:`).toString('base64')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentKey,
          orderId,
          amount,
        }),
      }
    );

    const confirmData = await confirmResponse.json();

    if (!confirmResponse.ok) {
      // 결제 실패 처리
      await supabase
        .from('payments')
        .update({ status: 'failed' })
        .eq('pg_transaction_id', orderId);

      return NextResponse.json(
        { error: confirmData.message || '결제 승인에 실패했습니다.' },
        { status: 400 }
      );
    }

    // 결제 성공 - DB 업데이트
    const { data: payment, error: updateError } = await supabase
      .from('payments')
      .update({
        status: 'completed',
        paid_at: new Date().toISOString(),
        receipt_url: confirmData.receipt?.url,
      })
      .eq('pg_transaction_id', orderId)
      .select('user_id')
      .single();

    if (updateError) {
      throw updateError;
    }

    // 사용자를 당원으로 업데이트
    if (payment?.user_id) {
      await supabase
        .from('user_profiles')
        .update({
          is_party_member: true,
          party_member_since: new Date().toISOString(),
        })
        .eq('id', payment.user_id);
    }

    return NextResponse.json({
      success: true,
      receipt: confirmData.receipt,
    });
  } catch (error) {
    console.error('결제 승인 오류:', error);
    return NextResponse.json(
      { error: '결제 처리에 실패했습니다.' },
      { status: 500 }
    );
  }
}
