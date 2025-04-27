'use client';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { jwtDecode } from 'jwt-decode';
import { User } from '@stream-io/video-client';
import CallContainer from '@/components/CallContainer';
import ErrorScreen from '@/components/ErrorScreen';
import { Button, Typography } from '@material-tailwind/react';
import dotenv from 'dotenv';

type HomeState = {
  apiKey: string;
  user: User;
  token: string;
  // meetingId: string;
  // // meetingTitle: string;
  authorization: string;
};
dotenv.config();
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

  const baseUrl = process.env.BASE_URL;

  const handleRegister = async (e: React.FormEvent) => {
    console.log()
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${process.env.BASE_URL}/auth/signup`, {
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


  
  const handleLogin = async () => {
  
    setLoading(true);
    try {
      const res = await fetch(`${process.env.BASE_URL}/auth/login`, {
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

     
      const meetingData = {
        title: meetingTitle,
        description: 'Meeting description goes here', // Optional, modify as needed
        participants: [
          { userId: decoded.sub }, // Use the user ID from the token
        ],

      };

      const meetingres = await fetch(`${process.env.BASE_URL}/meetings`, {

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
      const meetingdata = await meetingres.json().then((data) => {
        console.log('Meeting data:', data);
        return data;
      });
      const meetingId = meetingdata.id; // Get the meeting ID from the response
      console.log("meetingid................................",meetingId)
      setHomeState({
        apiKey,
        user,
        authorization: data.access_token,
        token: data.stream_token
        // meetingId: meetingId,
        // meetingTitle,
      });
     
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

      const res = await fetch(`${process.env.BASE_URL}/meetings`, {
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
          <form onSubmit={(e) =>{
            
            e.preventDefault();
            handleLogin(); 
            
            }} className="space-y-4">
            <input type="email" required placeholder="Email" className="input-style w-full ..." value={email} onChange={(e) => setEmail(e.target.value)}  />
            <input type="password" required placeholder="Password" className="input-style w-full ..." value={password} onChange={(e) => setPassword(e.target.value)} />
            <input type="text" required  placeholder="Meeting Title" className="input-style w-full ..." value={meetingTitle} onChange={(e) => setMeetingTitle(e.target.value)} />
            <input type="text" required placeholder="Meeting ID" className="input-style w-full ..." value={meetingId} onChange={(e) => setMeetingId(e.target.value)} />
            <Button type="button" onClick={generateMeetingId} className="btn-secondary mr-5" placeholder={undefined}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              Generate Meeting ID
            </Button>

            <Button 
            type='submit'
              disabled={loading}
              className="btn-green w-full"
            
              placeholder={undefined}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}            >
              {loading ? 'Creating Meeting...' : 'Join Meeting'}
              {error && (
  <Typography className="text-red-500 text-sm text-center" placeholder={undefined}  onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
    {error}
  </Typography>)}
            </Button>
            <p className="text-sm text-center">
              New user?{' '}
              <button type="button" onClick={() => setStep('register')} className="text-[#f84525] font-semibold underline">Register</button>
            </p>
          </form>
        )}
      </div>
    </div>
   
  );
}
