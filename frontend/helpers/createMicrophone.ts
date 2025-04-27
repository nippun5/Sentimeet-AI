
// @ts-ignore
import MicRecorder from 'mic-recorder-to-mp3';
import { mergeBuffers } from './mergeBuffers';
import dotenv from 'dotenv';
dotenv.config();

// // @ts-ignore
// import MicRecorder from 'mic-recorder-to-mp3';
// import { mergeBuffers } from './mergeBuffers';

export function createMicrophone(stream: MediaStream) {
  let audioWorkletNode: AudioWorkletNode;
  let audioContext: AudioContext;
  let source: MediaStreamAudioSourceNode;
  let audioBufferQueue = new Int16Array(0);
  const recorder = new MicRecorder({ bitRate: 128 });

  return {
    async startRecording(onAudioCallback: (buffer: Uint8Array) => void) {
      audioContext = new AudioContext({
        sampleRate: 16000,
        latencyHint: 'balanced',
      });

      console.log('🎙️ Starting recording with combined audio...');
      console.log('🎙️ Stream tracks at start:', stream.getAudioTracks());

      source = audioContext.createMediaStreamSource(stream);

      await audioContext.audioWorklet.addModule('audio-processor.js');
      audioWorkletNode = new AudioWorkletNode(audioContext, 'audio-processor');

      source.connect(audioWorkletNode);
      audioWorkletNode.connect(audioContext.destination);

      audioWorkletNode.port.onmessage = (event) => {
        const currentBuffer = new Int16Array(event.data.audio_data);
        audioBufferQueue = mergeBuffers(audioBufferQueue, currentBuffer);

        const bufferDuration = (audioBufferQueue.length / audioContext.sampleRate) * 1000;

        if (bufferDuration >= 100) {
          const totalSamples = Math.floor(audioContext.sampleRate * 0.1);
          const finalBuffer = new Uint8Array(audioBufferQueue.subarray(0, totalSamples).buffer);
          audioBufferQueue = audioBufferQueue.subarray(totalSamples);

          
          // Trigger callback to handle audio
          if (onAudioCallback) onAudioCallback(finalBuffer);
        }
      };

      await recorder.start();
    },

    async stopRecording() {
      console.log('🛑 Stopping recording...');
      stream?.getTracks().forEach((track) => track.stop());
      audioContext?.close();
      audioBufferQueue = new Int16Array(0);

      const [buffer, blob] = await recorder.stop().getMp3();

      // Upload the recording to AssemblyAI
      const baseUrl = 'https://api.assemblyai.com';
      const headers = {
        authorization: 'e03bccdc4e8d43b1ab9e7593f3d149f0', // ⚠️ Replace with your real key
        'content-type': 'application/json',
      };

      const uploadResponse = await fetch(`${baseUrl}/v2/upload`, {
        method: 'POST',
        headers: { authorization: headers.authorization },
        body: blob,
      });
      const uploadData = await uploadResponse.json();
      const uploadUrl = uploadData.upload_url;

      const transcriptResponse = await fetch(`${baseUrl}/v2/transcript`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          audio_url: uploadUrl,
          speaker_labels: true, // Ensure speaker labeling is enabled
        }),
      });
      const transcriptData = await transcriptResponse.json();
      const transcriptId = transcriptData.id;
      const pollingEndpoint = `${baseUrl}/v2/transcript/${transcriptId}`;

      // Poll for transcription completion
      while (true) {
        const pollingResponse = await fetch(pollingEndpoint, { headers });
        const result = await pollingResponse.json();

        if (result.status === 'completed') {
          // Log each speaker's transcriptions to the console
          for (const utterance of result.utterances) {
            console.log(`📃 Speaker ${utterance.speaker}: ${utterance.text}`);
            
            // Optionally, send the transcriptions to your server
            const meetingId = localStorage.getItem('meetingId');
            console.log('utterance:::: ${utterance.text}')
            await fetch(`http://backend.kamalajoshi.site:8000/meetings/${meetingId}`, {
              method: 'PUT',
              headers: {
                accept: '*/*',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ transcription: utterance.text }),
            });
          }
          break;
        } else if (result.status === 'error') {
          throw new Error(`❌ Transcription failed: ${result.error}`);
        } else {
          await new Promise((resolve) => setTimeout(resolve, 3000));
        }
      }

      // Save recording locally
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `recording-${Date.now()}.mp3`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
    },
  };
}