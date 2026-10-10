import React, { useEffect, useRef } from 'react';
import { AssistantState } from '../types';
import { Mic, MicOff, Volume2, Radio, Sparkles } from 'lucide-react';

interface AudioVisualizerProps {
  state: AssistantState;
  onToggleMic: () => void;
  isMicActive: boolean;
  wakeWordEnabled: boolean;
  interimTranscript: string;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  state,
  onToggleMic,
  isMicActive,
  wakeWordEnabled,
  interimTranscript,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let phase = 0;

    const render = () => {
      phase += 0.05;
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      // Determine visual intensity based on state
      const isListening = state === 'listening' || isMicActive;
      const isWake = state === 'wake_detected';
      const isSpeaking = state === 'speaking';
      const isProcessing = state === 'processing';

      // Base radius
      const baseRadius = 75;

      // 1. Draw outer cybernetic grid lines / concentric circles
      ctx.save();
      ctx.lineWidth = 1.5;

      // Outer boundary ring
      ctx.strokeStyle = isListening
        ? 'rgba(255, 23, 68, 0.7)'
        : isSpeaking
        ? 'rgba(239, 68, 68, 0.5)'
        : 'rgba(220, 38, 38, 0.2)';
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius + 42, 0, Math.PI * 2);
      ctx.stroke();

      // Dashed radar ring
      ctx.strokeStyle = isListening
        ? 'rgba(255, 50, 80, 0.5)'
        : 'rgba(185, 28, 28, 0.25)';
      ctx.setLineDash([4, 8]);
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius + 30, phase * 0.4, phase * 0.4 + Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // 2. Rotating cybernetic tick marks
      const totalTicks = 36;
      for (let i = 0; i < totalTicks; i++) {
        const angle = (i * (Math.PI * 2)) / totalTicks + (isProcessing ? phase * 0.8 : phase * 0.2);
        const tickLength = i % 3 === 0 ? 9 : 4;
        const r1 = baseRadius + 32;
        const r2 = r1 + tickLength;

        const x1 = centerX + Math.cos(angle) * r1;
        const y1 = centerY + Math.sin(angle) * r1;
        const x2 = centerX + Math.cos(angle) * r2;
        const y2 = centerY + Math.sin(angle) * r2;

        ctx.strokeStyle = isListening
          ? 'rgba(255, 30, 70, 0.7)'
          : i % 3 === 0
          ? 'rgba(239, 68, 68, 0.4)'
          : 'rgba(127, 29, 29, 0.3)';
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      // 3. Dynamic audio frequency wave bars
      const numBars = 48;
      for (let i = 0; i < numBars; i++) {
        const angle = (i * (Math.PI * 2)) / numBars;

        let barHeight = 8;
        if (isListening) {
          // Dynamic pulsing audio frequencies
          const wave1 = Math.sin(phase * 4 + i * 0.6);
          const wave2 = Math.cos(phase * 2.5 - i * 0.4);
          barHeight = 12 + Math.abs(wave1 * 18 + wave2 * 14);
        } else if (isSpeaking) {
          const wave = Math.sin(phase * 3 + i * 0.8);
          barHeight = 10 + Math.abs(wave * 20);
        } else if (isWake) {
          barHeight = 28 + Math.sin(phase * 6 + i) * 10;
        } else {
          // Idle sinister slow breathing pulse
          const breath = Math.sin(phase * 1.2 + i * 0.2);
          barHeight = 5 + Math.abs(breath * 6);
        }

        const rStart = baseRadius + 4;
        const rEnd = rStart + barHeight;

        const xStart = centerX + Math.cos(angle) * rStart;
        const yStart = centerY + Math.sin(angle) * rStart;
        const xEnd = centerX + Math.cos(angle) * rEnd;
        const yEnd = centerY + Math.sin(angle) * rEnd;

        // Glowing crimson gradient
        const barGrad = ctx.createLinearGradient(xStart, yStart, xEnd, yEnd);
        if (isListening || isWake) {
          barGrad.addColorStop(0, '#ff1744');
          barGrad.addColorStop(0.6, '#ef4444');
          barGrad.addColorStop(1, '#ff8a80');
        } else if (isSpeaking) {
          barGrad.addColorStop(0, '#dc2626');
          barGrad.addColorStop(1, '#f87171');
        } else {
          barGrad.addColorStop(0, '#7f1d1d');
          barGrad.addColorStop(1, '#ef4444');
        }

        ctx.strokeStyle = barGrad;
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(xStart, yStart);
        ctx.lineTo(xEnd, yEnd);
        ctx.stroke();
      }

      // 4. Central Reactor Core Aura
      const corePulse = Math.sin(phase * 2) * (isListening ? 12 : 5);
      const coreRadius = Math.max(10, baseRadius - 8 + corePulse);

      const radialGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        10,
        centerX,
        centerY,
        coreRadius + 15
      );

      if (isListening || isWake) {
        radialGrad.addColorStop(0, 'rgba(255, 23, 68, 0.75)');
        radialGrad.addColorStop(0.4, 'rgba(220, 38, 38, 0.45)');
        radialGrad.addColorStop(1, 'rgba(185, 28, 28, 0)');
      } else if (isSpeaking) {
        radialGrad.addColorStop(0, 'rgba(239, 68, 68, 0.6)');
        radialGrad.addColorStop(0.5, 'rgba(185, 28, 28, 0.3)');
        radialGrad.addColorStop(1, 'rgba(127, 29, 29, 0)');
      } else {
        radialGrad.addColorStop(0, 'rgba(153, 27, 27, 0.45)');
        radialGrad.addColorStop(0.5, 'rgba(127, 29, 29, 0.2)');
        radialGrad.addColorStop(1, 'rgba(10, 10, 15, 0)');
      }

