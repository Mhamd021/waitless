'use client';
import { useState, use } from 'react';
import { useRouter } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL;

export default function JoinPage({
  params,
}: {
  params: Promise<{ queueId: string }>;
}) {
  const { queueId } = use(params);
  const router = useRouter();
  const [name, setName]   = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function join() {
    if (!name.trim()) { setError('Please enter your name'); return; }
    setLoading(true);
    setError('');

    const res = await fetch(`${API}/queues/${queueId}/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.message || 'Failed to join queue');
      setLoading(false);
      return;
    }

    const data = await res.json();
    router.push(`/track/${data.token}`);
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-gray-900 border border-gray-800 rounded-xl p-8">
        <h1 className="text-white text-xl font-bold mb-1">Join Queue</h1>
        <p className="text-gray-500 text-sm mb-6">
          Enter your details to get in line
        </p>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        <input
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm mb-3 outline-none focus:border-blue-500"
          placeholder="Your name *" value={name}
          onChange={e => setName(e.target.value)} />

        <input
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm mb-6 outline-none focus:border-blue-500"
          placeholder="Email (optional — for notifications)"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && join()} />

        <button onClick={join} disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold rounded-lg py-2 text-sm transition-colors">
          {loading ? 'Joining...' : 'Join Queue'}
        </button>
      </div>
    </div>
  );
}