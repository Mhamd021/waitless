'use client';
import { useState, useEffect, use } from 'react';
import { io, Socket } from 'socket.io-client';

const API = process.env.NEXT_PUBLIC_API_URL;
const WS  = process.env.NEXT_PUBLIC_WS_URL;

const STATUS_LABELS: Record<string, string> = {
  WAITING:  'Waiting',
  NOTIFIED: 'Your turn is soon!',
  SERVING:  'Your turn now!',
  DONE:     'Done',
  LEFT:     'Left',
};

const STATUS_COLORS: Record<string, string> = {
  WAITING:  'text-blue-400',
  NOTIFIED: 'text-yellow-400',
  SERVING:  'text-green-400',
  DONE:     'text-gray-500',
  LEFT:     'text-gray-500',
};

export default function TrackPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const [data, setData]     = useState<any>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [left, setLeft]     = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    fetchStatus();
  }, [token]);

  useEffect(() => {
  console.log('token from URL:', token);
}, [token]);

  useEffect(() => {
    if (!data?.queueId) return;

    const s = io(WS!);
    s.emit('join-queue', { queueId: data.queueId });

    s.on('queue-updated', () => {
      fetchStatus();
    });

    setSocket(s);
    return () => { s.disconnect(); };
  }, [data?.queueId]);

  async function fetchStatus() {
    try {
      const res = await fetch(`${API}/track/${token}`);
      const json = await res.json();
      setData(json);
    } finally {
      setLoading(false);
    }
  }

  async function leaveQueue() {
    await fetch(`${API}/track/${token}/leave`, { method: 'PATCH' });
    socket?.disconnect();
    setLeft(true);
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <p className="text-gray-500">Loading...</p>
    </div>
  );

  if (left) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="text-center">
        <p className="text-4xl mb-4">👋</p>
        <h1 className="text-white text-xl font-bold">You left the queue</h1>
        <p className="text-gray-500 mt-2">See you next time!</p>
      </div>
    </div>
  );

  if (!data) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <p className="text-red-400">Queue not found</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Queue Name */}
        <div className="text-center mb-8">
          <p className="text-gray-500 text-sm mb-1">You are in</p>
          <h1 className="text-white text-2xl font-bold">{data.queueName}</h1>
        </div>

        {/* Position Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center mb-4">

          {data.status === 'SERVING' ? (
            <>
              <p className="text-6xl mb-4">🎉</p>
              <p className="text-green-400 text-2xl font-bold">Your turn now!</p>
              <p className="text-gray-500 mt-2">Please proceed immediately</p>
            </>
          ) : data.status === 'DONE' ? (
            <>
              <p className="text-6xl mb-4">✅</p>
              <p className="text-gray-400 text-xl font-bold">Done!</p>
            </>
          ) : (
            <>
              <p className="text-gray-500 text-sm mb-2">Your position</p>
              <p className="text-7xl font-bold text-white mb-4">
                    {typeof data.ahead === 'number' ? data.ahead + 1 : '—'}

              </p>
              <p className={`text-lg font-semibold ${STATUS_COLORS[data.status]}`}>
                {STATUS_LABELS[data.status]}
              </p>
              {data.ahead > 0 && (
                <p className="text-gray-500 text-sm mt-3">
                  {data.ahead} {data.ahead === 1 ? 'person' : 'people'} ahead of you
                </p>
              )}
              {data.ahead === 0 && data.status === 'WAITING' && (
                <p className="text-yellow-400 text-sm mt-3 font-medium">
                  You are next!
                </p>
              )}
            </>
          )}
        </div>

        {/* Queue Status */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className={`w-2 h-2 rounded-full ${
            data.isQueueOpen ? 'bg-green-400' : 'bg-gray-600'
          }`}/>
          <span className="text-gray-500 text-sm">
            {data.isQueueOpen ? 'Queue is open' : 'Queue is closed'}
          </span>
        </div>

        {/* Leave Button */}
        {!['DONE', 'LEFT'].includes(data.status) && (
          <button onClick={leaveQueue}
            className="w-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white text-sm font-medium py-3 rounded-xl transition-colors">
            Leave Queue
          </button>
        )}

      </div>
    </div>
  );
}