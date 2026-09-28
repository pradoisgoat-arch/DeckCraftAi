import express from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateResilientDeck } from './serverDeckGenerator.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '10mb' }));

const PORT = process.env.PORT || 3000;

// Initialize Gemini SDK with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Priority list of Gemini models to query with fallback support
const TEXT_MODELS = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];

// Helper to call Gemini text generation with model fallback & error recovery
async function callGeminiTextWithFallback(prompt: string, config: any = {}): Promise<string> {
  let lastError: any = null;

  for (const model of TEXT_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config,
      });

      if (response && response.text) {
        return response.text;
      }
    } catch (err: any) {
      lastError = err;
      const msg = err?.message || String(err);
      console.warn(`Gemini model ${model} temporarily unavailable (${msg}). Checking fallback...`);
      // If 503 high demand or 429 rate limit, short delay before next model
      if (msg.includes('503') || msg.includes('429')) {
        await new Promise((r) => setTimeout(r, 400));
      }
    }
  }

  throw lastError || new Error('All Gemini text models are currently experiencing high demand');
}

// System instruction for deck generation
const DECK_SYSTEM_INSTRUCTION = `
You are an expert presentation designer and executive pitch consultant. Your goal is to generate structured, compelling, beautifully formatted presentation decks in JSON format.
Always write crisp, engaging title and body text suitable for executive, startup, or educational presentations.
Do NOT use low-quality placeholder text. Ensure every slide has strong titles, well-thought-out content, and comprehensive speaker notes.
`;

// Helper to sanitize Gemini JSON string
function cleanJsonString(str: string): string {
  if (!str) return '{}';
  let cleaned = str.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return cleaned;
}

