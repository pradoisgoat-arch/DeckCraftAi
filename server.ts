import express from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

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

// Route: Generate Complete Deck
app.post('/api/generate-deck', async (req, res) => {
  try {
    const { topic, slideCount = 6, tone = 'Professional', audience = 'General Executive', sourceNotes = '' } = req.body;

    if (!topic || typeof topic !== 'string') {
      return res.status(400).json({ error: 'Topic is required' });
    }

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

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
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
      },
    });

    const rawText = response.text || '{}';
    const parsed = JSON.parse(cleanJsonString(rawText));

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
    });
  } catch (err: any) {
    console.error('Error generating deck:', err);
    res.status(500).json({ error: err.message || 'Failed to generate presentation deck' });
  }
});

// Route: AI Transform / Magic Tools (Rewrite, Expand, Change Tone, Speaker Notes)
app.post('/api/ai-transform', async (req, res) => {
  try {
    const { action, text, context = '' } = req.body;

    if (!action || !text) {
      return res.status(400).json({ error: 'Action and text are required' });
    }

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

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    res.json({ result: response.text?.trim() || text });
  } catch (err: any) {
    console.error('Error in AI transform:', err);
    res.status(500).json({ error: err.message || 'Failed to transform content' });
  }
});

// Route: Generate Image for Slide
app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt, aspectRatio = '16:9' } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Call Gemini image generation model
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
      return res.status(500).json({ error: 'Image generation model returned no image data' });
    }

    res.json({ imageUrl });
  } catch (err: any) {
    console.error('Error generating image:', err);
    res.status(500).json({ error: err.message || 'Failed to generate image' });
  }
});

// Route: AI Chat Assistant / Presentation Copilot
app.post('/api/chat-assistant', async (req, res) => {
  try {
    const { message, currentSlide, deckTitle, deckSlidesCount } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

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

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const raw = response.text?.trim() || '{}';
    const parsed = JSON.parse(cleanJsonString(raw));

    res.json({
      reply: parsed.reply || 'Here is my suggestion for your presentation.',
      actionType: parsed.actionType || 'none',
      actionLabel: parsed.actionLabel,
      payload: parsed.payload,
    });
  } catch (err: any) {
    console.error('Error in chat assistant:', err);
    res.status(500).json({ error: err.message || 'Failed to process assistant request' });
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
