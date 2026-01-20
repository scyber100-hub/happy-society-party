import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { userId, paymentType, amount } = await request.json();

    if (!userId || !paymentType || !amount) {
      return NextResponse.json(
        { error: '필수 파라미터가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 결제 요청 생성
    const orderId = `PARTY_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // 결제 대기 상태로 DB에 저장
    const periodStart = new Date();
    const periodEnd = new Date();
    if (paymentType === 'monthly') {
      periodEnd.setMonth(periodEnd.getMonth() + 1);
    } else {
      periodEnd.setFullYear(periodEnd.getFullYear() + 1);
    }

    const { data: payment, error: insertError } = await supabase
      .from('payments')
      .insert({
        user_id: userId,
        payment_type: paymentType,
        amount: amount,
        status: 'pending',
        pg_provider: 'tosspayments',
        pg_transaction_id: orderId,
        period_start: periodStart.toISOString().split('T')[0],
        period_end: periodEnd.toISOString().split('T')[0],
      })
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    return NextResponse.json({
      success: true,
      orderId,
      paymentId: payment.id,
    });
  } catch (error) {
    console.error('결제 준비 오류:', error);
    return NextResponse.json(
      { error: '결제 준비에 실패했습니다.' },
      { status: 500 }
    );
  }
}