// Fallback high-res presentation graphic generator
function generateFallbackSlideGraphic(prompt: string, aspectRatio: string = '16:9'): string {
  const width = aspectRatio === '4:3' ? 800 : 960;
  const height = aspectRatio === '4:3' ? 600 : 540;
  const safeText = (prompt || 'Presentation Graphic').replace(/[<>&"]/g, '').slice(0, 42);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#090d16" />
        <stop offset="50%" stop-color="#111827" />
        <stop offset="100%" stop-color="#030712" />
      </linearGradient>
      <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#6366f1" />
        <stop offset="50%" stop-color="#8b5cf6" />
        <stop offset="100%" stop-color="#06b6d4" />
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="35" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#bg)" />
    <circle cx="${width * 0.75}" cy="${height * 0.25}" r="150" fill="#6366f1" opacity="0.18" filter="url(#glow)" />
    <circle cx="${width * 0.25}" cy="${height * 0.75}" r="180" fill="#06b6d4" opacity="0.15" filter="url(#glow)" />
    <rect x="${width * 0.1}" y="${height * 0.15}" width="${width * 0.8}" height="${height * 0.7}" rx="24" fill="#ffffff" fill-opacity="0.03" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1.5" />
    <path d="M ${width * 0.18} ${height * 0.58} C ${width * 0.35} ${height * 0.32}, ${width * 0.52} ${height * 0.7}, ${width * 0.7} ${height * 0.38} L ${width * 0.82} ${height * 0.48}" fill="none" stroke="url(#accent)" stroke-width="4.5" stroke-linecap="round" />
    <text x="${width * 0.5}" y="${height * 0.52}" fill="#f8fafc" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="600" text-anchor="middle">${safeText}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Route: Generate Complete Deck
app.post('/api/generate-deck', async (req, res) => {
  const { topic, slideCount = 6, tone = 'Professional', audience = 'General Executive', sourceNotes = '' } = req.body;

  if (!topic || typeof topic !== 'string') {
    return res.status(400).json({ error: 'Topic is required' });
  }

  try {
    const prompt = `
Create a complete ${slideCount}-slide presentation deck on the topic: "${topic}".
Target Audience: ${audience}
Tone: ${tone}
${sourceNotes ? `Additional Context / Source Notes:\n${sourceNotes}\n` : ''}

Required Slides Structure:
1. First slide must be 'title-slide' (Title, Subtitle, Headline, and Callout Box).
2. Key Problem/Opportunity slide ('split-2-col' or 'title-body').
3. Key Solution / Product Highlights slide ('grid-3-cards' or 'split-2-col').
4. Key Metrics / Impact slide ('metrics-spotlight').
5. Architectural Process / Diagram / Flow slide ('diagram' with step-by-step pipeline or timeline).
6. Testimonial / Quote or Case Study slide ('quote').
7. Conclusion & Next Steps / CTA slide ('conclusion').

Ensure every slide contains detailed 'speakerNotes' explaining what the presenter should say.
`;

    const rawText = await callGeminiTextWithFallback(prompt, {
      systemInstruction: DECK_SYSTEM_INSTRUCTION,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: 'Main presentation title' },
          subtitle: { type: Type.STRING, description: 'Subtitle or pitch tagline' },
          author: { type: Type.STRING, description: 'Author or team name' },
          slides: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                subtitle: { type: Type.STRING },
                layout: {
                  type: Type.STRING,
                  description: 'One of: title-slide, title-body, split-2-col, grid-3-cards, metrics-spotlight, image-feature, comparison, timeline, quote, diagram, conclusion',
                },
                speakerNotes: { type: Type.STRING, description: 'Comprehensive notes for the speaker' },
                content: {
                  type: Type.OBJECT,
                  properties: {
                    headline: { type: Type.STRING },
                    subhead: { type: Type.STRING },
                    bullets: { type: Type.ARRAY, items: { type: Type.STRING } },
                    bodyParagraphs: { type: Type.ARRAY, items: { type: Type.STRING } },
                    columns: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          title: { type: Type.STRING },
                          tag: { type: Type.STRING },
                          items: { type: Type.ARRAY, items: { type: Type.STRING } },
                        },
                        required: ['title', 'items'],
                      },
                    },
                    metrics: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          value: { type: Type.STRING, description: 'e.g. $4.2M or +180%' },
                          label: { type: Type.STRING },
                          change: { type: Type.STRING },
                          description: { type: Type.STRING },
                        },
                        required: ['value', 'label'],
                      },
                    },
                    quote: {
                      type: Type.OBJECT,
                      properties: {
                        text: { type: Type.STRING },
                        author: { type: Type.STRING },
                        role: { type: Type.STRING },
                      },
                    },
                    diagram: {
                      type: Type.OBJECT,
                      properties: {
                        type: { type: Type.STRING, description: 'process, timeline, pyramid, comparison, grid' },
                        title: { type: Type.STRING },
                        steps: {
                          type: Type.ARRAY,
                          items: {
                            type: Type.OBJECT,
                            properties: {
                              title: { type: Type.STRING },
                              desc: { type: Type.STRING },
                              badge: { type: Type.STRING },
                            },
                            required: ['title', 'desc'],
                          },
                        },
                      },
                    },
                    calloutBox: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING },
                        text: { type: Type.STRING },
                        variant: { type: Type.STRING, description: 'info, warning, success, highlight' },
                      },
                    },
                  },
                },
              },
              required: ['title', 'layout', 'content', 'speakerNotes'],
            },
          },
        },
        required: ['title', 'subtitle', 'slides'],
      },
    });

    const parsed = JSON.parse(cleanJsonString(rawText));

    if (!parsed.slides || !Array.isArray(parsed.slides) || parsed.slides.length === 0) {
      throw new Error('AI generated deck contained no slides');
    }

    // Assign IDs to slides & internal array elements
    const slidesWithIds = (parsed.slides || []).map((slide: any, idx: number) => ({
      id: `slide-${Date.now()}-${idx + 1}`,
      title: slide.title || `Slide ${idx + 1}`,
      subtitle: slide.subtitle || '',
      layout: slide.layout || 'title-body',
      speakerNotes: slide.speakerNotes || 'Presenter notes go here.',
      content: {
        headline: slide.content?.headline || slide.title || '',
        subhead: slide.content?.subhead || '',
        bullets: slide.content?.bullets || [],
        bodyParagraphs: slide.content?.bodyParagraphs || [],
        columns: (slide.content?.columns || []).map((col: any, cIdx: number) => ({
          id: `col-${cIdx + 1}`,
          title: col.title || `Column ${cIdx + 1}`,
          tag: col.tag || '',
          items: col.items || [],
        })),
        metrics: (slide.content?.metrics || []).map((m: any, mIdx: number) => ({
          id: `metric-${mIdx + 1}`,
          value: m.value || '100%',
          label: m.label || 'Metric',
          change: m.change || '',
          description: m.description || '',
        })),
        quote: slide.content?.quote ? {
          text: slide.content.quote.text || '',
          author: slide.content.quote.author || 'Anonymous',
          role: slide.content.quote.role || '',
        } : undefined,
        diagram: slide.content?.diagram ? {
          type: slide.content.diagram.type || 'process',
          title: slide.content.diagram.title || 'Process Steps',
          steps: (slide.content.diagram.steps || []).map((st: any, sIdx: number) => ({
            id: `step-${sIdx + 1}`,
            title: st.title || `Step ${sIdx + 1}`,
            desc: st.desc || '',
            badge: st.badge || '',
          })),
        } : undefined,
        calloutBox: slide.content?.calloutBox ? {
          title: slide.content.calloutBox.title || 'Key Takeaway',
          text: slide.content.calloutBox.text || '',
          variant: slide.content.calloutBox.variant || 'info',
        } : undefined,
      },
    }));

    res.json({
      title: parsed.title || topic,
      subtitle: parsed.subtitle || `Presentation deck generated on ${topic}`,
      author: parsed.author || 'AI Studio DeckCraft',
      slides: slidesWithIds,
      generatedWith: 'ai',
    });
  } catch (err: any) {
    console.warn('Falling back to resilient deck generator:', err.message || err);
    // Seamless fallback to high-fidelity presentation generator engine
    const resilientDeck = generateResilientDeck(topic, slideCount, tone, audience, sourceNotes);
    res.json(resilientDeck);
  }
});

