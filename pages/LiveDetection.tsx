
import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';

// --- Utility Functions for Audio ---
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const LiveDetection: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [transcription, setTranscription] = useState<string>('');
  const [status, setStatus] = useState<string>('Ready to start');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const frameIntervalRef = useRef<number | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const stopSession = () => {
    setIsActive(false);
    setStatus('Stopped');
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    if (frameIntervalRef.current) {
      clearInterval(frameIntervalRef.current);
    }
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
    sourcesRef.current.forEach(s => s.stop());
    sourcesRef.current.clear();
  };

  const startSession = async () => {
    try {
      setStatus('Initializing camera and microphone...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setStatus('Connecting to AI Agronomist...');
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const outputNode = outputAudioContextRef.current.createGain();
      outputNode.connect(outputAudioContextRef.current.destination);

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setStatus('Live: Examining your plants...');
            setIsActive(true);
            
            // Audio Stream
            const source = audioContextRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContextRef.current!.destination);

            // Video Stream (1 frame per second to save bandwidth but maintain live feel)
            frameIntervalRef.current = window.setInterval(() => {
              if (canvasRef.current && videoRef.current) {
                const ctx = canvasRef.current.getContext('2d');
                canvasRef.current.width = videoRef.current.videoWidth / 2; // Downscale for faster upload
                canvasRef.current.height = videoRef.current.videoHeight / 2;
                ctx?.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
                
                const base64Data = canvasRef.current.toDataURL('image/jpeg', 0.6).split(',')[1];
                sessionPromise.then(session => {
                  session.sendRealtimeInput({
                    media: { data: base64Data, mimeType: 'image/jpeg' }
                  });
                });
              }
            }, 1000);
          },
          onmessage: async (message: LiveServerMessage) => {
            // Handle Transcriptions
            if (message.serverContent?.outputTranscription) {
              setTranscription(prev => prev + ' ' + message.serverContent?.outputTranscription?.text);
            }
            if (message.serverContent?.turnComplete) {
              setTranscription(''); // Reset transcription on turn complete or keep it for history
            }

            // Handle Audio Output
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio && outputAudioContextRef.current) {
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputAudioContextRef.current.currentTime);
              const audioBuffer = await decodeAudioData(
                decode(base64Audio),
                outputAudioContextRef.current,
                24000,
                1
              );
              const source = outputAudioContextRef.current.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputAudioContextRef.current.destination);
              source.addEventListener('ended', () => sourcesRef.current.delete(source));
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => {
            console.error('Live Error:', e);
            setStatus('Connection Error');
            stopSession();
          },
          onclose: () => {
            setStatus('Session Closed');
            setIsActive(false);
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: "You are a world-class AI Agronomist. The user is showing you a live video feed of their plants. Your job is to describe what you see, identify any signs of pests or diseases in real-time, and speak concisely but informatively. If you see a healthy plant, tell them it looks good! If you see symptoms like spots, yellowing, or wilting, diagnose them and suggest immediate organic or chemical treatments. Keep your voice friendly and helpful.",
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
          },
          outputAudioTranscription: {}
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setStatus('Failed to start session');
    }
  };

  useEffect(() => {
    return () => stopSession();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Live AI Agronomist</h1>
          <p className="text-slate-500">Real-time disease detection via video & voice</p>
        </div>
        <div className={`px-4 py-2 rounded-full text-sm font-bold flex items-center space-x-2 ${isActive ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-slate-100 text-slate-400'}`}>
          <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-red-600' : 'bg-slate-400'}`}></div>
          <span>{isActive ? 'LIVE' : 'OFFLINE'}</span>
        </div>
      </div>

      <div className="relative aspect-video bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl group border-4 border-white">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className="w-full h-full object-cover"
        />
        <canvas ref={canvasRef} className="hidden" />

        {!isActive && (
          <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
            <button 
              onClick={startSession}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-2xl font-bold shadow-xl flex items-center space-x-3 active:scale-95 transition-all"
            >
              <i className="fas fa-play"></i>
              <span>Initialize Live Scan</span>
            </button>
          </div>
        )}

        {isActive && (
          <>
            {/* HUD Overlay */}
            <div className="absolute top-6 left-6 right-6 flex justify-between items-start pointer-events-none">
              <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
                <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest mb-1">Status</p>
                <p className="text-white text-sm font-medium">{status}</p>
              </div>
              <button 
                onClick={stopSession}
                className="bg-red-600 hover:bg-red-700 text-white w-12 h-12 rounded-xl flex items-center justify-center pointer-events-auto shadow-lg"
              >
                <i className="fas fa-stop"></i>
              </button>
            </div>

            {/* Transcription Display */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="bg-emerald-900/80 backdrop-blur-lg p-6 rounded-3xl border border-emerald-400/30 text-white min-h-[100px] flex items-center">
                {transcription ? (
                  <p className="text-lg font-medium leading-relaxed italic">
                    "{transcription.trim()}"
                  </p>
                ) : (
                  <div className="flex items-center space-x-4 opacity-50">
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                    <p className="text-sm">Listening for plant details...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Scanner Animation Line */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="w-full h-1 bg-emerald-400/50 shadow-[0_0_15px_rgba(52,211,153,0.8)] absolute animate-[scanner_3s_ease-in-out_infinite]"></div>
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: 'fa-microphone', label: 'Voice Control', text: 'Speak to the AI about the symptoms you see.' },
          { icon: 'fa-robot', label: 'Proactive AI', text: 'AI identifies issues automatically as you scan.' },
          { icon: 'fa-cloud-bolt', label: 'Real-time', text: 'Instant feedback without waiting for uploads.' }
        ].map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-start space-x-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <i className={`fas ${item.icon}`}></i>
            </div>
            <div>
              <p className="font-bold text-sm">{item.label}</p>
              <p className="text-xs text-slate-500 leading-relaxed mt-1">{item.text}</p>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes scanner {
          0% { top: 10%; opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { top: 90%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default LiveDetection;
