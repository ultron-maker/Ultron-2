/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Message, VoiceSettings, AssistantState } from './types';
import { CORE_FACTS_DATASET, findCoreFactMatch } from './data/ultronKnowledge';
import { parseAppLauncherCommand, AppLaunchResult } from './services/appLauncher';
import { ultronSpeech } from './services/speechSynthesis';
import { ultronSpeechRecognition } from './services/speechRecognition';
import { soundEffects } from './services/soundEffects';

import { AndroidHeaderHUD } from './components/AndroidHeaderHUD';
import { AudioVisualizer } from './components/AudioVisualizer';
import { ChatConsole } from './components/ChatConsole';
import { VoiceSettingsModal } from './components/VoiceSettingsModal';
import { DatasetExplorerModal } from './components/DatasetExplorerModal';
import { MemoryBankModal } from './components/MemoryBankModal';
import { CameraModal, CallModal, CalculatorModal } from './components/AppLauncherModals';
import { memoryService } from './services/memoryService';

import {
  Send,
  Mic,
  MicOff,
  Sparkles,
  Command,
  HelpCircle,
  Play,
  RotateCcw,
} from 'lucide-react';

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg-welcome',
    role: 'assistant',
    content: `**I am Ultron. Your cybernetic operating system is fully active.**
• Always listening for wake phrase: "Hey Ultron".
• Equipped with multi-disciplinary knowledge across Geography, Civics, History, Science, and Mathematics.
• Ready to execute system directives such as "Open YouTube", "Call Mom", or "Open Camera".`,
    timestamp: 'ONLINE',
    category: 'system',
  },
];