      ctx.fillStyle = radialGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, coreRadius + 15, 0, Math.PI * 2);
      ctx.fill();

      // 5. Target crosshairs in center (cybernetic reticle)
      ctx.strokeStyle = isListening ? '#ff5252' : '#991b1b';
      ctx.lineWidth = 1;
      const crossSize = 14;
      ctx.beginPath();
      ctx.moveTo(centerX - crossSize, centerY);
      ctx.lineTo(centerX + crossSize, centerY);
      ctx.moveTo(centerX, centerY - crossSize);
      ctx.lineTo(centerX, centerY + crossSize);
      ctx.stroke();

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [state, isMicActive]);

  const getStateBadge = () => {
    switch (state) {
      case 'wake_detected':
        return {
          text: 'WAKE PHRASE DETECTED',
          color: 'bg-red-600 text-white animate-pulse',
          icon: <Radio className="w-3.5 h-3.5 animate-spin" />,
        };
      case 'listening':
        return {
          text: 'LISTENING FOR DIRECTIVE...',
          color: 'bg-red-500 text-white animate-pulse',
          icon: <Mic className="w-3.5 h-3.5" />,
        };
      case 'speaking':
        return {
          text: 'ULTRON TRANSMITTING...',
          color: 'bg-red-800 text-red-100',
          icon: <Volume2 className="w-3.5 h-3.5 animate-bounce" />,
        };
      case 'processing':
        return {
          text: 'PROCESSING NEURAL MATRIX...',
          color: 'bg-amber-600 text-amber-50',
          icon: <Sparkles className="w-3.5 h-3.5 animate-spin" />,
        };
      default:
        return {
          text: wakeWordEnabled ? 'STANDBY: SAY "HEY ULTRON"' : 'STANDBY: TAP TO SPEAK',
          color: 'bg-[#181a22] text-red-300 border border-red-950/70',
          icon: <Radio className="w-3.5 h-3.5 text-red-500" />,
        };
    }
  };

  const badge = getStateBadge();

  return (
    <div className="relative flex flex-col items-center justify-center py-4 select-none">
      {/* Background cybernetic grid aura */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className={`w-72 h-72 rounded-full transition-all duration-700 blur-2xl ${
            state === 'listening'
              ? 'bg-red-600/35 scale-110'
              : state === 'speaking'
              ? 'bg-red-700/25 scale-100'
              : 'bg-red-950/15 scale-90'
          }`}
        />
      </div>

      {/* Canvas Audio Visualizer Container */}
      <div className="relative w-64 h-64 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={280}
          height={280}
          className="absolute inset-0 pointer-events-none"
        />

        {/* Central Clickable Crimson Microphone Reactor Core Button */}
        <button
          onClick={onToggleMic}
          aria-label={isMicActive ? 'Stop listening' : 'Start voice input'}
          className={`relative z-10 w-24 h-24 rounded-full flex flex-col items-center justify-center transition-all duration-300 group cursor-pointer focus:outline-none ${
            isMicActive
              ? 'bg-gradient-to-br from-red-500 via-red-600 to-red-800 shadow-[0_0_35px_rgba(255,23,68,0.85)] scale-105 border-2 border-red-300'
              : state === 'speaking'
              ? 'bg-gradient-to-br from-[#24080e] via-[#3a0d16] to-[#1a060a] border border-red-600/60 shadow-[0_0_20px_rgba(220,38,38,0.4)]'
              : 'bg-gradient-to-br from-[#1c080d] via-[#120609] to-[#0a0507] border border-red-800/50 hover:border-red-500 shadow-[0_0_20px_rgba(220,38,38,0.25)] hover:shadow-[0_0_30px_rgba(239,68,68,0.5)]'
          }`}
        >
          {/* Inner metallic metallic bevel */}
          <div className="absolute inset-1.5 rounded-full border border-red-500/30 pointer-events-none" />

          {isMicActive ? (
            <Mic className="w-9 h-9 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.9)] transition-transform group-hover:scale-110" />
          ) : state === 'speaking' ? (
            <Volume2 className="w-8 h-8 text-red-400 group-hover:scale-110 transition-transform" />
          ) : (
            <Mic className="w-8 h-8 text-red-500 group-hover:text-red-400 transition-colors group-hover:scale-110" />
          )}

          <span className="text-[10px] uppercase font-bold tracking-widest mt-1 text-red-300/90 font-mono">
            {isMicActive ? 'Active' : 'Engage'}
          </span>
        </button>
      </div>

      {/* State Status Badge */}
      <div className="mt-2 flex items-center gap-2">
        <div
          className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wider flex items-center gap-2 shadow-sm uppercase font-mono ${badge.color}`}
        >
          {badge.icon}
          <span>{badge.text}</span>
        </div>
      </div>

      {/* Interim live speech transcript preview */}
      {interimTranscript && (
        <div className="mt-2 px-4 py-1.5 bg-black/60 border border-red-900/60 rounded-md text-red-300 text-xs font-mono max-w-sm text-center truncate animate-pulse shadow-inner">
          "{interimTranscript}"
        </div>
      )}
    </div>
  );
};
