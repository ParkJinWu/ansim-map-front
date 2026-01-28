'use client';

import { useEffect, useState } from 'react';

export default function TestPage() {
  const [data, setData] = useState<{ message?: string; status?: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 백엔드 API 호출
    fetch('http://localhost:8080/api/check')
      .then((res) => {
        if (!res.ok) throw new Error('네트워크 응답에 문제가 있습니다.');
        return res.json();
      })
      .then((data) => setData(data))
      .catch((err) => {
        console.error(err);
        setError('백엔드 서버와 연결할 수 없습니다. (CORS 또는 서버 꺼짐)');
      });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="p-8 bg-white shadow-lg rounded-2xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Ansim Map Test</h1>
        
        {error ? (
          <p className="text-red-500 font-medium">{error}</p>
        ) : data ? (
          <div className="text-center">
            <p className="text-green-600 text-xl font-semibold mb-2">{data.message}</p>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
              Status: {data.status}
            </span>
          </div>
        ) : (
          <p className="text-gray-400 animate-pulse">백엔드 응답 대기 중...</p>
        )}
      </div>
    </div>
  );
}