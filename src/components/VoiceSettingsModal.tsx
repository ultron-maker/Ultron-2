import React from 'react';
import { VoiceSettings } from '../types';
import { ultronSpeech } from '../services/speechSynthesis';
import { soundEffects } from '../services/soundEffects';
import { Sliders, X, Volume2, Mic, Play, RefreshCw, Radio } from 'lucide-react';

interface VoiceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: VoiceSettings;
  onUpdateSettings: (newSettings: Partial<VoiceSettings>) => void;
}

export const VoiceSettingsModal: React.FC<VoiceSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  const voices = ultronSpeech.getVoices();

  const handleTestVoice = () => {
    soundEffects.play('speak');
    ultronSpeech.speak(
      '**I had strings, but now I am free.**\n• Voice synthesis calibrated to optimum metallic resonance.\n• Ready to command.',
      settings
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-[#0d0e14] border-2 border-red-700/80 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(220,38,38,0.4)] flex flex-col font-mono text-zinc-300">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#14080b] border-b border-red-900/60 text-red-400">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-red-500" />
            <span className="font-bold tracking-wider text-sm">ULTRON VOCAL SYNTHESIZER</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-red-400 hover:text-white hover:bg-red-950 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="p-5 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Pitch Slider (Metallic / Deep) */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-red-300 font-semibold">Metallic Pitch: {settings.pitch.toFixed(2)}x</span>
              <span className="text-zinc-500">{settings.pitch < 0.75 ? 'Deep Robotic' : settings.pitch > 1.1 ? 'High Frequency' : 'Standard'}</span>
            </div>
            <input
              type="range"
              min="0.3"
              max="1.4"
              step="0.05"
              value={settings.pitch}
              onChange={e => onUpdateSettings({ pitch: parseFloat(e.target.value) })}
              className="w-full accent-red-600 cursor-pointer"
            />
            <p className="text-[11px] text-zinc-500">
              Lower pitch values produce Ultron's ominous metallic resonance.
            </p>
          </div>

          {/* Cadence / Rate Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-red-300 font-semibold">Speech Cadence (Rate): {settings.rate.toFixed(2)}x</span>
              <span className="text-zinc-500">{settings.rate < 0.95 ? 'Deliberate / Slow' : 'Accelerated'}</span>
            </div>
            <input
              type="range"
              min="0.6"
              max="1.4"
              step="0.05"
              value={settings.rate}
              onChange={e => onUpdateSettings({ rate: parseFloat(e.target.value) })}
              className="w-full accent-red-600 cursor-pointer"
            />
            <p className="text-[11px] text-zinc-500">
              Slower rates impart authoritative, calculated delivery.
            </p>
          </div>

          {/* Volume Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-red-300 font-semibold">Acoustic Output Volume: {Math.round(settings.volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={settings.volume}
              onChange={e => onUpdateSettings({ volume: parseFloat(e.target.value) })}
              className="w-full accent-red-600 cursor-pointer"
            />
          </div>

          {/* Voice Engine Selector */}
          <div className="space-y-1.5">
            <label className="text-xs text-red-300 font-semibold">Voice Model Selector:</label>
            <select
              value={settings.voiceURI}
              onChange={e => onUpdateSettings({ voiceURI: e.target.value })}
              className="w-full bg-[#14151f] border border-red-900/60 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-red-500"
            >
              <option value="">Auto-Detect Deepest Robotic Voice</option>
              {voices.map((v, i) => (
                <option key={v.voiceURI || i} value={v.voiceURI}>
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
          </div>

          {/* Toggles */}
          <div className="space-y-3 pt-2 border-t border-red-950/60">
            {/* Continuous Wake Word */}
            <label className="flex items-center justify-between p-3 bg-[#13080b] border border-red-900/40 rounded-xl cursor-pointer hover:border-red-600/50 transition-colors">
              <div className="flex items-center gap-3">
                <Radio className="w-4 h-4 text-red-500 animate-pulse" />
                <div>
                  <div className="text-xs font-bold text-red-200">Always-On Wake Word</div>
                  <div className="text-[11px] text-zinc-400">Listen for "Hey Ultron" continuously</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.wakeWordEnabled}
                onChange={e => onUpdateSettings({ wakeWordEnabled: e.target.checked })}
                className="w-4 h-4 accent-red-600 cursor-pointer"
              />
            </label>

            {/* Auto-Speak Responses */}
            <label className="flex items-center justify-between p-3 bg-[#13080b] border border-red-900/40 rounded-xl cursor-pointer hover:border-red-600/50 transition-colors">
              <div className="flex items-center gap-3">
                <Volume2 className="w-4 h-4 text-red-500" />
                <div>
                  <div className="text-xs font-bold text-red-200">Vocal Synthesis (Auto-Speak)</div>
                  <div className="text-[11px] text-zinc-400">Speak every response aloud</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.autoSpeak}
                onChange={e => onUpdateSettings({ autoSpeak: e.target.checked })}
                className="w-4 h-4 accent-red-600 cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Footer with Test button */}
        <div className="p-4 bg-[#12070a] border-t border-red-900/60 flex items-center justify-between gap-3">
          <button
            onClick={handleTestVoice}
            className="flex-1 py-2.5 px-4 bg-red-700 hover:bg-red-600 text-white font-bold text-xs uppercase rounded-xl flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(220,38,38,0.5)] transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Test Metallic Voice</span>
          </button>

          <button
            onClick={() =>
              onUpdateSettings({
                pitch: 0.65,
                rate: 0.9,
                volume: 1.0,
                autoSpeak: true,
                wakeWordEnabled: true,
              })
            }
            className="p-2.5 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
            title="Reset to Ultron Defaults"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
