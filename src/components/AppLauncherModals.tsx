import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  X,
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  RefreshCw,
  ExternalLink,
  ShieldAlert,
  Calculator as CalcIcon,
  Play,
  RotateCcw,
} from 'lucide-react';

// ================= CAMERA VIEWFINDER MODAL =================
interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CameraModal: React.FC<CameraModalProps> = ({ isOpen, onClose }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [snapshot, setSnapshot] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  useEffect(() => {
    if (!isOpen) {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
      setSnapshot(null);
      return;
    }

    let activeStream: MediaStream | null = null;
    const startCamera = async () => {
      try {
        const s = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
          audio: false,
        });
        activeStream = s;
        setStream(s);
        setHasPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
      } catch (err) {
        console.warn('Camera access error:', err);
        setHasPermission(false);
      }
    };

    startCamera();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(t => t.stop());
      }
    };
  }, [isOpen, facingMode]);

  const takePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      setSnapshot(canvas.toDataURL('image/png'));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-[#0b0c10] border-2 border-red-700/80 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(220,38,38,0.4)] flex flex-col">
        {/* HUD Top Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#14080b] border-b border-red-800/60 font-mono text-xs text-red-400">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-red-500 animate-pulse" />
            <span className="font-bold tracking-widest uppercase">ULTRON OPTICAL SENSORS</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-red-400 hover:text-white hover:bg-red-950 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder Feed */}
        <div className="relative w-full h-80 bg-black flex items-center justify-center overflow-hidden">
          {snapshot ? (
            <img src={snapshot} alt="Captured" className="w-full h-full object-cover" />
          ) : hasPermission === false ? (
            <div className="flex flex-col items-center justify-center p-6 text-center text-red-400 space-y-3 font-mono">
              <ShieldAlert className="w-12 h-12 text-red-500" />
              <p className="text-sm">OPTICAL SENSORS INACCESSIBLE</p>
              <p className="text-xs text-zinc-400">
                Grant camera permission in browser or utilize simulated scan telemetry.
              </p>
            </div>
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          )}

          {/* Holographic Crosshairs & Grid Overlay */}
          <div className="absolute inset-0 pointer-events-none border border-red-500/20">
            {/* Corner brackets */}
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-red-500" />
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-red-500" />
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-red-500" />
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-red-500" />

            {/* Center target reticle */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full border border-dashed border-red-500/50 animate-spin" />
              <div className="absolute w-2 h-2 bg-red-500 rounded-full" />
            </div>

            {/* Telemetry info */}
            <div className="absolute bottom-3 left-3 text-[10px] font-mono text-red-400 bg-black/60 px-2 py-0.5 rounded border border-red-900/60">
              TARGET LOCK: 99.8% | ISO: 400 | FPS: 60
            </div>
          </div>
        </div>

        {/* Camera Controls */}
        <div className="p-4 bg-[#10070a] border-t border-red-900/50 flex items-center justify-around">
          <button
            onClick={() => setFacingMode(prev => (prev === 'user' ? 'environment' : 'user'))}
            className="p-2.5 rounded-full bg-zinc-900 text-red-300 hover:bg-zinc-800 transition-colors border border-red-950"
            title="Flip Lens"
          >
            <RefreshCw className="w-5 h-5" />
          </button>

          {snapshot ? (
            <button
              onClick={() => setSnapshot(null)}
              className="px-6 py-2.5 bg-red-700 hover:bg-red-600 text-white font-mono text-xs font-bold uppercase rounded-full shadow-[0_0_15px_rgba(220,38,38,0.5)] transition-all"
            >
              Retake Scan
            </button>
          ) : (
            <button
              onClick={takePhoto}
              className="w-14 h-14 rounded-full border-4 border-red-500 bg-red-600 hover:bg-red-500 flex items-center justify-center text-white shadow-[0_0_20px_rgba(255,23,68,0.7)] transition-transform active:scale-95"
            >
              <div className="w-6 h-6 rounded-full bg-white/90" />
            </button>
          )}

          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors border border-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ================= PHONE CALL MODAL =================
interface CallModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetContact: string;
}

export const CallModal: React.FC<CallModalProps> = ({ isOpen, onClose, targetContact }) => {
  const [seconds, setSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);

  useEffect(() => {
    if (!isOpen) {
      setSeconds(0);
      return;
    }
    const interval = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-sm bg-[#0e090c] border-2 border-red-700/80 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(220,38,38,0.5)] flex flex-col p-6 text-center">
        {/* Contact Avatar */}
        <div className="mx-auto mt-4 relative w-24 h-24 rounded-full bg-gradient-to-br from-red-600 to-red-950 border-2 border-red-500/80 flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.4)]">
          <Phone className="w-10 h-10 text-white animate-pulse" />
        </div>

        <h3 className="mt-4 text-xl font-bold font-mono tracking-wider text-red-100">
          {targetContact || 'Mom'}
        </h3>
        <p className="text-xs font-mono text-red-400 mt-1">CONNECTED • {formatTimer(seconds)}</p>
        <p className="text-[11px] text-zinc-500 mt-0.5">Encrypted Cellular Carrier Relay</p>

        {/* Audio Waveform Animation */}
        <div className="flex items-center justify-center gap-1.5 h-12 my-6">
          {[40, 75, 55, 90, 60, 80, 45, 95, 70, 50].map((h, i) => (
            <div
              key={i}
              className="w-1.5 bg-red-600 rounded-full animate-pulse"
              style={{
                height: `${(h * (seconds % 2 === 0 ? 0.9 : 0.6))}px`,
                animationDelay: `${i * 100}ms`,
              }}
            />
          ))}
        </div>

        {/* Actions grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-3 rounded-2xl flex flex-col items-center justify-center font-mono text-xs transition-colors border ${
              isMuted
                ? 'bg-red-950/80 text-red-300 border-red-700'
                : 'bg-zinc-900/80 text-zinc-300 border-zinc-800 hover:bg-zinc-800'
            }`}
          >
            {isMuted ? <MicOff className="w-5 h-5 mb-1 text-red-400" /> : <Mic className="w-5 h-5 mb-1" />}
            <span>{isMuted ? 'Unmute' : 'Mute'}</span>
          </button>

          <button
            onClick={() => setIsSpeaker(!isSpeaker)}
            className={`p-3 rounded-2xl flex flex-col items-center justify-center font-mono text-xs transition-colors border ${
              isSpeaker
                ? 'bg-red-950/80 text-red-300 border-red-700'
                : 'bg-zinc-900/80 text-zinc-300 border-zinc-800 hover:bg-zinc-800'
            }`}
          >
            <Volume2 className="w-5 h-5 mb-1 text-red-400" />
            <span>Speaker</span>
          </button>
        </div>

        {/* Native dial fallback link */}
        <a
          href={targetContact.toLowerCase().includes('mom') ? 'tel:+15550199' : `tel:${targetContact}`}
          className="text-xs text-red-400 hover:text-red-300 flex items-center justify-center gap-1.5 mb-6 underline font-mono"
        >
          <span>Launch Android Native Dialer</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        {/* End Call Button */}
        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-mono font-bold tracking-widest uppercase flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(239,68,68,0.6)] transition-all active:scale-95 cursor-pointer"
        >
          <PhoneOff className="w-5 h-5" />
          <span>Terminate Call</span>
        </button>
      </div>
    </div>
  );
};

// ================= CYBERNETIC CALCULATOR MODAL =================
interface CalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CalculatorModal: React.FC<CalculatorModalProps> = ({ isOpen, onClose }) => {
  const [display, setDisplay] = useState('0');

  if (!isOpen) return null;

  const handleBtn = (val: string) => {
    if (val === 'C') {
      setDisplay('0');
    } else if (val === '=') {
      try {
        // Safe evaluation of mathematical characters
        const sanitized = display.replace(/×/g, '*').replace(/÷/g, '/');
        // eslint-disable-next-line no-eval
        const result = Function(`'use strict'; return (${sanitized})`)();
        setDisplay(String(result));
      } catch {
        setDisplay('ERR');
      }
    } else {
      setDisplay(prev => (prev === '0' || prev === 'ERR' ? val : prev + val));
    }
  };

  const buttons = [
    ['C', '(', ')', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '%', '='],
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-xs bg-[#0c0d12] border-2 border-red-700/80 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(220,38,38,0.4)] flex flex-col font-mono">
        <div className="flex items-center justify-between px-4 py-3 bg-[#16080b] border-b border-red-900/60 text-xs text-red-400">
          <div className="flex items-center gap-2">
            <CalcIcon className="w-4 h-4 text-red-500" />
            <span className="font-bold tracking-wider">QUANTUM CALCULATOR</span>
          </div>
          <button onClick={onClose} className="text-red-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 bg-black/70 border-b border-red-950 text-right">
          <div className="text-zinc-500 text-[10px]">REGISTER [A0]</div>
          <div className="text-2xl font-bold text-red-100 tracking-wider truncate py-2">
            {display}
          </div>
        </div>

        <div className="p-3 grid grid-cols-4 gap-2 bg-[#0a0a0f]">
          {buttons.flat().map((btn, idx) => (
            <button
              key={idx}
              onClick={() => handleBtn(btn)}
              className={`p-3 rounded-xl font-bold text-sm transition-all active:scale-95 ${
                btn === '='
                  ? 'bg-red-600 hover:bg-red-500 text-white col-span-1 shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                  : btn === 'C'
                  ? 'bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800/50'
                  : ['÷', '×', '-', '+'].includes(btn)
                  ? 'bg-zinc-900 hover:bg-zinc-800 text-red-400 border border-red-950'
                  : 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 border border-zinc-800'
              }`}
            >
              {btn}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
