// // @ts-ignore
// import MicRecorder from 'mic-recorder-to-mp3';
// import { mergeBuffers } from './mergeBuffers';

// export async function getCombinedStream() {
//   const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
//   const speakerStream = await (navigator.mediaDevices).getDisplayMedia({
//     video: true,
//     audio: true,
//   });

//   const micAudio = micStream.getAudioTracks();
//   const speakerAudio = speakerStream.getAudioTracks();

//   const combinedStream = new MediaStream();
//   micAudio.forEach(track => combinedStream.addTrack(track));
//   speakerAudio.forEach(track => combinedStream.addTrack(track));
//   console.log(combinedStream, "combinedStream...........");

//   return combinedStream;
// }

// export function createMicrophone(stream:any) {
//   let audioWorkletNode;
//   let audioContext: AudioContext;
//   let source;
//   let audioBufferQueue = new Int16Array(0);
//   const recorder = new MicRecorder({ bitRate: 128 });

//   return {
//     async startRecording(onAudioCallback:any) {
//       audioContext = new AudioContext({
//         sampleRate: 16000,
//         latencyHint: 'balanced',
//       });

//       source = audioContext.createMediaStreamSource(stream);
//       await audioContext.audioWorklet.addModule('audio-processor.js');

//       audioWorkletNode = new AudioWorkletNode(audioContext, 'audio-processor');
//       source.connect(audioWorkletNode);
//       audioWorkletNode.connect(audioContext.destination);

//       audioWorkletNode.port.onmessage = (event) => {
//         const currentBuffer = new Int16Array(event.data.audio_data);
//         audioBufferQueue = mergeBuffers(audioBufferQueue, currentBuffer);

//         const bufferDuration = (audioBufferQueue.length / audioContext.sampleRate) * 1000;

//         if (bufferDuration >= 100) {
//           const totalSamples = Math.floor(audioContext.sampleRate * 0.1);
//           const finalBuffer = new Uint8Array(audioBufferQueue.subarray(0, totalSamples).buffer);
//           audioBufferQueue = audioBufferQueue.subarray(totalSamples);
//           if (onAudioCallback) onAudioCallback(finalBuffer);
//         }
//       };

//       await recorder.start();
//     },

//     async stopRecording() {
//       stream?.getTracks().forEach((track:any) => track.stop());
//       audioContext?.close();
//       audioBufferQueue = new Int16Array(0);

//       const [buffer, blob] = await recorder.stop().getMp3();

//       const baseUrl = 'https://api.assemblyai.com';
//       const headers = {
//         authorization: 'e03bccdc4e8d43b1ab9e7593f3d149f0',
//         'content-type': 'application/json',
//       };

//       const uploadResponse = await fetch(`${baseUrl}/v2/upload`, {
//         method: 'POST',
//         headers: { authorization: headers.authorization },
//         body: blob,
//       });

//       const uploadData = await uploadResponse.json();
//       const uploadUrl = uploadData.upload_url;

//       const transcriptResponse = await fetch(`${baseUrl}/v2/transcript`, {
//         method: 'POST',
//         headers,
//         body: JSON.stringify({
//           audio_url: uploadUrl,
//           speaker_labels: true,
//         }),
//       });

//       const transcriptData = await transcriptResponse.json();
//       const transcriptId = transcriptData.id;
//       const pollingEndpoint = `${baseUrl}/v2/transcript/${transcriptId}`;

//       while (true) {
//         const pollingResponse = await fetch(pollingEndpoint, { headers });
//         const result = await pollingResponse.json();

//         if (result.status === 'completed') {
//           for (const utterance of result.utterances) {
//             const meetingId = localStorage.getItem('meetingId');
//             await fetch(`http://backend.kamalajoshi.site:8000/meetings/${meetingId}`, {
//               method: 'PUT',
//               headers: {
//                 accept: '*/*',
//                 'Content-Type': 'application/json',
//               },
//               body: JSON.stringify({ transcription: utterance.text }),
//             });
//             console.log(`Meeting ${meetingId}: Speaker ${utterance.speaker}: ${utterance.text}`);
//           }
//           break;
//         } else if (result.status === 'error') {
//           throw new Error(`Transcription failed: ${result.error}`);
//         } else {
//           await new Promise((resolve) => setTimeout(resolve, 3000));
//         }
//       }

//       const url = URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.style.display = 'none';
//       a.href = url;
//       a.download = `recording-${Date.now()}.mp3`;
//       document.body.appendChild(a);
//       a.click();
//       URL.revokeObjectURL(url);
//     },
//   };
// }

// @ts-ignore
// import MicRecorder from 'mic-recorder-to-mp3';
// import { mergeBuffers } from './mergeBuffers';

// export async function getCombinedStream() {
//   // Get mic stream
//   const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
//   console.log("🎤 Microphone stream tracks:", micStream.getTracks());

//   // Get speaker stream (screen share with audio)
//   const speakerStream = await (navigator.mediaDevices as any).getDisplayMedia({
//     video: true,
//     audio: true,
//   });
//   console.log("🔈 Speaker (Display) stream tracks:", speakerStream.getTracks());

//   // Extract audio tracks
//   const micAudioTracks = micStream.getAudioTracks();
//   const speakerAudioTracks = speakerStream.getAudioTracks();

//   // Create a new MediaStream
//   const combinedStream = new MediaStream();

