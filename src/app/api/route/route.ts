import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const origin = searchParams.get('origin');
  const destination = searchParams.get('destination');

  if (!origin || !destination) {
    return NextResponse.json({ error: 'Origin and destination are required' }, { status: 400 });
  }

  const url = `https://apis-navi.kakaomobility.com/v1/directions?origin=${origin}&destination=${destination}&priority=RECOMMEND`;

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}`,
      },
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('카카오 API 호출 에러:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}