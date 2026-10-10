import React, { useEffect, useRef } from 'react';
import { Message } from '../types';
import {
  Volume2,
  Copy,
  Check,
  ExternalLink,
  Phone,
  Camera,
  Youtube,
  MessageSquare,
  Compass,
  Music,
  Terminal,
  Cpu,
  Bot,
  User,
} from 'lucide-react';

interface ChatConsoleProps {
  messages: Message[];
  onReplaySpeech: (text: string) => void;
  onExecuteLauncher: (action: NonNullable<Message['launcherAction']>) => void;
}

export const ChatConsole: React.FC<ChatConsoleProps> = ({
  messages,
  onReplaySpeech,
  onExecuteLauncher,
}) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const renderContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={idx} className="h-1.5" />;

      // Bold core statement: starts and ends with **
      if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
        const text = trimmed.slice(2, -2);
        return (
          <div
            key={idx}
            className="font-bold text-red-200 text-[13px] md:text-sm tracking-wide mb-1.5 font-sans leading-snug drop-shadow-[0_0_8px_rgba(239,68,68,0.3)]"
          >
            {text}
          </div>
        );
      }

      // Bullet points
      if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*')) {
        const bulletText = trimmed.replace(/^[•\-*]\s*/, '');
        return (
          <div key={idx} className="flex items-start gap-2 text-zinc-300 text-xs md:text-[13px] my-1 leading-relaxed pl-1">
            <span className="text-red-500 font-bold shrink-0 mt-0.5">•</span>
            <span className="font-sans">{bulletText}</span>
          </div>
        );
      }

      return (
        <p key={idx} className="text-zinc-300 text-xs md:text-[13px] my-1 leading-relaxed font-sans">
          {trimmed}
        </p>
      );
    });
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'youtube':
        return <Youtube className="w-4 h-4 text-red-500" />;
      case 'call':
        return <Phone className="w-4 h-4 text-green-500" />;
      case 'whatsapp':
        return <MessageSquare className="w-4 h-4 text-emerald-500" />;
      case 'camera':
        return <Camera className="w-4 h-4 text-cyan-400" />;
      case 'maps':
        return <Compass className="w-4 h-4 text-amber-400" />;
      case 'spotify':
        return <Music className="w-4 h-4 text-green-400" />;
      default:
        return <ExternalLink className="w-4 h-4 text-red-400" />;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 font-mono select-text">
      {messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-red-950/40 border border-red-700/50 flex items-center justify-center shadow-[0_0_25px_rgba(239,68,68,0.25)]">
            <Bot className="w-8 h-8 text-red-500 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-red-300 tracking-wider">
              ULTRON NEURAL CONSOLE ARMED
            </h3>
            <p className="text-xs text-zinc-400 max-w-sm">
              Continuous wake-word monitoring active. Speak <span className="text-red-400 font-bold">"Hey Ultron"</span> or tap the crimson core to transmit directives.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-zinc-400 max-w-lg w-full">
            <div className="p-2 bg-[#12131b] border border-red-950/60 rounded-lg text-left">
              <span className="text-red-400 font-bold block mb-0.5">[VOICE COMMANDS]</span>
              "Hey Ultron, call Mom"<br />
              "Hey Ultron, open YouTube"
            </div>
            <div className="p-2 bg-[#12131b] border border-red-950/60 rounded-lg text-left">
              <span className="text-red-400 font-bold block mb-0.5">[MEMORY BANK]</span>
              "My favorite color is blue"<br />
              "What is my favorite color?"
            </div>
            <div className="p-2 bg-[#12131b] border border-red-950/60 rounded-lg text-left col-span-2 sm:col-span-1">
              <span className="text-red-400 font-bold block mb-0.5">[KNOWLEDGE]</span>
              "Who created you?"<br />
              "Powerhouse of the cell?"
            </div>
          </div>
        </div>
      ) : (
        messages.map(msg => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.role === 'user' ? 'items-end' : 'items-start'
            } transition-all duration-300`}
          >
            {/* Header timestamp & role label */}
            <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 mb-1 px-1">
              {msg.role === 'user' ? (
                <>
                  <span>OPERATOR</span>
                  <User className="w-3 h-3 text-zinc-400" />
                  <span>• {msg.timestamp}</span>
                </>
              ) : (
                <>
                  <Cpu className="w-3 h-3 text-red-500" />
                  <span className="font-bold text-red-400">ULTRON CORE</span>
                  {msg.category && (
                    <span
                      className={`text-[9px] px-1 py-0.2 border rounded uppercase font-bold ${
                        msg.category === 'memory'
                          ? 'bg-purple-950/80 border-purple-700/60 text-purple-300 shadow-[0_0_8px_rgba(168,85,247,0.3)]'
                          : 'bg-red-950/80 border-red-800/40 text-red-300'
                      }`}
                    >
                      {msg.category === 'memory' ? 'NEURAL MEMORY' : msg.category}
                    </span>
                  )}
                  <span>• {msg.timestamp}</span>
                </>
              )}
            </div>

            {/* Message Card */}
            <div
              className={`relative max-w-[90%] md:max-w-[80%] rounded-2xl p-4 shadow-lg transition-all ${
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-[#1b1c28] to-[#12131d] text-zinc-100 border border-zinc-700/60 rounded-tr-sm'
                  : 'bg-gradient-to-br from-[#160a0e] via-[#10080b] to-[#0a0608] text-zinc-200 border border-red-900/60 rounded-tl-sm shadow-[0_0_20px_rgba(220,38,38,0.15)]'
              }`}
            >
              {/* Corner tech accent on Ultron messages */}
              {msg.role === 'assistant' && (
                <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-red-500 pointer-events-none" />
              )}

              {/* Message Content */}
              <div className="space-y-1">{renderContent(msg.content)}</div>

              {/* App Launcher Action Card if triggered */}
              {msg.launcherAction && (
                <div className="mt-3 pt-3 border-t border-red-950/80 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-red-300">
                    {getActionIcon(msg.launcherAction.type)}
                    <span>{msg.launcherAction.title}</span>
                  </div>

                  <button
                    onClick={() => onExecuteLauncher(msg.launcherAction!)}
                    className="px-3 py-1 bg-red-700/80 hover:bg-red-600 text-white text-[11px] font-bold rounded-lg uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-[0_0_10px_rgba(220,38,38,0.4)] cursor-pointer"
                  >
                    <span>Execute Action</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* Message Footer Actions (Ultron only) */}
              {msg.role === 'assistant' && (
                <div className="mt-3 pt-2 border-t border-red-950/50 flex items-center justify-between text-[11px] text-zinc-500">
                  <span className="text-[10px] text-red-500/80">TERMINAL_OK</span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onReplaySpeech(msg.content)}
                      className="p-1 rounded text-zinc-400 hover:text-red-400 hover:bg-red-950/60 transition-colors"
                      title="Replay Metallic Voice"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="p-1 rounded text-zinc-400 hover:text-red-400 hover:bg-red-950/60 transition-colors"
                      title="Copy Output"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3.5 h-3.5 text-green-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))
      )}
      <div ref={bottomRef} />
    </div>
  );
};