//   // Add mic tracks
//   micAudioTracks.forEach(track => {
//     console.log('➕ Adding microphone track:', track);
//     combinedStream.addTrack(track);
//   });

//   // Add speaker tracks
//   speakerAudioTracks.forEach((track: MediaStreamTrack) => {
//     console.log('➕ Adding speaker track:', track);
//     combinedStream.addTrack(track);
//   });

//   console.log('🎬 Final combined stream:', combinedStream);
//   console.log('🎬 Combined stream tracks:', combinedStream.getTracks());

//   // 🎧 Play the combined stream for live debugging
//   const audioElement = new Audio();
//   audioElement.srcObject = combinedStream;
//   audioElement.muted = false; // important: unmute to hear it
//   audioElement.play().then(() => {
//     console.log('▶️ Playing combined audio stream for debugging...');
//   }).catch(error => {
//     console.error('❌ Error playing combined stream:', error);
//   });

//   return combinedStream;
// }

// export function createMicrophone(stream: MediaStream) {
//   let audioWorkletNode: AudioWorkletNode;
//   let audioContext: AudioContext;
//   let source: MediaStreamAudioSourceNode;
//   let audioBufferQueue = new Int16Array(0);
//   const recorder = new MicRecorder({ bitRate: 128 });

//   return {
//     async startRecording(onAudioCallback: (buffer: Uint8Array) => void) {
//       audioContext = new AudioContext({
//         sampleRate: 16000,
//         latencyHint: 'balanced',
//       });

//       console.log('🎙️ Starting recording with combined audio...');
//       console.log('🎙️ Stream tracks at start:', stream.getAudioTracks());

//       source = audioContext.createMediaStreamSource(stream);

//       await audioContext.audioWorklet.addModule('audio-processor.js');
//       audioWorkletNode = new AudioWorkletNode(audioContext, 'audio-processor');

//       source.connect(audioWorkletNode);
//       audioWorkletNode.connect(audioContext.destination);

//       audioWorkletNode.port.onmessage = (event) => {
//         const currentBuffer = new Int16Array(event.data.audio_data);
//         audioBufferQueue = mergeBuffers(audioBufferQueue, currentBuffer);

//         const bufferDuration = (audioBufferQueue.length / audioContext.sampleRate) * 1000;

//         if (bufferDuration >= 100) {
//           const totalSamples = Math.floor(audioContext.sampleRate * 0.1);
//           const finalBuffer = new Uint8Array(audioBufferQueue.subarray(0, totalSamples).buffer);
//           audioBufferQueue = audioBufferQueue.subarray(totalSamples);
//           if (onAudioCallback) onAudioCallback(finalBuffer);
//         }
//       };

//       await recorder.start();
//     },

//     async stopRecording() {
//       console.log('🛑 Stopping recording...');
//       stream?.getTracks().forEach((track) => track.stop());
//       audioContext?.close();
//       audioBufferQueue = new Int16Array(0);

//       const [buffer, blob] = await recorder.stop().getMp3();

//       // Upload the recording to AssemblyAI
//       const baseUrl = 'https://api.assemblyai.com';
//       const headers = {
//         authorization: 'e03bccdc4e8d43b1ab9e7593f3d149f0', // ⚠️ Replace with your real key
//         'content-type': 'application/json',
//       };

//       const uploadResponse = await fetch(`${baseUrl}/v2/upload`, {
//         method: 'POST',
//         headers: { authorization: headers.authorization },
//         body: blob,
//       });
//       const uploadData = await uploadResponse.json();
//       const uploadUrl = uploadData.upload_url;

//       const transcriptResponse = await fetch(`${baseUrl}/v2/transcript`, {
//         method: 'POST',
//         headers,
//         body: JSON.stringify({
//           audio_url: uploadUrl,
//           speaker_labels: true,
//         }),
//       });
//       const transcriptData = await transcriptResponse.json();
//       const transcriptId = transcriptData.id;
//       const pollingEndpoint = `${baseUrl}/v2/transcript/${transcriptId}`;

//       // Poll for transcription completion
//       while (true) {
//         const pollingResponse = await fetch(pollingEndpoint, { headers });
//         const result = await pollingResponse.json();

//         if (result.status === 'completed') {
//           for (const utterance of result.utterances) {
//             const meetingId = localStorage.getItem('meetingId');
//             await fetch(`http://backend.kamalajoshi.site:8000/meetings/${meetingId}`, {
//               method: 'PUT',
//               headers: {
//                 accept: '*/*',
//                 'Content-Type': 'application/json',
//               },
//               body: JSON.stringify({ transcription: utterance.text }),
//             });
//             console.log(`📃 Meeting ${meetingId}: Speaker ${utterance.speaker}: ${utterance.text}`);
//           }
//           break;
//         } else if (result.status === 'error') {
//           throw new Error(`❌ Transcription failed: ${result.error}`);
//         } else {
//           await new Promise((resolve) => setTimeout(resolve, 3000));
//         }
//       }

//       // Save recording locally
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.style.display = 'none';
//       a.href = url;
//       a.download = `recording-${Date.now()}.mp3`;
//       document.body.appendChild(a);
//       a.click();
//       URL.revokeObjectURL(url);
//     },
//   };
// }
// @ts-ignore
import MicRecorder from 'mic-recorder-to-mp3';
import { mergeBuffers } from './mergeBuffers';

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

          // Log the audio data in real-time
          console.log('🎤 Logging audio data: ', finalBuffer);
          
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
          speaker_labels: true,
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
