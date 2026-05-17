'use client';
import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const API = process.env.NEXT_PUBLIC_API_URL;
const WS  = process.env.NEXT_PUBLIC_WS_URL;

export default function AdminPage() {
  const [token, setToken]         = useState<string | null>(null);
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [error, setError]         = useState('');
  const [queues, setQueues]       = useState<any[]>([]);
  const [activeQueue, setActiveQueue] = useState<any | null>(null);
  const [entries, setEntries]     = useState<any[]>([]);
  const [newQueue, setNewQueue]   = useState({ name: '', description: '' });
  const [showForm, setShowForm]   = useState(false);
  const socketRef = useRef<Socket | null>(null);


  useEffect(() => {
    const t = localStorage.getItem('admin_token');
    if (t) { setToken(t); fetchQueues(t); }
  }, []);

  useEffect(() => {
  return () => {
    socketRef.current?.disconnect();
  };
}, []);

  async function login() {
    setError('');
    const res = await fetch(`${API}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) { setError('Invalid credentials'); return; }
    const data = await res.json();
    localStorage.setItem('admin_token', data.access_token);
    setToken(data.access_token);
    fetchQueues(data.access_token);
  }

  async function fetchQueues(t: string) {
    const res = await fetch(`${API}/queues`, {
      headers: { Authorization: `Bearer ${t}` },
    });
    const data = await res.json();
    setQueues(data);
  }

  async function fetchEntries(queueId: string, t?: string) {
  const authToken = t || token;  
  const res = await fetch(`${API}/queues/${queueId}/entries`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
  const data = await res.json();
  setEntries(data);
}

 async function selectQueue(queue: any) {
  setActiveQueue(queue);
  fetchEntries(queue.id);

  socketRef.current?.disconnect();

  const s = io(WS!);
  s.emit('join-queue', { queueId: queue.id });
  
  const currentQueueId = queue.id;
  const currentToken = token;
  
  s.on('queue-updated', () => {
    fetchEntries(currentQueueId, currentToken!);
  });
  
  socketRef.current = s;
}

  async function createQueue() {
    await fetch(`${API}/queues`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newQueue),
    });
    setShowForm(false);
    setNewQueue({ name: '', description: '' });
    fetchQueues(token!);
  }

  async function toggleQueue(id: string) {
    await fetch(`${API}/queues/${id}/toggle`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchQueues(token!);
    if (activeQueue?.id === id) {
      setActiveQueue((q: any) => ({ ...q, isOpen: !q.isOpen }));
    }
  }

  async function callNext() {
    if (!activeQueue) return;
    await fetch(`${API}/queues/${activeQueue.id}/next`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchEntries(activeQueue.id);
  }

  async function completeEntry(id: string) {
    await fetch(`${API}/entries/${id}/complete`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchEntries(activeQueue.id);
  }

  function logout() {
    localStorage.removeItem('admin_token');
    setToken(null);
    setQueues([]);
    setActiveQueue(null);
  }

  const STATUS_COLORS: Record<string, string> = {
    WAITING:  'bg-blue-100 text-blue-700',
    NOTIFIED: 'bg-yellow-100 text-yellow-700',
    SERVING:  'bg-green-100 text-green-700',
  };

  // ── Login Screen ───────────────────────────────────────────
  if (!token) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-gray-900 border border-gray-800 rounded-xl p-8">
        <h1 className="text-white text-xl font-bold mb-1">Waitless</h1>
        <p className="text-gray-500 text-sm mb-6">Admin Dashboard</p>
        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
        <input
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm mb-3 outline-none focus:border-blue-500"
          placeholder="Email" value={email}
          onChange={e => setEmail(e.target.value)} />
        <input
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm mb-4 outline-none focus:border-blue-500"
          placeholder="Password" type="password" value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && login()} />
        <button onClick={login}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg py-2 text-sm transition-colors">
          Sign In
        </button>
      </div>
    </div>
  );

  // ── Dashboard ──────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-950 text-white flex">

      {/* Sidebar — Queues */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <h1 className="font-bold text-lg">Waitless</h1>
          <p className="text-gray-500 text-xs">Admin Dashboard</p>
        </div>

        <div className="p-3 flex-1 overflow-y-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-xs uppercase tracking-wider">Queues</span>
            <button onClick={() => setShowForm(true)}
              className="text-blue-400 text-xs hover:text-blue-300">+ New</button>
          </div>

          {showForm && (
            <div className="bg-gray-800 rounded-lg p-3 mb-3">
              <input
                className="w-full bg-gray-700 rounded px-2 py-1 text-sm text-white mb-2 outline-none"
                placeholder="Queue name" value={newQueue.name}
                onChange={e => setNewQueue({ ...newQueue, name: e.target.value })} />
              <input
                className="w-full bg-gray-700 rounded px-2 py-1 text-sm text-white mb-2 outline-none"
                placeholder="Description (optional)" value={newQueue.description}
                onChange={e => setNewQueue({ ...newQueue, description: e.target.value })} />
              <div className="flex gap-2">
                <button onClick={createQueue}
                  className="flex-1 bg-blue-600 text-white text-xs rounded py-1">Create</button>
                <button onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-700 text-gray-300 text-xs rounded py-1">Cancel</button>
              </div>
            </div>
          )}

          {queues.map(q => (
            <button key={q.id} onClick={() => selectQueue(q)}
              className={`w-full text-left px-3 py-2 rounded-lg mb-1 transition-colors ${
                activeQueue?.id === q.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}>
              <div className="font-medium text-sm">{q.name}</div>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  q.isOpen ? 'bg-green-900 text-green-400' : 'bg-gray-700 text-gray-500'
                }`}>
                  {q.isOpen ? 'Open' : 'Closed'}
                </span>
              </div>
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-gray-800">
          <button onClick={logout}
            className="text-gray-500 hover:text-white text-sm transition-colors">
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {!activeQueue ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-600">Select a queue to manage</p>
          </div>
        ) : (
          <>
            {/* Queue Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold">{activeQueue.name}</h2>
                {activeQueue.description && (
                  <p className="text-gray-500 text-sm">{activeQueue.description}</p>
                )}
              </div>
              <div className="flex gap-3">
                {/* Join Link */}
                <button onClick={() => {
                  navigator.clipboard.writeText(
                    `http://localhost:3000/join/${activeQueue.id}`
                  );
                  alert('Join link copied!');
                }}
                  className="bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm px-4 py-2 rounded-lg transition-colors">
                  Copy Join Link
                </button>
                <button onClick={() => toggleQueue(activeQueue.id)}
                  className={`text-sm px-4 py-2 rounded-lg transition-colors ${
                    activeQueue.isOpen
                      ? 'bg-red-900 hover:bg-red-800 text-red-300'
                      : 'bg-green-900 hover:bg-green-800 text-green-300'
                  }`}>
                  {activeQueue.isOpen ? 'Close Queue' : 'Open Queue'}
                </button>
                <button onClick={callNext}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors">
                  Call Next →
                </button>
              </div>
            </div>

            {/* Entries Table */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">#</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Name</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Status</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Email</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {entries.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center text-gray-600 py-12">
                        No one in the queue yet
                      </td>
                    </tr>
                  ) : entries.map(entry => (
                    <tr key={entry.id}
                      className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                      <td className="px-4 py-3 text-gray-500">{entry.position}</td>
                      <td className="px-4 py-3 font-medium">{entry.name}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_COLORS[entry.status]}`}>
                          {entry.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {entry.email || '—'}
                      </td>
                      <td className="px-4 py-3">
                        {entry.status === 'SERVING' && (
                          <button onClick={() => completeEntry(entry.id)}
                            className="text-xs text-green-400 hover:text-green-300 transition-colors">
                            Complete ✓
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
}