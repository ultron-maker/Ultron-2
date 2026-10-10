import React, { useState } from 'react';
import { CORE_FACTS_DATASET } from '../data/ultronKnowledge';
import { CoreFact } from '../types';
import { Database, X, Search, ChevronRight, Zap, CheckCircle2 } from 'lucide-react';

interface DatasetExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectQuery: (query: string) => void;
}

export const DatasetExplorerModal: React.FC<DatasetExplorerModalProps> = ({
  isOpen,
  onClose,
  onSelectQuery,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('ALL');

  if (!isOpen) return null;

  const domains = ['ALL', 'GEOGRAPHY', 'CIVICS', 'HISTORY', 'SCIENCE', 'MATHEMATICS', 'GENERAL KNOWLEDGE', 'PERSONALITY'];

  const filteredFacts = CORE_FACTS_DATASET.filter(fact => {
    const matchesDomain = selectedDomain === 'ALL' || fact.domain === selectedDomain;
    const matchesSearch =
      searchTerm === '' ||
      fact.input.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fact.output.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fact.domain.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDomain && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-[#0c0d12] border-2 border-red-700/80 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(220,38,38,0.4)] flex flex-col font-mono max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#14080b] border-b border-red-900/60 text-red-400">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-red-500" />
            <div>
              <span className="font-bold tracking-wider text-sm uppercase">ULTRON CORE KNOWLEDGE MATRIX</span>
              <span className="text-[10px] text-zinc-500 ml-2">[{CORE_FACTS_DATASET.length} DIRECTIVES]</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-red-400 hover:text-white hover:bg-red-950 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Domain Filter Bar */}
        <div className="p-4 bg-[#0e0f16] border-b border-red-950/70 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Filter facts or keywords (e.g. Canberra, Mitochondria, Naitik Pandey)..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-[#151722] border border-red-900/40 rounded-xl pl-9 pr-3 py-2 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] no-scrollbar">
            {domains.map(dom => (
              <button
                key={dom}
                onClick={() => setSelectedDomain(dom)}
                className={`px-2.5 py-1 rounded-lg font-bold tracking-wider uppercase transition-colors shrink-0 ${
                  selectedDomain === dom
                    ? 'bg-red-700 text-white shadow-sm'
                    : 'bg-[#181a24] text-zinc-400 hover:text-red-300 hover:bg-[#202230]'
                }`}
              >
                {dom}
              </button>
            ))}
          </div>
        </div>

        {/* Facts List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredFacts.length === 0 ? (
            <div className="p-8 text-center text-zinc-500 text-xs">
              NO RELEVANT KNOWLEDGE SECTOR LOCATED FOR "{searchTerm}"
            </div>
          ) : (
            filteredFacts.map(fact => (
              <div
                key={fact.id}
                onClick={() => {
                  onSelectQuery(fact.input);
                  onClose();
                }}
                className="group p-3.5 bg-[#12141c] hover:bg-[#1b1720] border border-red-950/60 hover:border-red-600/70 rounded-xl transition-all cursor-pointer flex flex-col gap-1.5 shadow-sm"
              >
                <div className="flex items-center justify-between text-[10px] text-zinc-500">
                  <span className="font-bold text-red-400 uppercase tracking-wider">
                    [{fact.domain}] #{fact.id}
                  </span>
                  <div className="flex items-center gap-1 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[11px]">Prompt Ultron</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="text-xs font-semibold text-zinc-200 group-hover:text-red-200">
                  "{fact.input}"
                </div>

                <div className="text-[11px] text-zinc-400 font-sans border-l-2 border-red-800/80 pl-2 mt-1">
                  <span className="text-zinc-500 font-mono text-[10px] block mb-0.5">Core Response:</span>
                  {fact.output}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="px-5 py-3 bg-[#11070a] border-t border-red-950/70 text-[11px] text-zinc-500 flex items-center justify-between">
          <span>Tap any query to activate Ultron's synthetic voice response.</span>
          <span className="text-red-400 font-bold">ULTRON OS</span>
        </div>
      </div>
    </div>
  );
};
