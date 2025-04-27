import {
  StreamVideoClient,
  TokenOrProvider,
  User,
} from '@stream-io/video-client';
import { useEffect, useState } from 'react';

export type UseClientOptions = {
  apiKey: string;
  user: User;
  tokenOrProvider: TokenOrProvider;
};

export const useVideoClient = ({
  apiKey,
  user,
  tokenOrProvider,
}: UseClientOptions): StreamVideoClient | undefined => {
  const [videoClient, setVideoClient] = useState<StreamVideoClient>();

  useEffect(() => {
    const streamVideoClient = new StreamVideoClient({ apiKey });
  
    let didUserConnectInterrupt = false;
    const videoConnectionPromise = streamVideoClient
      .connectUser(user, tokenOrProvider)
      .then(() => {
       
        if (!didUserConnectInterrupt) {
          setVideoClient(streamVideoClient);
        }
      });

    return () => {
      didUserConnectInterrupt = true;
      setVideoClient(undefined);
     
      videoConnectionPromise
        .then(() => streamVideoClient.disconnectUser())
        .then(() => {
          console.log('video connection closed');
        });
    };
    
  }, [apiKey, user.id, tokenOrProvider]);

  return videoClient;
};
