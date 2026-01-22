import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const body = await request.json();
    const { eventType, data } = body;

    switch (eventType) {
      case 'PAYMENT_STATUS_CHANGED': {
        const { orderId, status } = data;

        let dbStatus: string;
        switch (status) {
          case 'DONE':
            dbStatus = 'completed';
            break;
          case 'CANCELED':
            dbStatus = 'cancelled';
            break;
          case 'PARTIAL_CANCELED':
            dbStatus = 'refunded';
            break;
          default:
            dbStatus = 'pending';
        }

        await supabase
          .from('payments')
          .update({ status: dbStatus })
          .eq('pg_transaction_id', orderId);
        break;
      }

      case 'BILLING_KEY_DELETED': {
        // 정기 결제 키 삭제 처리
        const { customerKey } = data;
        console.log('정기 결제 키 삭제:', customerKey);
        break;
      }

      default:
        console.log('처리되지 않은 웹훅 이벤트:', eventType);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('웹훅 처리 오류:', error);
    return NextResponse.json(
      { error: '웹훅 처리에 실패했습니다.' },
      { status: 500 }
    );
  }
}
