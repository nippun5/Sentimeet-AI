'use client';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { jwtDecode } from 'jwt-decode';
import { User } from '@stream-io/video-client';
import CallContainer from '@/components/CallContainer';
import ErrorScreen from '@/components/ErrorScreen';
import { Button, Typography } from '@material-tailwind/react';

type HomeState = {
  apiKey: string;
  user: User;
  token: string;
  meetingId: string;
  meetingTitle: string;
};

type DecodedToken = {
  sub: string;
  firstname: string;
  lastname: string;
};

export default function Home() {
  const [step, setStep] = useState<'register' | 'login' | 'meeting'>('register');
  const [homeState, setHomeState] = useState<HomeState | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [password, setPassword] = useState('');
  const [meetingId, setMeetingId] = useState('');
  const [meetingTitle, setMeetingTitle] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, firstname, lastname, password }),
      });

      if (!res.ok) throw new Error('Registration failed');
      setStep('login');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createMeeting = async (user: User) => {
    if (!meetingTitle || !meetingId) {
      setError('Please provide both meeting title and ID.');
      return;
    }

    setLoading(true);
    try {
      // Prepare the payload for creating the meeting
      const meetingData = {
        title: meetingTitle,
        description: 'Meeting description goes here', // Optional, modify as needed
        participants: [
          { userId: user.id }, // Use the user ID from the token
        ],
      };

      // Send the API request to create the meeting
      const res = await fetch('http://localhost:8000/meetings', {
        method: 'POST',
        headers: {
          'accept': '/',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(meetingData),
      });

      if (!res.ok) {
        throw new Error("⁠ Failed to create meeting: ${res.statusText} ");
      }

      // If successful, show a success message or redirect
      const data = await res.json();
      alert('Meeting created successfully!');
      console.log('Created meeting:', data); // Optionally log the response
      setStep('meeting'); // You can change this based on your flow
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  
  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      const decoded = jwtDecode<DecodedToken>(data.access_token);

      const user: User = {
        id: decoded.sub,
        name: `${decoded.firstname} ${decoded.lastname}`,
        image: `https://getstream.io/random_png/?id=${decoded.sub}&name=${decoded.firstname}`,
      };

      
     
      const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!;
      if (!apiKey) throw new Error('Missing API key');

      setHomeState({
        apiKey,
        user,
        token: data.stream_token,
        meetingId,
        meetingTitle,
      });
      await createMeeting( user);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const generateMeetingId = () => {
    const newMeetingId = uuidv4();
    setMeetingId(newMeetingId);
  };

  if (error) return <ErrorScreen error={error} />;
  if (homeState && step === 'meeting') return <CallContainer {...homeState} />;

  return (
    <div className="min-h-screen bg-[url('/images/bg.jpg')] bg-cover bg-center bg-no-repeat flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-xl p-8 sm:p-10 rounded-2xl shadow-2xl w-full max-w-lg space-y-6">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold tracking-tight">
            <span className="bg-[#f84525] px-3 py-1 rounded-md text-white">SentiMeet</span>
          </h2>
          <p className="text-lg font-medium mt-2 text-gray-200">
            {step === 'register'
              ? 'Register a new account'
              : step === 'login'
              ? 'Login to your account'
              : 'Create or Join a Meeting'}
          </p>
        </div>

        {step === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4">
            <input type="email" required placeholder="Email" className="input-style w-full ..." value={email} onChange={(e) => setEmail(e.target.value)} />
            <div className="flex gap-4">
              <input type="text" required placeholder="First Name" className="input-style w-1/2 ..." value={firstname} onChange={(e) => setFirstname(e.target.value)} />
              <input type="text" required placeholder="Last Name" className="input-style w-1/2 ..." value={lastname} onChange={(e) => setLastname(e.target.value)} />
            </div>
            <input type="password" required placeholder="Password" className="input-style w-full ..." value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button disabled={loading} type="submit" className="btn-primary" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              {loading ? 'Registering...' : 'Register'}
            </Button>
            <Typography className="text-sm text-center text-gray-300" placeholder={undefined}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              Already have an account?{' '}
              <button type="button" onClick={() => setStep('login')} className="text-[#f84525] font-semibold underline">Login</button>
            </Typography>
          </form>
        )}

        {step === 'login' && (
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <input type="email" required placeholder="Email" className="input-style w-full ..." value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" required placeholder="Password" className="input-style w-full ..." value={password} onChange={(e) => setPassword(e.target.value)} />
            <input type="text" required placeholder="Meeting Title" className="input-style w-full ..." value={meetingTitle} onChange={(e) => setMeetingTitle(e.target.value)} />
            <input type="text" required placeholder="Meeting ID" className="input-style w-full ..." value={meetingId} onChange={(e) => setMeetingId(e.target.value)} />
            <Button type="button" onClick={generateMeetingId} className="btn-secondary mr-5" placeholder={undefined}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              Generate Meeting ID
            </Button>
            <Button disabled={loading} type="button" onClick={handleLogin} className="btn-success" placeholder={undefined}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              {loading ? 'Logging in...' : 'Join Meeting'}
            </Button>
            <p className="text-sm text-center text-gray-300">
              New user?{' '}
              <button type="button" onClick={() => setStep('register')} className="text-[#f84525] font-semibold underline">Register</button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
