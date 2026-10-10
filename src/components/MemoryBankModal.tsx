import React, { useState, useEffect } from 'react';
import { UltronMemory } from '../types';
import { memoryService } from '../services/memoryService';
import { soundEffects } from '../services/soundEffects';
import {
  Brain,
  X,
  Trash2,
  Plus,
  RefreshCw,
  Sparkles,
  Search,
  CheckCircle2,
  Key,
} from 'lucide-react';

interface MemoryBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExecutePrompt: (prompt: string) => void;
}

export const MemoryBankModal: React.FC<MemoryBankModalProps> = ({
  isOpen,
  onClose,
  onExecutePrompt,
}) => {
  const [memories, setMemories] = useState<UltronMemory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const unsub = memoryService.subscribe(mems => {
      setMemories(mems);
    });
    return unsub;
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim() || !newValue.trim()) return;

    soundEffects.play('click');
    const statement = `Operator's ${newKey.trim()} is ${newValue.trim()}`;
    memoryService.addOrUpdateMemory(newKey.trim(), newValue.trim(), statement, 'preference');
    setNewKey('');
    setNewValue('');
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    soundEffects.play('click');
    memoryService.deleteMemory(id);
  };

  const handleClear = () => {
    soundEffects.play('launch');
    memoryService.clearUserMemories();
  };

  const filteredMemories = memories.filter(
    m =>
      m.statement.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-[#0c0d13] border-2 border-red-700/80 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(220,38,38,0.4)] flex flex-col font-mono max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#14080b] border-b border-red-900/60 text-red-400">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-950/80 border border-red-700/60 flex items-center justify-center">
              <Brain className="w-4 h-4 text-red-500 animate-pulse" />
            </div>
            <div>
              <span className="font-bold tracking-wider text-sm uppercase">ULTRON LONG-TERM NEURAL MEMORY</span>
              <span className="text-[10px] text-zinc-500 ml-2">[{memories.length} RECORDS]</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-red-400 hover:text-white hover:bg-red-950 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar & Filter */}
        <div className="p-4 bg-[#0e0f17] border-b border-red-950/70 space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search stored facts (e.g. blue, color, preference)..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-[#151722] border border-red-900/40 rounded-xl pl-9 pr-3 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-red-500"
              />
            </div>

            <button
              onClick={() => setIsAdding(!isAdding)}
              className="px-3 py-1.5 bg-red-800/80 hover:bg-red-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAdding ? 'Cancel' : 'New Entry'}</span>
            </button>
          </div>

          {/* Quick Voice / Text prompts to test memory */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] pb-1 no-scrollbar">
            <span className="text-zinc-500 text-[10px] shrink-0">Try asking:</span>
            {[
              'What is my favorite color?',
              'What do you remember about me?',
              'Remember my favorite color is blue',
              'Remember that I like synthwave music',
            ].map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onExecutePrompt(p);
                  onClose();
                }}
                className="px-2.5 py-1 rounded-lg bg-[#181a24] hover:bg-red-950/80 text-zinc-300 hover:text-red-200 border border-red-950/50 text-[10px] whitespace-nowrap transition-colors shrink-0 cursor-pointer"
              >
                "{p}"
              </button>
            ))}
          </div>

          {/* Form to manually record a fact */}
          {isAdding && (
            <form onSubmit={handleAddManual} className="p-3 bg-[#13080b] border border-red-900/60 rounded-xl space-y-2 mt-2">
              <div className="text-xs font-bold text-red-300">ADD DIRECT MEMORY PARAMETER</div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Key (e.g. favorite color, pet name)"
                  value={newKey}
                  onChange={e => setNewKey(e.target.value)}
                  className="bg-[#0b0c10] border border-red-950 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-red-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Value (e.g. blue, Rex)"
                  value={newValue}
                  onChange={e => setNewValue(e.target.value)}
                  className="bg-[#0b0c10] border border-red-950 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-red-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-1.5 bg-red-700 hover:bg-red-600 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow transition-colors cursor-pointer"
              >
                Engrave in Memory Core
              </button>
            </form>
          )}
        </div>

        {/* Memory List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filteredMemories.length === 0 ? (
            <div className="p-8 text-center text-zinc-500 text-xs space-y-2">
              <p>NO NEURAL MEMORY RECORDS FOUND.</p>
              <p className="text-[11px] text-zinc-600">
                Tell Ultron: "Remember that my favorite color is crimson" or tap "New Entry" above.
              </p>
            </div>
          ) : (
            filteredMemories.map(mem => (
              <div
                key={mem.id}
                className="p-3 bg-[#12131d] border border-red-950/70 hover:border-red-800/60 rounded-xl flex items-center justify-between gap-3 transition-colors shadow-sm"
              >
                <div className="space-y-0.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="font-bold text-red-400 uppercase tracking-wider">
                      [{mem.category}]
                    </span>
                    <span className="text-zinc-500">• {mem.timestamp}</span>
                  </div>

                  <div className="text-xs font-semibold text-zinc-100 truncate">
                    {mem.statement}
                  </div>

                  <div className="text-[11px] text-zinc-400 font-mono">
                    <span className="text-zinc-500">PARAM:</span> {mem.key} ={' '}
                    <span className="text-red-300 font-bold">{mem.value}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => {
                      onExecutePrompt(`What is my ${mem.key.replace(/_/g, ' ')}?`);
                      onClose();
                    }}
                    className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 text-red-400 hover:text-red-300 rounded text-[10px] font-bold border border-red-950 transition-colors cursor-pointer"
                    title="Ask Ultron about this"
                  >
                    Test Recall
                  </button>

                  {mem.id !== 'mem-core-creator' && (
                    <button
                      onClick={() => handleDelete(mem.id)}
                      className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-950/50 rounded transition-colors cursor-pointer"
                      title="Erase Memory"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#11070a] border-t border-red-950/70 text-[11px] text-zinc-500 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Persistent Device Storage Active</span>
          </div>

          <button
            onClick={handleClear}
            className="text-[10px] text-red-400 hover:text-red-300 hover:underline cursor-pointer"
          >
            Clear User Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
