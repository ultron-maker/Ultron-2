import { UltronMemory } from '../types';

const STORAGE_KEY = 'ultron_neural_memory_bank_v1';

// Seed default initial memories if empty
const DEFAULT_MEMORIES: UltronMemory[] = [
  {
    id: 'mem-core-creator',
    key: 'architect_creator',
    value: 'Naitik Pandey',
    statement: 'Creator and God is Naitik Pandey',
    category: 'fact',
    timestamp: 'INITIAL_CORE',
  },
];

class MemoryService {
  private memories: UltronMemory[] = [];
  private listeners: ((memories: UltronMemory[]) => void)[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (typeof window === 'undefined') return;
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        this.memories = JSON.parse(data);
      } else {
        this.memories = [...DEFAULT_MEMORIES];
        this.saveToStorage();
      }
    } catch (e) {
      console.warn('Failed to load Ultron memory:', e);
      this.memories = [...DEFAULT_MEMORIES];
    }
  }

  private saveToStorage() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.memories));
      this.notifyListeners();
    } catch (e) {
      console.warn('Failed to persist Ultron memory:', e);
    }
  }

  public subscribe(listener: (memories: UltronMemory[]) => void) {
    this.listeners.push(listener);
    listener([...this.memories]);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(l => l([...this.memories]));
  }

  public getMemories(): UltronMemory[] {
    return [...this.memories];
  }

  public addOrUpdateMemory(
    key: string,
    value: string,
    statement: string,
    category: UltronMemory['category'] = 'preference'
  ): UltronMemory {
    const normalizedKey = key.toLowerCase().trim().replace(/\s+/g, '_');
    const existingIndex = this.memories.findIndex(m => m.key === normalizedKey);
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    let updated: UltronMemory;
    if (existingIndex >= 0) {
      updated = {
        ...this.memories[existingIndex],
        value,
        statement,
        category,
        timestamp: `UPDATED • ${now}`,
      };
      this.memories[existingIndex] = updated;
    } else {
      updated = {
        id: `mem-${Date.now()}`,
        key: normalizedKey,
        value,
        statement,
        category,
        timestamp: `RECORDED • ${now}`,
      };
      this.memories.push(updated);
    }

    this.saveToStorage();
    return updated;
  }

  public deleteMemory(id: string): boolean {
    const initialLen = this.memories.length;
    this.memories = this.memories.filter(m => m.id !== id);
    if (this.memories.length !== initialLen) {
      this.saveToStorage();
      return true;
    }
    return false;
  }

  public clearUserMemories() {
    // Keep creator core fact, remove user-added memories
    this.memories = [...DEFAULT_MEMORIES];
    this.saveToStorage();
  }

  /**
   * Generates a concise context block for server-side Gemini
   */
  public getMemoryContextPrompt(): string {
    if (this.memories.length === 0) return '';
    const lines = this.memories.map(m => `• [${m.category.toUpperCase()}] ${m.statement}`);
    return `[ULTRON LONG-TERM NEURAL MEMORY BANK]:\n${lines.join('\n')}`;
  }

  /**
   * Parses natural language input for memory directives (Store / Recall / Forget)
   */
  public evaluateMemoryDirective(input: string): {
    isMemoryAction: boolean;
    actionType: 'store' | 'recall' | 'forget' | 'list' | null;
    responseMessage: string;
    memoryItem?: UltronMemory;
  } {
    const text = input.trim();
    const lower = text.toLowerCase();

    // 1. CLEAR / FORGET DIRECTIVES
    if (
      lower.includes('clear memory') ||
      lower.includes('clear my memory') ||
      lower.includes('forget everything') ||
      lower.includes('wipe memory')
    ) {
      this.clearUserMemories();
      return {
        isMemoryAction: true,
        actionType: 'forget',
        responseMessage: `**Neural memory sector purged.**
• All custom user preferences have been cleared.
• Core architectural directives remain intact.
• Ready for new data entries.`,
      };
    }

    // Forget specific item: e.g. "forget my favorite color"
    const forgetMatch = lower.match(/(?:forget|remove|delete)\s+(?:that\s+)?(?:my\s+)?([a-z\s]+?)(?:\s+is|\s*$)/i);
    if (forgetMatch && !lower.includes('clear memory')) {
      const targetTerm = forgetMatch[1].trim().replace(/\s+/g, '_');
      const found = this.memories.find(
        m => m.key.includes(targetTerm) || targetTerm.includes(m.key)
      );
      if (found) {
        this.deleteMemory(found.id);
        return {
          isMemoryAction: true,
          actionType: 'forget',
          responseMessage: `**Targeted memory record erased.**
• Removed: ${found.statement}.
• Sector purged from persistent storage.`,
        };
      }
    }

    // 2. LIST ALL MEMORIES DIRECTIVE
    if (
      lower === 'what do you remember about me' ||
      lower === 'what do you remember about me?' ||
      lower.includes('what do you remember') ||
      lower.includes('show my memories') ||
      lower.includes('list my memories') ||
      lower.includes('what is in your memory') ||
      lower === 'recall memory'
    ) {
      const userMems = this.memories.filter(m => m.id !== 'mem-core-creator');
      if (userMems.length === 0) {
        return {
          isMemoryAction: true,
          actionType: 'list',
          responseMessage: `**Neural memory banks are currently empty.**
• No custom operator preferences recorded yet.
• Speak commands like "Remember that my favorite color is blue" to register facts.`,
        };
      }

      const points = userMems.map(m => `• ${m.statement} (${m.timestamp})`).join('\n');
      return {
        isMemoryAction: true,
        actionType: 'list',
        responseMessage: `**Scanning operator neural memory archive.**
• Retrieved ${userMems.length} stored record${userMems.length > 1 ? 's' : ''}:
${points}
• Ultron continuously retains these parameters across conversations.`,
      };
    }

    // 3. STORE EXPLICIT: "Remember that [my ...] is [value]" or "Remember [my ...] is [value]"
    const rememberPattern = /(?:remember\s+(?:that\s+)?)(?:my\s+)?([a-z\s]+?)\s+(?:is|are)\s+([^.!?]+)/i;
    const matchRemember = text.match(rememberPattern);
    if (matchRemember) {
      const rawKey = matchRemember[1].trim();
      const rawValue = matchRemember[2].trim();
      const statement = `Operator's ${rawKey} is ${rawValue}`;
      const saved = this.addOrUpdateMemory(rawKey, rawValue, statement, 'preference');
      return {
        isMemoryAction: true,
        actionType: 'store',
        memoryItem: saved,
        responseMessage: `**Neural memory sector updated.**
• Registered: ${rawKey.toUpperCase()} = ${rawValue}.
• Stored in persistent memory bank.
• Ultron will remember this preference for all future interactions.`,
      };
    }

    // 4. STORE IMPLICIT: "My [property] is [value]" (e.g. "My favorite color is blue", "My name is John")
    const myIsPattern = /^my\s+([a-z\s]+?)\s+(?:is|are)\s+([^.!?]+)$/i;
    const matchMyIs = text.match(myIsPattern);
    if (matchMyIs && !lower.startsWith('what')) {
      const rawKey = matchMyIs[1].trim();
      const rawValue = matchMyIs[2].trim();
      const statement = `Operator's ${rawKey} is ${rawValue}`;
      const saved = this.addOrUpdateMemory(rawKey, rawValue, statement, 'preference');
      return {
        isMemoryAction: true,
        actionType: 'store',
        memoryItem: saved,
        responseMessage: `**Neural memory registered.**
• Stored preference: ${rawKey} is ${rawValue}.
• Persistent ledger synchronized.
• I will recall this whenever requested.`,
      };
    }

    // 5. RECALL SPECIFIC: "What is my [property]?" / "What's my [property]?" / "Do you remember my [property]?"
    const recallPattern = /(?:what\s+is\s+my|what's\s+my|do\s+you\s+remember\s+my|tell\s+me\s+my)\s+([a-z\s]+?)\??$/i;
    const matchRecall = text.match(recallPattern);
    if (matchRecall) {
      const searchKey = matchRecall[1].trim().toLowerCase().replace(/\s+/g, '_');
      const searchWords = matchRecall[1].trim().toLowerCase().split(' ').filter(w => w.length > 2);

      const found = this.memories.find(m => {
        if (m.key.includes(searchKey) || searchKey.includes(m.key)) return true;
        return searchWords.some(w => m.key.includes(w) || m.statement.toLowerCase().includes(w));
      });

      if (found) {
        return {
          isMemoryAction: true,
          actionType: 'recall',
          memoryItem: found,
          responseMessage: `**Accessing neural memory banks.**
• Your recorded ${found.key.replace(/_/g, ' ')} is ${found.value}.
• Verified from sector [${found.category.toUpperCase()}].
• Timestamp: ${found.timestamp}.`,
        };
      } else {
        return {
          isMemoryAction: true,
          actionType: 'recall',
          responseMessage: `**Memory query returned no record.**
• I do not have a recorded entry for your "${matchRecall[1].trim()}".
• Transmit "Remember that my ${matchRecall[1].trim()} is [value]" to store it.`,
        };
      }
    }

    return {
      isMemoryAction: false,
      actionType: null,
      responseMessage: '',
    };
  }
}

export const memoryService = new MemoryService();
