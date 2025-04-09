// 'use client';

// import CallContainer from '@/components/CallContainer';
// import ErrorScreen from '@/components/ErrorScreen';
// import { User } from '@stream-io/video-client';
// import { useState } from 'react';
// import { Sparkles } from 'lucide-react';

// type HomeState = {
//   apiKey: string;
//   user: User;
//   token: string;
//   meetingId: string;
// };

// export default function Home() {
//   const [homeState, setHomeState] = useState<HomeState | undefined>();
//   const [error, setError] = useState<string | undefined>();

//   const [userId, setUserId] = useState('');
//   const [userName, setUserName] = useState('');
//   const [meetingId, setMeetingId] = useState('');
//   const [step, setStep] = useState<'login' | 'meeting'>('login');
//   const [loading, setLoading] = useState(false);

//   const handleLogin = (e: React.FormEvent) => {
//     e.preventDefault();
//     setStep('meeting');
//   };

//   const handleJoinMeeting = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const response = await fetch('/api/token', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ userId }),
//       });

//       const { token } = await response.json();
//       if (!token) throw new Error('No token received');

//       const user: User = {
//         id: userId,
//         name: userName,
//         image: `https://getstream.io/random_png/?id=${userId}&name=${userName}`,
//       };

//       const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
//       if (!apiKey) throw new Error('Missing API key');

//       await fetch('/api/save-meeting', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ userId, userName, meetingId }),
//       });

//       setHomeState({ apiKey, user, token, meetingId });
//     } catch (err: any) {
//       setError(err.message || 'Something went wrong');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (error) return <ErrorScreen error={error} />;
//   if (homeState) return <CallContainer {...homeState} />;

//   return (
//     <div className=" flex items-center justify-center bg-gray-700">
//       <div className="w-full sm:max-w-md bg-white p-6 rounded-xl shadow-md">
//         <div className="text-center mb-6">
//           <h2 className="font-bold text-3xl">
//             Sentimeet <span className="bg-[#f84525] text-white px-2 rounded-md">Meet</span>
//           </h2>
//         </div>

//         <div className="mb-6 text-center">

//           <h1 className="text-xl font-semibold">
//             {step === 'login' ? 'Log in' : 'Join a Meeting'}
//           </h1>
//         </div>

//         {step === 'login' ? (
//           <form onSubmit={handleLogin} className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">User ID</label>
//               <input
//                 type="text"
//                 value={userId}
//                 onChange={(e) => setUserId(e.target.value)}
//                 required
//                 className="w-full rounded-md py-2 px-4 border text-sm outline-[#f84525]"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Your Name</label>
//               <input
//                 type="text"
//                 value={userName}
//                 onChange={(e) => setUserName(e.target.value)}
//                 required
//                 className="w-full rounded-md py-2 px-4 border text-sm outline-[#f84525]"
//               />
//             </div>
//             <button
//               type="submit"
//               className="w-full bg-[#f84525] text-white py-2.5 rounded-md hover:bg-red-700 transition font-semibold"
//             >
//               Continue →
//             </button>
//           </form>
//         ) : (
//           <form onSubmit={handleJoinMeeting} className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Meeting ID</label>
//               <input
//                 type="text"
//                 value={meetingId}
//                 onChange={(e) => setMeetingId(e.target.value)}
//                 required
//                 className="w-full rounded-md py-2 px-4 border text-sm outline-[#f84525]"
//               />
//             </div>
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-green-600 text-white py-2.5 rounded-md hover:bg-green-700 transition font-semibold disabled:opacity-60"
//             >
//               {loading ? 'Joining...' : 'Join Call 🎥'}
//             </button>
//           </form>
//         )}
//       </div>
//    </div>
//   );
// }



// 'use client';

// import { useState } from 'react';
// import { jwtDecode } from 'jwt-decode';
// import { User } from '@stream-io/video-client';
// import CallContainer from '@/components/CallContainer';
// import ErrorScreen from '@/components/ErrorScreen';

// type HomeState = {
//   apiKey: string;
//   user: User;
//   token: string;
//   meetingId: string;
// };

// type DecodedToken = {
//   sub: string;
//   firstname: string;
//   lastname: string;
// };

