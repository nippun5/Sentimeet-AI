import { useVideoClient } from '@/hooks/useVideoClient';
import { Call, User } from '@stream-io/video-client';
import { StreamCall, StreamVideo } from '@stream-io/video-react-sdk';
import ErrorScreen from './ErrorScreen';
import { useCallback, useEffect, useState } from 'react';
import CallLayout from './CallLayout';

export default function CallContainer({
  apiKey,
  user,
  token,
}: {
  apiKey: string;
  user: User;
  token: string;
}): JSX.Element {
  const [call, setCall] = useState<Call | undefined>(undefined);
  const [joining, setJoining] = useState(false);
  const [mediaSupport, setMediaSupport] = useState(true);

  const videoClient = useVideoClient({
    apiKey,
    user,
    tokenOrProvider: token,
  });

  const callId = '123412341234';

  const createCall = useCallback(async () => {
    const callToCreate = videoClient?.call('default', callId);
    
    await callToCreate?.camera.disable(); 
    await callToCreate?.join({ create: true });
    setCall(callToCreate);
    setJoining(false);
  }, [videoClient]);

  // 🔍 Check for media device support on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && !navigator.mediaDevices) {
      console.warn('MediaDevices API is not available.');
      setMediaSupport(false);
    }
  }, []);

  useEffect(() => {
    if (!videoClient || !mediaSupport) return;

    if (!call) {
      if (joining) {
        createCall();
      } else {
        setJoining(true);
      }
    }
  }, [call, videoClient, createCall, joining, mediaSupport]);

  // Show error if media devices are not supported
  if (!mediaSupport) {
    return <ErrorScreen error="Your browser doesn't support camera/microphone access. Please use Chrome, Firefox, or Safari." />;
  }

  if (!videoClient) {
    return <ErrorScreen error='Client could not be initialized' />;
  }

  if (!call) {
    return (
      <div className='w-full h-full text-xl font-semibold flex items-center justify-center animate-pulse'>
        Joining call ...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[url('/images/meeting-bg.png')] bg-cover bg-center bg-no-repeat flex items-center justify-center">
      <StreamVideo client={videoClient}>
        <StreamCall call={call}>
          <CallLayout />
        </StreamCall>
      </StreamVideo>
    </div>
  );
}