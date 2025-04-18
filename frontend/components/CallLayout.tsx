'use client';
import Image from 'next/image';
import { createMicrophone } from '@/helpers/createMicrophone';
import { createTranscriber } from '@/helpers/createTranscriber';
import { CallingState } from '@stream-io/video-client';
import { useRouter } from 'next/navigation';
import {
  useCallStateHooks,
  StreamTheme,
  SpeakerLayout,
  CallControls,
} from '@stream-io/video-react-sdk';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import { useCallback, useState } from 'react';
import robotImage from '../assets/recorder.png';
import assistant from '../assets/assistant.png';
import { RealtimeTranscriber } from 'assemblyai';
import { Button, Card, Typography } from '@material-tailwind/react';


export default function CallLayout(): JSX.Element {
  const router = useRouter();
  // Text to display what is transcribed from AssemblyAI
  const [transcribedText, setTranscribedText] = useState<string>('');
  const [llmActive, setLllmActive] = useState<boolean>(false);
  const [llmResponse, setLlmResponse] = useState<string>('');
  const [robotActive, setRobotActive] = useState<boolean>(false);
  const [transcriber, setTranscriber] = useState<
    RealtimeTranscriber | undefined
  >(undefined);
  const [mic, setMic] = useState<
    | {
        startRecording(onAudioCallback: any): Promise<void>;
        stopRecording(): void;
      }
    | undefined
  >(undefined);

  // Collecting data from the Stream SDK using hooks
  const { useCallCallingState, useParticipantCount, useMicrophoneState } =
    useCallStateHooks();
  const participantCount = useParticipantCount();
  const callingState = useCallCallingState();
  const { mediaStream } = useMicrophoneState();

  const processPrompt = useCallback(async (prompt: string) => {
    const response = await fetch('/api/lemurRequest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: prompt }),
    });

    const responseBody = await response.json();
    const lemurResponse = responseBody.response;
    console.log(lemurResponse);
    setLlmResponse(lemurResponse);

    setTimeout(() => {
      setLlmResponse('');
      setLllmActive(false);
      setTranscribedText('');
    }, 7000);
  }, []);

  const initializeAssemblyAI = useCallback(async () => {
    const transcriber = await createTranscriber(
      setTranscribedText,
      setLllmActive,
      processPrompt
    );

    if (!transcriber) {
      console.error('Transcriber is not created');
      return;
    }
    await transcriber.connect();

    if (!mediaStream) {
      console.error('No media stream found');
      return;
    }
    const mic = createMicrophone(mediaStream);
    console.log('Mic: ', mic, ', starting recording');
    mic.startRecording((audioData: any) => {
      transcriber.sendAudio(audioData);
    });
    setMic(mic);
    setTranscriber(transcriber);
  }, [mediaStream, processPrompt]);

  if (callingState !== CallingState.JOINED) {
    return (
      <section className='h-screen w-screen flex items-center justify-center font-bold'>
<Card
          className="shadow-xl flex flex-col justify-center items-center bg-white text-black h-36 p-6 border border-gray-300 rounded-2xl hover:shadow-2xl transition-all duration-300"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
<Typography variant="h5" className="text-gray-900 mb-2  tracking-wide"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
    {"Meeting ended"}
  </Typography>
  <Typography variant="small" className="text-gray-500 mb-5  tracking-wide"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
    {" go to dashboard to see analytics and other meeting outcomes."}
  </Typography>
  <Button className="btn-primary" onClick={() => router.push('/analytics')} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
      Go To Dashboard
      </Button>
</Card>  
      </section>
    );
  }
  

  return (
    <StreamTheme>
      <h2>Participants: {participantCount}</h2>
      <div className='relative overflow-hidden rounded-xl'>
        <SpeakerLayout participantsBarPosition='bottom' />
        {llmResponse && (
          <div className='absolute mx-8 top-8 right-8 bg-white text-black p-4 rounded-lg shadow-md'>
            {llmResponse}
          </div>
        )}
        <div className='flex items-center justify-center w-full absolute bottom-2'>
          <h3 className='text-white text-center bg-black rounded-xl px-6 py-1'>
            {transcribedText}
          </h3>
        </div>
        <div
          className={`absolute transition ease-in-out duration-300 bottom-1 right-4 ${
            llmActive
              ? 'translate-x-0 translate-y-0 opacity-100'
              : 'translate-x-60 translate-y-60 opacity-0'
          }`}
        >
          <Image
            src={assistant}
            width={200}
            height={200}
            alt='llama'
            className='relative'
          />
        </div>
      </div>
      <div className='flex items-center justify-between mx-4'>
        <CallControls />
        <button className='ml-8' onClick={() => switchRobot(robotActive)}>
          <Image
            src={robotImage}
            width={50}
            height={50}
            alt='robot'
            className={`border-2 border-black dark:bg-white rounded-full transition-colors ease-in-out duration-200 ${
              robotActive ? 'bg-black animate-pulse' : ''
            }`}
          />
        </button>
      </div>
    </StreamTheme>
  );

  async function switchRobot(isActive: boolean) {
    if (isActive) {
      console.log('Robot is active');
      mic?.stopRecording();
      await transcriber?.close(false);
      setMic(undefined);
      setTranscriber(undefined);
      setRobotActive(false);
    } else {
      console.log('Robot is inactive');
      await initializeAssemblyAI();
      console.log('Initialized Assembly AI');
      setRobotActive(true);
    }
  }
}
