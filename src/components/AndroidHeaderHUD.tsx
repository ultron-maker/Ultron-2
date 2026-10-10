import React, { useState, useEffect } from 'react';
import {
  Wifi,
  Battery,
  Sliders,
  Database,
  Trash2,
  Radio,
  Volume2,
  VolumeX,
  Brain,
} from 'lucide-react';

interface AndroidHeaderHUDProps {
  wakeWordEnabled: boolean;
  onToggleWakeWord: () => void;
  onOpenSettings: () => void;
  onOpenKnowledge: () => void;
  onOpenMemory: () => void;
  onClearChat: () => void;
  autoSpeak: boolean;
  onToggleAutoSpeak: () => void;
  memoryCount: number;
}

export const AndroidHeaderHUD: React.FC<AndroidHeaderHUDProps> = ({
  wakeWordEnabled,
  onToggleWakeWord,
  onOpenSettings,
  onOpenKnowledge,
  onOpenMemory,
  onClearChat,
  autoSpeak,
  onToggleAutoSpeak,
  memoryCount,
}) => {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-[#09090e]/90 backdrop-blur-md border-b border-red-950/80 font-mono select-none">
      {/* Android Top Status Strip */}
      <div className="flex items-center justify-between px-4 py-1 text-[11px] text-zinc-400 border-b border-white/[0.04]">
        <div className="flex items-center gap-2">
          <span className="font-bold text-zinc-300">{currentTime || '12:00 PM'}</span>
          <span className="text-zinc-600">•</span>
          <span className="text-[10px] text-red-500 font-bold tracking-wider">ULTRON OS 5G</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-zinc-500">NET</span>
            <Wifi className="w-3.5 h-3.5 text-zinc-300" />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-zinc-500">BAT 99%</span>
            <Battery className="w-4 h-4 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Ultron HUD Command Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5">
        <div className="flex items-center gap-2.5">
          {/* Crimson Glowing Core Logo */}
          <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-red-950 border border-red-500/80 flex items-center justify-center shadow-[0_0_12px_rgba(239,68,68,0.5)]">
            <div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_6px_#fff]" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-red-100 tracking-wider flex items-center gap-1.5">
              <span>ULTRON</span>
              <span className="text-[9px] px-1 py-0.2 bg-red-950 border border-red-800 text-red-400 rounded">
                AI
              </span>
            </h1>
            <p className="text-[10px] text-zinc-400">
              CYBERNETIC VOICE PROTOCOL
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {/* Wake Word Badge Button */}
          <button
            onClick={onToggleWakeWord}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5 border transition-all cursor-pointer ${
              wakeWordEnabled
                ? 'bg-red-950/80 text-red-200 border-red-600/80 shadow-[0_0_10px_rgba(220,38,38,0.3)]'
                : 'bg-zinc-900/80 text-zinc-500 border-zinc-800 hover:text-zinc-300'
            }`}
            title="Toggle Continuous 'Hey Ultron' Wake Word Detection"
          >
            <Radio className={`w-3 h-3 ${wakeWordEnabled ? 'text-red-500 animate-pulse' : 'text-zinc-600'}`} />
            <span className="hidden sm:inline">WAKE WORD:</span>
            <span>{wakeWordEnabled ? 'ARMED' : 'OFF'}</span>
          </button>

          {/* Auto-Speak Toggle */}
          <button
            onClick={onToggleAutoSpeak}
            className={`p-1.5 rounded-lg border transition-colors ${
              autoSpeak
                ? 'bg-red-950/80 text-red-300 border-red-800'
                : 'bg-zinc-900 text-zinc-500 border-zinc-800'
            }`}
            title={autoSpeak ? 'Mute Voice Synthesis' : 'Enable Voice Synthesis'}
          >
            {autoSpeak ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Knowledge Matrix */}
          <button
            onClick={onOpenKnowledge}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-red-300 border border-zinc-800 transition-colors cursor-pointer"
            title="Open Core Knowledge Matrix"
          >
            <Database className="w-4 h-4" />
          </button>

          {/* Neural Memory Bank Button */}
          <button
            onClick={onOpenMemory}
            className="relative p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-red-300 border border-zinc-800 transition-colors cursor-pointer"
            title="Open Neural Memory Bank (User Preferences & Facts)"
          >
            <Brain className="w-4 h-4 text-red-400" />
            {memoryCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center border border-black shadow-sm">
                {memoryCount}
              </span>
            )}
          </button>

          {/* Voice Settings */}
          <button
            onClick={onOpenSettings}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-red-300 border border-zinc-800 transition-colors"
            title="Configure Metallic Voice Settings"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* Clear Console */}
          <button
            onClick={onClearChat}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-red-400 border border-zinc-800 transition-colors"
            title="Clear Chat Console"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
