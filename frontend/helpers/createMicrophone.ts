// @ts-ignore
import MicRecorder from 'mic-recorder-to-mp3';
import { mergeBuffers } from './mergeBuffers';
import axios from 'axios';


export function createMicrophone(stream: MediaStream) {
  let audioWorkletNode;
  let audioContext: AudioContext;
  let source;
  let audioBufferQueue = new Int16Array(0);
  const recorder = new MicRecorder({ bitRate: 128 });

  return {
    async startRecording(onAudioCallback: any) {
      audioContext = new AudioContext({
        sampleRate: 16_000,
        latencyHint: 'balanced',
      });
      source = audioContext.createMediaStreamSource(stream);

      await audioContext.audioWorklet.addModule('audio-processor.js');
      audioWorkletNode = new AudioWorkletNode(audioContext, 'audio-processor');

      source.connect(audioWorkletNode);
      audioWorkletNode.connect(audioContext.destination);
      audioWorkletNode.port.onmessage = (event) => {
        const currentBuffer = new Int16Array(event.data.audio_data);
        audioBufferQueue = mergeBuffers(audioBufferQueue, currentBuffer);

        const bufferDuration =
          (audioBufferQueue.length / audioContext.sampleRate) * 1000;

        if (bufferDuration >= 100) {
          const totalSamples = Math.floor(audioContext.sampleRate * 0.1);

          const finalBuffer = new Uint8Array(
            audioBufferQueue.subarray(0, totalSamples).buffer
          );

          audioBufferQueue = audioBufferQueue.subarray(totalSamples);
          if (onAudioCallback) onAudioCallback(finalBuffer);
        }
      };

      // 🔴 Start MP3 recording
      await recorder.start();
    },

    async stopRecording() {
      stream?.getTracks().forEach((track) => track.stop());
      audioContext?.close();
      audioBufferQueue = new Int16Array(0);

      // 🟢 Stop MP3 recording
      const [buffer, blob] = await recorder.stop().getMp3();
      const baseUrl = 'https://api.assemblyai.com'
      const headers = {
        authorization: "e03bccdc4e8d43b1ab9e7593f3d149f0", // Replace with your actual API key
        'content-type': 'application/json'
      }
     
      const uploadResponse = await fetch(`${baseUrl}/v2/upload`, {
        method: 'POST',
        headers: {
          authorization: headers.authorization
        },
        body: blob
      })
  
      const uploadData = await uploadResponse.json()
      const uploadUrl = uploadData.upload_url
  
      // Step 2: Submit for transcription with speaker_labels
      const transcriptResponse = await fetch(`${baseUrl}/v2/transcript`, {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          audio_url: uploadUrl,
          speaker_labels: true
        })
      })
  
      const transcriptData = await transcriptResponse.json()
      const transcriptId = transcriptData.id
  
      // Step 3: Poll for result
      const pollingEndpoint = `${baseUrl}/v2/transcript/${transcriptId}`
      while (true) {
        const pollingResponse = await fetch(pollingEndpoint, {
          headers
        })
        const result = await pollingResponse.json()
  
        if (result.status === 'completed') {
          for (const utterance of result.utterances) {
            const meetingId = localStorage.getItem("meetingId");
            await fetch(`https://backend.kamalajoshi.site/meetings/${meetingId}`, {
              method: 'PUT',
              headers: {
                'accept': '*/*',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                transcription: utterance.text,
              }),
            });
            console.log(`"meeting...........",${meetingId},Speaker ${utterance.speaker}: ${utterance.text}`)
          }
          break
        } else if (result.status === 'error') {
          throw new Error(`Transcription failed: ${result.error}`)
        } else {
          await new Promise((resolve) => setTimeout(resolve, 3000))
        }
      }

      // Trigger download
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