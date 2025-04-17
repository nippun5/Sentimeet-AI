'use client';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';  // Make sure you have 'uuid' package installed
import { jwtDecode } from 'jwt-decode';
import { User } from '@stream-io/video-client';
import CallContainer from '@/components/CallContainer';
import ErrorScreen from '@/components/ErrorScreen';

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
      const res = await fetch(`http://3.133.152.112:8000/auth/signup`, {
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(process.env.BASE_URL+'/auth/login', {
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
      const meetingData = {
        title: meetingTitle,
        description: 'Meeting description goes here', // Optional, modify as needed
        participants: [
          { userId: decoded.sub }, // Use the user ID from the token
        ],
      };

      // Send the API request to create the meeting
      const meetingres = await fetch('http://localhost:8000/meetings', {
        method: 'POST',
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(meetingData),
      });

      if (!res.ok) {
        throw new Error(`Failed to create meeting: ${res.statusText}`);
      }

      // If successful, show a success message or redirect
      const meetingdata = await meetingres.json();
     
      localStorage.setItem("meetingId", meetingdata.id); // Save it to localStorage
      alert('Meeting created successfully!');
      console.log('Created meeting:', meetingdata);
      alert('Meeting created successfully!');
      console.log('Created meeting:', meetingdata); // Optionally log the response
    

      setStep('meeting');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to generate and set a new meeting ID
  const generateMeetingId = () => {
    const newMeetingId = uuidv4(); // Generate a new UUID for the meeting ID
    setMeetingId(newMeetingId); // Set it to the meetingId state
  };

  // Function to create a meeting
  const createMeeting = async () => {
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
          { userId: homeState?.user.id }, // Use the user ID from the token
        ],
      };

      // Send the API request to create the meeting
      const res = await fetch('http://localhost:8000/meetings', {
        method: 'POST',
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(meetingData),
      });

      if (!res.ok) {
        throw new Error(`Failed to create meeting: ${res.statusText}`);
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
  };

  if (error) return <ErrorScreen error={error} />;
  if (homeState) return <CallContainer {...homeState} />;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full sm:max-w-md bg-white p-6 rounded-xl shadow-md space-y-6">
        <div className="text-center">
          <h2 className="font-bold text-3xl">
            Sentimeet <span className="bg-[#f84525] text-white px-2 rounded-md">Meet</span>
          </h2>
          <p className="text-gray-500 text-sm">
            {step === 'register' ? 'Register a new account' : step === 'login' ? 'Login to your account' : 'Create or Join a Meeting'}
          </p>
        </div>

        {step === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4">
            <input type="email" required placeholder="Email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="text" required placeholder="First Name" className="input" value={firstname} onChange={(e) => setFirstname(e.target.value)} />
            <input type="text" required placeholder="Last Name" className="input" value={lastname} onChange={(e) => setLastname(e.target.value)} />
            <input type="password" required placeholder="Password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button disabled={loading} className="btn-red w-full">{loading ? 'Registering...' : 'Register'}</button>
            <p className="text-sm text-center">
              Already have an account?{' '}
              <button type="button" onClick={() => setStep('login')} className="text-[#f84525] font-semibold">Login</button>
            </p>
          </form>
        )}

        {step === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="email" required placeholder="Email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" required placeholder="Password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
            
            {/* Add the Meeting ID and Title fields */}
            <input 
              type="text" 
              required 
              placeholder="Meeting Title" 
              className="input" 
              value={meetingTitle} 
              onChange={(e) => setMeetingTitle(e.target.value)} 
            />
            <input 
              type="text" 
              required 
              placeholder="Meeting ID" 
              className="input" 
              value={meetingId} 
              onChange={(e) => setMeetingId(e.target.value)} 
            />
            
            {/* Button to generate a new Meeting ID */}
            <button 
              type="button" 
              onClick={generateMeetingId} 
              className="w-full bg-blue-500 text-white py-2.5 rounded-md hover:bg-blue-700 transition font-semibold"
            >
              Generate Meeting ID
            </button>

            <button 
              disabled={loading} 
              className="btn-green w-full"
              onClick={handleLogin} // Trigger meeting creation on button click
            >
              {loading ? 'Creating Meeting...' : 'Join Meeting'}
            </button>
            <p className="text-sm text-center">
              New user?{' '}
              <button type="button" onClick={() => setStep('register')} className="text-[#f84525] font-semibold">Register</button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
