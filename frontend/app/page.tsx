'use client';

import CallContainer from '@/components/CallContainer';
import ErrorScreen from '@/components/ErrorScreen';
import { User } from '@stream-io/video-client';
import { useState } from 'react';
import { Sparkles } from 'lucide-react';

type HomeState = {
  apiKey: string;
  user: User;
  token: string;
  meetingId: string;
};

export default function Home() {
  const [homeState, setHomeState] = useState<HomeState | undefined>();
  const [error, setError] = useState<string | undefined>();

  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [meetingId, setMeetingId] = useState('');
  const [step, setStep] = useState<'login' | 'meeting'>('login');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('meeting');
  };

  const handleJoinMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      const { token } = await response.json();
      if (!token) throw new Error('No token received');

      const user: User = {
        id: userId,
        name: userName,
        image: `https://getstream.io/random_png/?id=${userId}&name=${userName}`,
      };

      const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
      if (!apiKey) throw new Error('Missing API key');

      await fetch('/api/save-meeting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, userName, meetingId }),
      });

      setHomeState({ apiKey, user, token, meetingId });
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (error) return <ErrorScreen error={error} />;
  if (homeState) return <CallContainer {...homeState} />;

  return (
    
    <div className=" flex items-center justify-center bg-gray-700">
      <div className="w-full sm:max-w-md bg-white p-6 rounded-xl shadow-md">
        <div className="text-center mb-6">
          <h2 className="font-bold text-3xl">
            Sentimeet <span className="bg-[#f84525] text-white px-2 rounded-md">Meet</span>
          </h2>
        </div>

        <div className="mb-6 text-center">

          <h1 className="text-xl font-semibold">
            {step === 'login' ? 'Log in' : 'Join a Meeting'}
          </h1>
        </div>

        {step === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">User ID</label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
                className="w-full rounded-md py-2 px-4 border text-sm outline-[#f84525]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Your Name</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
                className="w-full rounded-md py-2 px-4 border text-sm outline-[#f84525]"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#f84525] text-white py-2.5 rounded-md hover:bg-red-700 transition font-semibold"
            >
              Continue →
            </button>
          </form>
        ) : (
          <form onSubmit={handleJoinMeeting} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Meeting ID</label>
              <input
                type="text"
                value={meetingId}
                onChange={(e) => setMeetingId(e.target.value)}
                required
                className="w-full rounded-md py-2 px-4 border text-sm outline-[#f84525]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-2.5 rounded-md hover:bg-green-700 transition font-semibold disabled:opacity-60"
            >
              {loading ? 'Joining...' : 'Join Call 🎥'}
            </button>
          </form>
        )}
      </div>
   </div>
  );
}
