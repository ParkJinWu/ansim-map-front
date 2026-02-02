// src/app/api/odsay/route.ts

import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sx = searchParams.get('sx');
  const sy = searchParams.get('sy');
  const ex = searchParams.get('ex');
  const ey = searchParams.get('ey');

  const apiKey = process.env.ODSAY_API_KEY;

  // 💡 팁: 터미널에 찍어서 키가 제대로 로드됐는지 확인
  console.log("Using API Key:", apiKey);

  // ODsay 키는 특수문자가 포함된 경우가 많으므로 decode 후 다시 encode하거나, 
  // 발급받은 그대로 사용하는 것이 안전합니다.
  const url = `https://api.odsay.com/v1/api/searchPubTransPathT?SX=${sx}&SY=${sy}&EX=${ex}&EY=${ey}&apiKey=${apiKey}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch ODsay' }, { status: 500 });
  }
}