// 'use client';

// import CallContainer from '@/components/CallContainer';
// import ErrorScreen from '@/components/ErrorScreen';
// import { User } from '@stream-io/video-client';
// import { jwtDecode } from 'jwt-decode';
// import { useCallback, useEffect, useState } from 'react';

// type HomeState = {
//   apiKey: string;
//   user: User;
//   token: string;
//   authorization: string;
//   meeetingId: string;
// };
// type DecodedToken = {
//   sub: string;
//   firstname: string;
//   lastname: string;
// };

// export default function Home() {
//   const [homeState, setHomeState] = useState<HomeState | undefined>();
//   const [error, setError] = useState<string | undefined>();
//   const getUserTokenFunction = useCallback(getUserToken, []);

//   useEffect(() => {
//     // TODO: replace by login mechanism and real IDs
//     const token =homeState?.authorization;
//     if (!token) {
//       setError('No token found');
//       return;
//     }
//     const decoded = jwtDecode<DecodedToken>(token);
//     const userId = decoded.sub;
//     getUserTokenFunction(userId, decoded.firstname,token);
//   }, [getUserTokenFunction]);

//   if (error) {
//     return <ErrorScreen error={error} />;
//   }

//   if (homeState) {
//     return <CallContainer {...homeState} />;
//   }

//   return (
//     <section className='w-screen-h-screen flex items-center justify-center'>
//       <h1 className='animate-pulse'>Loading</h1>
//     </section>
//   );

//   async function getUserToken(userId: string, userName: string, authtoken: string) {
//     const response = await fetch('/api/token', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ userId: userId }),
//     });

//     const responseBody = await response.json();
//     const token = responseBody.token;

//     if (!token) {
//       setError('No token found');
//     }

//     const user: User = {
//       id: userId,
//       name: userName,
//       image: `https://getstream.io/random_png/?id=${userId}&name=${userName}`,
//     };

//     const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
//     if (apiKey) {
//       setHomeState({ apiKey: apiKey, user: user, token: token,authorization: authtoken });
//     } else if (process.env.NEXT_PUBLIC_STREAM_API_KEY === undefined) {
//     } else {
//       setError('API key not found. Please add to your environment file.');
//     }
//   }
// }
'use client';

import CallContainer from '@/components/CallContainer';
import ErrorScreen from '@/components/ErrorScreen';
import { User } from '@stream-io/video-client';
import { jwtDecode } from 'jwt-decode';
import { useCallback, useEffect, useState } from 'react';

type HomeState = {
  apiKey: string;
  user: User;
  token: string;
  authorization: string;
  meetingId: string;
};

type DecodedToken = {
  sub: string;
  firstname: string;
  lastname: string;
};

export default function CallPage() {
  const [homeState, setHomeState] = useState<HomeState>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    const meetingId = localStorage.getItem('meetingId');

    if (!authToken || !meetingId) {
      setError('Missing authToken or meetingId');
      return;
    }

    const decoded = jwtDecode<DecodedToken>(authToken);
    const userId = decoded.sub;
    const userName = `${decoded.firstname} ${decoded.lastname}`;

    getUserToken(userId, userName, authToken, meetingId);
  }, []);

  async function getUserToken(userId: string, userName: string, authToken: string, meetingId: string) {
    try {
      const response = await fetch('/api/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      const { token } = await response.json();
      const user: User = {
        id: userId,
        name: userName,
        image: `https://getstream.io/random_png/?id=${userId}&name=${userName}`,
      };

      const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!;
      setHomeState({ apiKey, user, token, authorization: authToken, meetingId });
    } catch (e) {
      setError('Failed to get Stream token');
    }
  }

  if (error) return <ErrorScreen error={error} />;
  if (!homeState) return <div className='text-center mt-20'>Loading...</div>;

  return <CallContainer {...homeState} />;
}