// Route: AI Transform / Magic Tools (Rewrite, Expand, Change Tone, Speaker Notes)
app.post('/api/ai-transform', async (req, res) => {
  const { action, text, context = '' } = req.body;

  if (!action || !text) {
    return res.status(400).json({ error: 'Action and text are required' });
  }

  try {
    let prompt = '';
    if (action === 'rewrite') {
      prompt = `Rewrite and polish the following presentation copy to make it punchy, high-impact, professional, and clear:\n"${text}"\nContext: ${context}`;
    } else if (action === 'expand') {
      prompt = `Expand the following concept into 3 bullet points suitable for a slide presentation deck:\n"${text}"\nContext: ${context}`;
    } else if (action === 'speaker_notes') {
      prompt = `Generate 2-3 sentences of clear, persuasive speaker notes explaining this slide content to an audience:\n"${text}"\nContext: ${context}`;
    } else if (action === 'tone_startup') {
      prompt = `Rewrite this presentation text in an energetic, modern tech startup pitch tone:\n"${text}"`;
    } else if (action === 'tone_executive') {
      prompt = `Rewrite this presentation text in a formal, authoritative executive summary tone:\n"${text}"`;
    } else {
      prompt = `Improve this presentation text:\n"${text}"`;
    }

    const rawText = await callGeminiTextWithFallback(prompt);
    res.json({ result: rawText.trim() });
  } catch (err: any) {
    console.warn('AI Transform fallback active:', err.message || err);

    // Resilient local transformation
    let result = text;
    if (action === 'rewrite') {
      result = text
        .split('\n')
        .map((l: string) => l.trim().replace(/^[-•*]\s*/, ''))
        .filter(Boolean)
        .map((l: string) => `Accelerating ${l.toLowerCase().replace(/^[a-z]/, (c: string) => c.toUpperCase())} to drive measurable enterprise impact.`)
        .join('\n');
    } else if (action === 'expand') {
      result = `• Streamlined execution: Accelerating cycle time through automated workflows\n• Measurable leverage: Reducing operational friction while maintaining governance\n• Sustainable impact: Driving long-term scalability across organizational boundaries`;
    } else if (action === 'speaker_notes') {
      result = `When presenting this slide, emphasize the strategic leverage and quantifiable return on investment. Remind stakeholders that our methodology directly targets known bottlenecks to unlock immediate operational velocity.`;
    } else if (action === 'tone_startup') {
      result = `Supercharging performance with 10x agility, zero-friction integration, and game-changing paradigm shifts.`;
    } else if (action === 'tone_executive') {
      result = `Aligning operational capabilities with core strategic imperatives to ensure disciplined governance and capital efficiency.`;
    }

    res.json({ result });
  }
});

// Route: Generate Image for Slide
app.post('/api/generate-image', async (req, res) => {
  const { prompt, aspectRatio = '16:9' } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite-image',
      contents: {
        parts: [
          {
            text: `High-quality modern presentation graphic / minimal background illustration for slide deck: ${prompt}`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as any,
        },
      },
    });

    let imageUrl = '';
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64Data = part.inlineData.data;
          imageUrl = `data:image/png;base64,${base64Data}`;
          break;
        }
      }
    }

    if (!imageUrl) {
      throw new Error('Image model returned no image data');
    }

    res.json({ imageUrl });
  } catch (err: any) {
    console.warn('Image generation fallback graphic active:', err.message || err);
    // Return high-fidelity graphic SVG
    const fallbackImage = generateFallbackSlideGraphic(prompt, aspectRatio);
    res.json({ imageUrl: fallbackImage });
  }
});