// export default function Home() {
//   const [step, setStep] = useState<'register' | 'login' | 'meeting'>('register');
//   const [homeState, setHomeState] = useState<HomeState | undefined>();
//   const [error, setError] = useState<string | undefined>();
//   const [loading, setLoading] = useState(false);

//   const [email, setEmail] = useState('');
//   const [firstname, setFirstname] = useState('');
//   const [lastname, setLastname] = useState('');
//   const [password, setPassword] = useState('');
//   const [meetingId, setMeetingId] = useState('');

//   const handleRegister = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const res = await fetch('http://localhost:8000/auth/signup', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, firstname, lastname, password }),
//       });

//       if (!res.ok) throw new Error('Registration failed');
//       setStep('login');
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const res = await fetch('http://localhost:8000/auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await res.json();
//       const decoded = jwtDecode<DecodedToken>(data.access_token);
// console.log(  "decoded..........",decoded)

//       const user: User = {
//         id: decoded.sub, // ✅ Must match backend user ID
//         name: `${decoded.firstname} ${decoded.lastname}`,
//         image: `https://getstream.io/random_png/?id=${decoded.sub}&name=${decoded.firstname}`,
//       };

//       const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!;
//       if (!apiKey) throw new Error('Missing API key');

//       setHomeState({
//         apiKey,
//         user,
//         token: data.access_token,
//         meetingId,
//       });

//       setStep('meeting');
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (error) return <ErrorScreen error={error} />;
//   if (homeState) return <CallContainer {...homeState} />;

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
//       <div className="w-full sm:max-w-md bg-white p-6 rounded-xl shadow-md space-y-6">
//         <div className="text-center">
//           <h2 className="font-bold text-3xl">
//             Sentimeet <span className="bg-[#f84525] text-white px-2 rounded-md">Meet</span>
//           </h2>
//           <p className="text-gray-500 text-sm">
//             {step === 'register' ? 'Register a new account' : step === 'login' ? 'Login to your account' : 'Join the Meeting'}
//           </p>
//         </div>

//         {step === 'register' && (
//           <form onSubmit={handleRegister} className="space-y-4">
//             <input type="email" required placeholder="Email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
//             <input type="text" required placeholder="First Name" className="input" value={firstname} onChange={(e) => setFirstname(e.target.value)} />
//             <input type="text" required placeholder="Last Name" className="input" value={lastname} onChange={(e) => setLastname(e.target.value)} />
//             <input type="password" required placeholder="Password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
//             <button disabled={loading} className="btn-red w-full">{loading ? 'Registering...' : 'Register'}</button>
//             <p className="text-sm text-center">
//               Already have an account?{' '}
//               <button type="button" onClick={() => setStep('login')} className="text-[#f84525] font-semibold">Login</button>
//             </p>
//           </form>
//         )}

//         {step === 'login' && (
//           <form onSubmit={handleLogin} className="space-y-4">
//             <input type="email" required placeholder="Email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
//             <input type="password" required placeholder="Password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
//             <input type="text" required placeholder="Meeting ID" className="input" value={meetingId} onChange={(e) => setMeetingId(e.target.value)} />
//             <button disabled={loading} className="btn-green w-full">{loading ? 'Logging in...' : 'Join Meeting'}</button>
//             <p className="text-sm text-center">
//               New user?{' '}
//               <button type="button" onClick={() => setStep('register')} className="text-[#f84525] font-semibold">Register</button>
//             </p>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// }


// 'use client';

// import { useState } from 'react';
// import { jwtDecode } from 'jwt-decode';
// import { User } from '@stream-io/video-client';
// import { StreamVideoClient } from '@stream-io/video-react-sdk';
// import CallContainer from '@/components/CallContainer';
// import ErrorScreen from '@/components/ErrorScreen';

// type HomeState = {
//   apiKey: string;
//   user: User;
//   token: string;
//   meetingId: string;
// };

// type DecodedToken = {
//   sub: string;
//   firstname: string;
//   lastname: string;
// };

// export default function Home() {
//   const [step, setStep] = useState<'register' | 'login' | 'meeting'>('register');
//   const [homeState, setHomeState] = useState<HomeState | undefined>();
//   const [error, setError] = useState<string | undefined>();
//   const [loading, setLoading] = useState(false);

//   const [email, setEmail] = useState('');
//   const [firstname, setFirstname] = useState('');
//   const [lastname, setLastname] = useState('');
//   const [password, setPassword] = useState('');
//   const [meetingId, setMeetingId] = useState('');

//   const handleRegister = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const res = await fetch('http://localhost:8000/auth/signup', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, firstname, lastname, password }),
//       });

//       if (!res.ok) throw new Error('Registration failed');
//       setStep('login');
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const res = await fetch('http://localhost:8000/auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await res.json();

//       const decoded = jwtDecode<DecodedToken>(data.access_token);

//       const user: User = {
//         id: decoded.sub, // must match what your backend uses for user_id
//         name: `${decoded.firstname} ${decoded.lastname}`,
//         image: `https://getstream.io/random_png/?id=${decoded.sub}&name=${decoded.firstname}`,
//       };

//       const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!;
//       if (!apiKey) throw new Error('Missing API key');

//       setHomeState({
//         apiKey,
//         user,
//         token: data.stream_token, // ✅ use the stream token
//         meetingId,
//       });

//       setStep('meeting');
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (error) return <ErrorScreen error={error} />;
//   if (homeState) return <CallContainer {...homeState} />;

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
//       <div className="w-full sm:max-w-md bg-white p-6 rounded-xl shadow-md space-y-6">
//         <div className="text-center">
//           <h2 className="font-bold text-3xl">
//             Sentimeet <span className="bg-[#f84525] text-white px-2 rounded-md">Meet</span>
//           </h2>
//           <p className="text-gray-500 text-sm">
//             {step === 'register' ? 'Register a new account' : step === 'login' ? 'Login to your account' : 'Join the Meeting'}
//           </p>
//         </div>

//         {step === 'register' && (
//           <form onSubmit={handleRegister} className="space-y-4">
//             <input type="email" required placeholder="Email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
//             <input type="text" required placeholder="First Name" className="input" value={firstname} onChange={(e) => setFirstname(e.target.value)} />
//             <input type="text" required placeholder="Last Name" className="input" value={lastname} onChange={(e) => setLastname(e.target.value)} />
//             <input type="password" required placeholder="Password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
//             <button disabled={loading} className="btn-red w-full">{loading ? 'Registering...' : 'Register'}</button>
//             <p className="text-sm text-center">
//               Already have an account?{' '}
//               <button type="button" onClick={() => setStep('login')} className="text-[#f84525] font-semibold">Login</button>
//             </p>
//           </form>
//         )}

//         {step === 'login' && (
//           <form onSubmit={handleLogin} className="space-y-4">
//             <input type="email" required placeholder="Email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
//             <input type="password" required placeholder="Password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
//             <input type="text" required placeholder="Meeting ID" className="input" value={meetingId} onChange={(e) => setMeetingId(e.target.value)} />
//             <button disabled={loading} className="btn-green w-full">{loading ? 'Logging in...' : 'Join Meeting'}</button>
//             <p className="text-sm text-center">
//               New user?{' '}
//               <button type="button" onClick={() => setStep('register')} className="text-[#f84525] font-semibold">Register</button>
//             </p>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// }




// 'use client';

// import { useState } from 'react';
// import { v4 as uuidv4 } from 'uuid';  // Make sure you have 'uuid' package installed
// import { jwtDecode } from 'jwt-decode';
// import { User } from '@stream-io/video-client';
// import CallContainer from '@/components/CallContainer';
// import ErrorScreen from '@/components/ErrorScreen';

// type HomeState = {
//   apiKey: string;
//   user: User;
//   token: string;
//   meetingId: string;
// };

// type DecodedToken = {
//   sub: string;
//   firstname: string;
//   lastname: string;
// };

// export default function Home() {
//   const [step, setStep] = useState<'register' | 'login' | 'meeting'>('register');
//   const [homeState, setHomeState] = useState<HomeState | undefined>();
//   const [error, setError] = useState<string | undefined>();
//   const [loading, setLoading] = useState(false);

//   const [email, setEmail] = useState('');
//   const [firstname, setFirstname] = useState('');
//   const [lastname, setLastname] = useState('');
//   const [password, setPassword] = useState('');
//   const [meetingId, setMeetingId] = useState('');

//   const handleRegister = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const res = await fetch('http://localhost:8000/auth/signup', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, firstname, lastname, password }),
//       });

//       if (!res.ok) throw new Error('Registration failed');
//       setStep('login');
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const res = await fetch('http://localhost:8000/auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await res.json();
//       const decoded = jwtDecode<DecodedToken>(data.access_token);

//       const user: User = {
//         id: decoded.sub, 
//         name: `${decoded.firstname} ${decoded.lastname}`,
//         image: `https://getstream.io/random_png/?id=${decoded.sub}&name=${decoded.firstname}`,
//       };

//       const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!;
//       if (!apiKey) throw new Error('Missing API key');

//       setHomeState({
//         apiKey,
//         user,
//         token: data.stream_token,
//         meetingId,
//       });

//       setStep('meeting');
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Function to generate and set a new meeting ID
//   const generateMeetingId = () => {
//     const newMeetingId = uuidv4(); // Generate a new UUID for the meeting ID
//     setMeetingId(newMeetingId); // Set it to the meetingId state
//   };

//   if (error) return <ErrorScreen error={error} />;
//   if (homeState) return <CallContainer {...homeState} />;

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
//       <div className="w-full sm:max-w-md bg-white p-6 rounded-xl shadow-md space-y-6">
//         <div className="text-center">
//           <h2 className="font-bold text-3xl">
//             Sentimeet <span className="bg-[#f84525] text-white px-2 rounded-md">Meet</span>
//           </h2>
//           <p className="text-gray-500 text-sm">
//             {step === 'register' ? 'Register a new account' : step === 'login' ? 'Login to your account' : 'Join the Meeting'}
//           </p>
//         </div>

//         {step === 'register' && (
//           <form onSubmit={handleRegister} className="space-y-4">
//             <input type="email" required placeholder="Email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
//             <input type="text" required placeholder="First Name" className="input" value={firstname} onChange={(e) => setFirstname(e.target.value)} />
//             <input type="text" required placeholder="Last Name" className="input" value={lastname} onChange={(e) => setLastname(e.target.value)} />
//             <input type="password" required placeholder="Password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
//             <button disabled={loading} className="btn-red w-full">{loading ? 'Registering...' : 'Register'}</button>
//             <p className="text-sm text-center">
//               Already have an account?{' '}
//               <button type="button" onClick={() => setStep('login')} className="text-[#f84525] font-semibold">Login</button>
//             </p>
//           </form>
//         )}

//         {step === 'login' && (
//           <form onSubmit={handleLogin} className="space-y-4">
//             <input type="email" required placeholder="Email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
//             <input type="password" required placeholder="Password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
            
//             {/* Add the Meeting ID field */}
//             <input 
//               type="text" 
//               required 
//               placeholder="Meeting ID" 
//               className="input" 
//               value={meetingId} 
//               onChange={(e) => setMeetingId(e.target.value)} 
//             />
            
//             {/* Button to generate a new Meeting ID */}
//             <button 
//               type="button" 
//               onClick={generateMeetingId} 
//               className="w-full bg-blue-500 text-white py-2.5 rounded-md hover:bg-blue-700 transition font-semibold"
//             >
//               Generate Meeting ID
//             </button>

//             <button disabled={loading} className="btn-green w-full">{loading ? 'Logging in...' : 'Join Meeting'}</button>
//             <p className="text-sm text-center">
//               New user?{' '}
//               <button type="button" onClick={() => setStep('register')} className="text-[#f84525] font-semibold">Register</button>
//             </p>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// }

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
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

            <button disabled={loading} className="btn-green w-full">{loading ? 'Logging in...' : 'Join Meeting'}</button>
            <p className="text-sm text-center">
              New user?{' '}
              <button type="button" onClick={() => setStep('register')} className="text-[#f84525] font-semibold">Register</button>
            </p>
          </form>
        )}

        {step === 'meeting' && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Meeting Details</h3>
            <div>
              <p><strong>Title:</strong> {meetingTitle}</p>
              <p><strong>Meeting ID:</strong> {meetingId}</p>
            </div>
            <button 
              className="w-full bg-green-500 text-white py-2.5 rounded-md hover:bg-green-700 transition font-semibold"
              onClick={() => {
                // Handle creating/joining the meeting with the generated meeting ID and title
                console.log('Creating or joining meeting...');
              }}
            >
              Start Meeting
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