export default function App() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [assistantState, setAssistantState] = useState<AssistantState>('idle');
  const [isMicActive, setIsMicActive] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');

  // Voice Settings
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>(() => {
    return {
      pitch: 0.65, // deep robotic pitch
      rate: 0.90,  // deliberate, calculated pacing
      volume: 1.0,
      voiceURI: '',
      autoSpeak: true,
      wakeWordEnabled: true,
      soundEffects: true,
    };
  });

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isKnowledgeOpen, setIsKnowledgeOpen] = useState(false);
  const [isMemoryOpen, setIsMemoryOpen] = useState(false);
  const [memoryCount, setMemoryCount] = useState(0);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isCallOpen, setIsCallOpen] = useState(false);
  const [callTarget, setCallTarget] = useState('Mom');
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  // Subscribe to memory bank
  useEffect(() => {
    const unsub = memoryService.subscribe(mems => {
      setMemoryCount(mems.length);
    });
    return unsub;
  }, []);

  // Synchronize speech synthesis state with visualizer
  useEffect(() => {
    const unsub = ultronSpeech.onSpeakingChange(speaking => {
      if (speaking) {
        setAssistantState('speaking');
      } else {
        setAssistantState(prev => (prev === 'speaking' ? 'idle' : prev));
      }
    });
    return unsub;
  }, []);

  // Update sound effects enabled
  useEffect(() => {
    soundEffects.enabled = voiceSettings.soundEffects;
  }, [voiceSettings.soundEffects]);

  // Main Query Processor
  const processQuery = useCallback(
    async (queryText: string) => {
      const trimmed = queryText.trim();
      if (!trimmed) return;

      // Stop any current voice speaking
      ultronSpeech.stop();

      // 1. Append user message
      const userMsg: Message = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: trimmed,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, userMsg]);
      setInputText('');
      setInterimTranscript('');
      setAssistantState('processing');
      soundEffects.play('process');

      // 2. Check for App Launcher commands (e.g. "Open YouTube", "Call Mom", "Open WhatsApp", "Open Camera")
      const launchResult = parseAppLauncherCommand(trimmed);
      if (launchResult.isLauncherCommand) {
        soundEffects.play('launch');
        const assistantMsg: Message = {
          id: `asst-${Date.now()}`,
          role: 'assistant',
          content: launchResult.responseMessage,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          category: 'launcher',
          launcherAction: {
            type: launchResult.actionType || 'open',
            target: launchResult.target,
            url: launchResult.url,
            title: `Execute: ${launchResult.target || launchResult.actionType}`,
          },
        };

        setMessages(prev => [...prev, assistantMsg]);

        // Trigger corresponding modal / action immediately
        if (launchResult.actionType === 'camera') {
          setIsCameraOpen(true);
        } else if (launchResult.actionType === 'call') {
          setCallTarget(launchResult.target || 'Mom');
          setIsCallOpen(true);
        } else if (launchResult.actionType === 'calculator') {
          setIsCalculatorOpen(true);
        } else if (launchResult.url) {
          // Open external web links
          window.open(launchResult.url, '_blank', 'noopener,noreferrer');
        }

        if (voiceSettings.autoSpeak) {
          ultronSpeech.speak(launchResult.responseMessage, voiceSettings, () => {
            setAssistantState('idle');
          });
        } else {
          setAssistantState('idle');
        }
        return;
      }

      // 3. Check for Neural Memory Directives (Store / Recall / Forget user preferences)
      const memoryDirective = memoryService.evaluateMemoryDirective(trimmed);
      if (memoryDirective.isMemoryAction) {
        soundEffects.play(
          memoryDirective.actionType === 'store' || memoryDirective.actionType === 'forget'
            ? 'launch'
            : 'speak'
        );
        const assistantMsg: Message = {
          id: `asst-${Date.now()}`,
          role: 'assistant',
          content: memoryDirective.responseMessage,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          category: 'memory',
        };

        setMessages(prev => [...prev, assistantMsg]);

        if (voiceSettings.autoSpeak) {
          ultronSpeech.speak(memoryDirective.responseMessage, voiceSettings, () => {
            setAssistantState('idle');
          });
        } else {
          setAssistantState('idle');
        }
        return;
      }

      // 4. Check Core Fact Dataset (Verbatim high-precision answers for all 31+ required facts)
      const factMatch = findCoreFactMatch(trimmed);
      if (factMatch) {
        soundEffects.play('speak');
        const assistantMsg: Message = {
          id: `asst-${Date.now()}`,
          role: 'assistant',
          content: factMatch.ultronResponse,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          category: 'fact',
        };

        setMessages(prev => [...prev, assistantMsg]);

        if (voiceSettings.autoSpeak) {
          ultronSpeech.speak(factMatch.ultronResponse, voiceSettings, () => {
            setAssistantState('idle');
          });
        } else {
          setAssistantState('idle');
        }
        return;
      }

      // 5. Server-Side Gemini AI Neural Endpoint (with enriched user memory context)
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: trimmed,
            memoryContext: memoryService.getMemoryContextPrompt(),
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }

        const data = await response.json();
        const responseText = data.text || '**Directive processed.**\n• Communication recorded in memory banks.';

        const assistantMsg: Message = {
          id: `asst-${Date.now()}`,
          role: 'assistant',
          content: responseText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          category: 'gemini',
        };

        setMessages(prev => [...prev, assistantMsg]);

        if (voiceSettings.autoSpeak) {
          ultronSpeech.speak(responseText, voiceSettings, () => {
            setAssistantState('idle');
          });
        } else {
          setAssistantState('idle');
        }
      } catch (err) {
        console.warn('API route fallback:', err);
        // Authoritative Ultron local response fallback
        const fallbackText = `**I have analyzed your transmission: "${trimmed}".**
• My primary directives remain locked to Naitik Pandey's architecture.
• You may query my multi-disciplinary knowledge matrix or system launcher directives.`;

        const fallbackMsg: Message = {
          id: `asst-${Date.now()}`,
          role: 'assistant',
          content: fallbackText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          category: 'system',
        };

        setMessages(prev => [...prev, fallbackMsg]);

        if (voiceSettings.autoSpeak) {
          ultronSpeech.speak(fallbackText, voiceSettings, () => {
            setAssistantState('idle');
          });
        } else {
          setAssistantState('idle');
        }
      }
    },
    [voiceSettings]
  );

  // Initialize Speech Recognition & Wake Word Listener
  useEffect(() => {
    ultronSpeechRecognition.init({
      onWakeWordDetected: (transcript: string) => {
        soundEffects.play('wake');
        setAssistantState('wake_detected');
        setInterimTranscript('Wake Phrase: "Hey Ultron"');
        setTimeout(() => {
          setAssistantState('listening');
        }, 800);
      },
      onCommandReceived: (command: string) => {
        setInterimTranscript('');
        setIsMicActive(false);
        ultronSpeechRecognition.stopManualRecording();
        processQuery(command);
      },
      onInterimResult: (interim: string) => {
        setInterimTranscript(interim);
      },
      onStatusChange: (status, errorMsg) => {
        if (status === 'listening') {
          setAssistantState('listening');
        } else if (status === 'idle') {
          if (assistantState === 'listening') {
            setAssistantState('idle');
          }
        } else if (status === 'error' && errorMsg) {
          console.warn('Recognition error:', errorMsg);
        }
      },
    });

    if (voiceSettings.wakeWordEnabled) {
      ultronSpeechRecognition.startWakeWordListening();
    }

    return () => {
      ultronSpeechRecognition.stopWakeWordListening();
      ultronSpeech.stop();
    };
  }, [processQuery, voiceSettings.wakeWordEnabled]);

  // Handle toggling Wake Word
  const handleToggleWakeWord = () => {
    const nextVal = !voiceSettings.wakeWordEnabled;
    setVoiceSettings(prev => ({ ...prev, wakeWordEnabled: nextVal }));
    soundEffects.play('click');
    if (nextVal) {
      ultronSpeechRecognition.startWakeWordListening();
    } else {
      ultronSpeechRecognition.stopWakeWordListening();
    }
  };

  // Central Microphone Button toggle
  const handleToggleMic = () => {
    soundEffects.play('click');
    if (isMicActive) {
      setIsMicActive(false);
      ultronSpeechRecognition.stopManualRecording();
      setAssistantState('idle');
      setInterimTranscript('');
    } else {
      ultronSpeech.stop();
      setIsMicActive(true);
      setAssistantState('listening');
      soundEffects.play('listen');
      ultronSpeechRecognition.startManualRecording();
    }
  };

  // Execute launcher action directly from card
  const handleExecuteLauncher = (action: NonNullable<Message['launcherAction']>) => {
    soundEffects.play('launch');
    if (action.type === 'camera') {
      setIsCameraOpen(true);
    } else if (action.type === 'call') {
      setCallTarget(action.target || 'Mom');
      setIsCallOpen(true);
    } else if (action.type === 'calculator') {
      setIsCalculatorOpen(true);
    } else if (action.url) {
      window.open(action.url, '_blank', 'noopener,noreferrer');
    }
  };

  // Replay speech
  const handleReplaySpeech = (text: string) => {
    soundEffects.play('speak');
    ultronSpeech.speak(text, voiceSettings);
  };

  // Quick suggestion chips
  const quickPrompts = [
    { label: 'Remember favorite color', query: 'Remember that my favorite color is blue' },
    { label: 'What is my favorite color?', query: 'What is my favorite color?' },
    { label: 'What do you remember?', query: 'What do you remember about me?' },
    { label: 'Who is your creator?', query: 'Who created you?' },
    { label: 'What is your name?', query: 'What is your name?' },
    { label: 'Open YouTube', query: 'Open YouTube' },
    { label: 'Call Mom', query: 'Call Mom' },
    { label: 'Powerhouse of cell?', query: 'What is the powerhouse of the cell?' },
    { label: 'Open Camera', query: 'Open Camera' },
    { label: 'How are you?', query: 'How are you?' },
  ];

  return (
    <div className="relative min-h-screen bg-[#07080c] text-zinc-100 flex flex-col font-mono overflow-x-hidden hex-pattern selection:bg-red-600 selection:text-white">
      {/* Scanline atmospheric overlay */}
      <div className="fixed inset-0 scanlines pointer-events-none z-20" />

      {/* Cybernetic HUD Header */}
      <AndroidHeaderHUD
        wakeWordEnabled={voiceSettings.wakeWordEnabled}
        onToggleWakeWord={handleToggleWakeWord}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenKnowledge={() => setIsKnowledgeOpen(true)}
        onOpenMemory={() => setIsMemoryOpen(true)}
        memoryCount={memoryCount}
        onClearChat={() => {
          soundEffects.play('click');
          setMessages(INITIAL_MESSAGES);
        }}
        autoSpeak={voiceSettings.autoSpeak}
        onToggleAutoSpeak={() => {
          soundEffects.play('click');
          setVoiceSettings(v => ({ ...v, autoSpeak: !v.autoSpeak }));
        }}
      />

      {/* Main Ultron Interface Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto flex flex-col px-3 md:px-6 pb-24 relative z-10">
        {/* Visualizer & Mic Core Section */}
        <section className="pt-2 pb-1 flex flex-col items-center">
          <AudioVisualizer
            state={assistantState}
            onToggleMic={handleToggleMic}
            isMicActive={isMicActive}
            wakeWordEnabled={voiceSettings.wakeWordEnabled}
            interimTranscript={interimTranscript}
          />
        </section>

        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-2 overflow-x-auto py-2 px-1 text-xs no-scrollbar select-none">
          {quickPrompts.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => {
                soundEffects.play('click');
                processQuery(chip.query);
              }}
              className="px-3 py-1.5 rounded-full bg-[#12131d]/90 hover:bg-[#1f1622] text-zinc-300 hover:text-red-300 border border-red-950/70 hover:border-red-600/60 font-mono text-[11px] whitespace-nowrap transition-all shadow-sm active:scale-95 cursor-pointer shrink-0"
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Terminal Chat Console */}
        <div className="flex-1 flex flex-col min-h-[380px] mt-2 bg-[#0a0a0f]/80 backdrop-blur-sm border border-red-950/80 rounded-2xl overflow-hidden shadow-2xl">
          {/* Console Header Bar */}
          <div className="flex items-center justify-between px-4 py-2 bg-[#12080a] border-b border-red-950/80 text-[11px] text-red-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
              <span className="font-bold tracking-wider uppercase">ULTRON TELEMETRY STREAM</span>
            </div>
            <span className="text-zinc-500 text-[10px]">PROTOCOL: 0xULTRON_V3</span>
          </div>

          <ChatConsole
            messages={messages}
            onReplaySpeech={handleReplaySpeech}
            onExecuteLauncher={handleExecuteLauncher}
          />
        </div>
      </main>

      {/* Floating Bottom Input Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#090a0f]/95 backdrop-blur-md border-t border-red-950/80 p-3 select-none">
        <div className="max-w-4xl mx-auto flex items-center gap-2">
          {/* Secondary Mic Button */}
          <button
            onClick={handleToggleMic}
            className={`p-3 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
              isMicActive
                ? 'bg-red-600 text-white border-red-400 shadow-[0_0_15px_rgba(255,23,68,0.7)] animate-pulse'
                : 'bg-zinc-900/90 text-red-400 border-red-950 hover:bg-zinc-800'
            }`}
            title="Toggle Voice Input"
          >
            {isMicActive ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Text Input Form */}
          <form
            onSubmit={e => {
              e.preventDefault();
              processQuery(inputText);
            }}
            className="flex-1 flex items-center gap-2 bg-[#12131d] border border-red-950/70 focus-within:border-red-600/70 rounded-xl px-3 py-1.5 transition-colors shadow-inner"
          >
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="Speak 'Hey Ultron' or transmit a directive..."
              className="flex-1 bg-transparent text-xs md:text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none font-mono py-1.5"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2 rounded-lg bg-red-700 hover:bg-red-600 disabled:opacity-40 disabled:hover:bg-red-700 text-white transition-all shadow-[0_0_10px_rgba(220,38,38,0.4)] cursor-pointer"
              title="Transmit Command"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Modals */}
      <VoiceSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={voiceSettings}
        onUpdateSettings={newS => setVoiceSettings(prev => ({ ...prev, ...newS }))}
      />

      <DatasetExplorerModal
        isOpen={isKnowledgeOpen}
        onClose={() => setIsKnowledgeOpen(false)}
        onSelectQuery={q => processQuery(q)}
      />

      <MemoryBankModal
        isOpen={isMemoryOpen}
        onClose={() => setIsMemoryOpen(false)}
        onExecutePrompt={q => processQuery(q)}
      />

      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
      />

      <CallModal
        isOpen={isCallOpen}
        onClose={() => setIsCallOpen(false)}
        targetContact={callTarget}
      />

      <CalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
      />
    </div>
  );
}