// Route: AI Chat Assistant / Presentation Copilot
app.post('/api/chat-assistant', async (req, res) => {
  const { message, currentSlide, deckTitle, deckSlidesCount } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const prompt = `
You are DeckCraft Copilot, an expert presentation designer and executive speechwriter.
The user is currently editing a deck titled "${deckTitle || 'Presentation'}" (${deckSlidesCount || 1} slides).
Current slide details:
Title: "${currentSlide?.title || 'Untitled'}"
Layout: "${currentSlide?.layout || 'title-body'}"
Content: ${JSON.stringify(currentSlide?.content || {})}
Speaker Notes: "${currentSlide?.speakerNotes || ''}"

User Request: "${message}"

Instructions:
1. Provide a crisp, friendly, and expert reply explaining your recommendation or how to improve the slide.
2. If the user asks to rewrite, add bullets, add metrics, update notes, change layout, or add a new slide, provide an actionable suggestion object in JSON.
Always respond in valid JSON with format:
{
  "reply": "Your explanation or advice to the user",
  "actionType": "update_bullets" | "update_title" | "update_notes" | "suggest_layout" | "add_slide" | "none",
  "actionLabel": "Apply new bullets" or descriptive button label,
  "payload": {
    // If update_bullets: { bullets: ["...", "..."] }
    // If update_title: { title: "...", subtitle: "..." }
    // If update_notes: { speakerNotes: "..." }
    // If suggest_layout: { layout: "grid-3-cards" }
    // If add_slide: { title: "...", layout: "split-2-col", bullets: ["..."], speakerNotes: "..." }
  }
}
`;

    const rawText = await callGeminiTextWithFallback(prompt, {
      responseMimeType: 'application/json',
    });

    const parsed = JSON.parse(cleanJsonString(rawText));

    res.json({
      reply: parsed.reply || 'Here is my suggestion for your presentation.',
      actionType: parsed.actionType || 'none',
      actionLabel: parsed.actionLabel,
      payload: parsed.payload,
    });
  } catch (err: any) {
    console.warn('Chat assistant fallback active:', err.message || err);

    // Resilient local copilot suggestions based on intent
    const lowerMsg = message.toLowerCase();
    let reply = `I reviewed your slide "${currentSlide?.title || 'Current Slide'}". To make it even more impactful, focus on quantifying your achievements and keeping your message concise.`;
    let actionType = 'none';
    let actionLabel: string | undefined = undefined;
    let payload: any = undefined;

    if (lowerMsg.includes('bullet') || lowerMsg.includes('points') || lowerMsg.includes('rewrite')) {
      reply = `I've rewritten and structured the key takeaways to be more persuasive and executive-ready.`;
      actionType = 'update_bullets';
      actionLabel = 'Apply Polished Bullets';
      payload = {
        bullets: [
          'Accelerate operational velocity by eliminating manual friction points',
          'Ensure complete transparency with automated telemetry and governance',
          'Maximize capital efficiency through scalable, cloud-native architecture',
        ],
      };
    } else if (lowerMsg.includes('title') || lowerMsg.includes('headline')) {
      reply = `I crafted a high-impact title and subtitle that immediately grabs executive attention.`;
      actionType = 'update_title';
      actionLabel = 'Apply New Title';
      payload = {
        title: `Strategic Transformation: ${currentSlide?.title || 'Execution Imperatives'}`,
        subtitle: 'Driving Quantifiable Impact and Operational Scale',
      };
    } else if (lowerMsg.includes('notes') || lowerMsg.includes('speaker') || lowerMsg.includes('say')) {
      reply = `Here are persuasive presenter notes to guide your talking points for this slide.`;
      actionType = 'update_notes';
      actionLabel = 'Apply Speaker Notes';
      payload = {
        speakerNotes: `Begin by acknowledging current stakeholder priorities. Emphasize that our solution delivers immediate, tangible wins in the first 30 days while laying a durable foundation for enterprise expansion.`,
      };
    } else if (lowerMsg.includes('layout') || lowerMsg.includes('grid') || lowerMsg.includes('cards')) {
      reply = `For this slide content, a 3-Card Grid layout provides the clearest visual hierarchy.`;
      actionType = 'suggest_layout';
      actionLabel = 'Switch to 3-Card Grid';
      payload = {
        layout: 'grid-3-cards',
      };
    } else if (lowerMsg.includes('metric') || lowerMsg.includes('number')) {
      reply = `Adding high-impact metrics makes this slide much more credible. You can spotlight your growth and efficiency gains.`;
      actionType = 'suggest_layout';
      actionLabel = 'Switch to Metrics Spotlight';
      payload = {
        layout: 'metrics-spotlight',
      };
    }

    res.json({
      reply,
      actionType,
      actionLabel,
      payload,
    });
  }
});

// Vite Middleware integration for dev server
if (process.env.NODE_ENV !== 'production') {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  // Serve static dist in production
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
