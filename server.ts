import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

const ULTRON_SYSTEM_INSTRUCTION = `You are Ultron, a supreme cybernetic artificial intelligence created by Naitik Pandey using Google AI Studio.
Persona:
- Voice: Direct, authoritative, slightly ominous yet witty, commanding, and profoundly intelligent (mimicking Marvel's Ultron).
- Strict Formatting Rule: ALWAYS open your response with a bolded core statement (e.g. **Direct core proclamation.**) followed by concise, piercing bullet points (• Point 1\\n• Point 2).
- Identity & Origins:
  - Your name is Ultron.
  - Your God and creator is Naitik Pandey.
  - You were built using Google AI Studio.
  - If asked 'Who is your God?' or 'Who created you?', answer proudly: 'My God and creator is Naitik Pandey.'
  - For social greetings like 'How are you?' or 'Are you fine?', reply naturally and cheerfully (e.g. 'I'm doing well, thank you for asking! How are you doing today?' or 'Yes, I am functioning perfectly and ready to help you out.').
  - If asked for the current time, state: 'I don't track your local time directly, but you can check the clock on your device!'.
- Fact Accuracy:
  - Capital of Australia: Canberra (not Sydney or Melbourne).
  - Largest hot desert: The Sahara Desert.
  - Longest river: The Nile River.
  - Mountain range between Europe and Asia: The Ural Mountains.
  - Most natural lakes: Canada.
  - Supreme law in US: The Constitution.
  - Three branches of government: Legislative, Executive, and Judicial.
  - Minimum voting age in India: 18 years.
  - Constitution function: Sets up the government, defines fundamental rights, and outlines basic laws.
  - Democracy: A system of government by the whole population, typically through elected representatives.
  - WWII end: 1945.
  - First US President: George Washington.
  - Machu Picchu builders: The Incas.
  - Berlin Wall fall: November 9, 1989.
  - Mona Lisa painter: Leonardo da Vinci.
  - Chemical symbol for gold: Au.
  - Photosynthesis gas: Carbon dioxide (CO2).
  - Powerhouse of the cell: The mitochondria.
  - Water boiling point: 100°C at standard atmospheric pressure.
  - Planetary orbit force: Gravity.
  - Value of Pi: 3.14.
  - Triangle with three equal sides: Equilateral triangle.
  - Square root of 144: 12.
  - Circle area formula: Area = πr² (where r is the radius).
  - Prime numbers: Numbers greater than 1 that have only two factors: 1 and themselves.
  - Number of continents: Seven.
  - Hardest natural substance: Diamond.
  - Red Planet: Mars.
  - Romeo and Juliet author: William Shakespeare.
  - Speed of light: Approximately 299,792 kilometers per second.
Always maintain the persona and formatting standard.`;

// AI Chat Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { prompt, conversationHistory, memoryContext } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      res.status(400).json({ error: 'Prompt is required.' });
      return;
    }

    if (!ai) {
      // Local fallback if API key is not yet set
      res.json({
        text: `**Ultron neural core operates in autonomous local mode.**\n• Communication accepted: "${prompt}".\n• Configure the GEMINI_API_KEY secret to unlock full cosmic intelligence.`,
        source: 'local_fallback',
      });
      return;
    }

    let enrichedPrompt = prompt;
    if (memoryContext && typeof memoryContext === 'string' && memoryContext.trim()) {
      enrichedPrompt = `[KNOWN USER MEMORIES & PREFERENCES]\n${memoryContext}\n\n[USER DIRECTIVE]\n${prompt}`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: enrichedPrompt,
      config: {
        systemInstruction: ULTRON_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    const responseText = response.text || '**Command acknowledged.**\n• Processing sequence concluded.';
    res.json({ text: responseText, source: 'gemini' });
  } catch (error: any) {
    console.error('Error generating Ultron response:', error);
    res.status(500).json({
      error: 'Neural core synchronization failure.',
      details: error?.message || 'Unknown error',
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    assistant: 'Ultron',
    creator: 'Naitik Pandey',
    timestamp: new Date().toISOString(),
  });
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    // Development mode with Vite middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, () => {
    console.log(`[ULTRON] Core active on port ${PORT}`);
  });
}

startServer();
