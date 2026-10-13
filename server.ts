import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client lazily/safely
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    try {
      aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (err) {
      console.warn('Gemini client initialization skipped or failed:', err);
    }
  }
  return aiClient;
}

// In-memory leads store
const storedLeads: any[] = [];

// API: Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
  });
});

// API: Natural language AI business search
app.post('/api/ai/search', async (req, res) => {
  const { query } = req.body;
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Query is required' });
  }

  const ai = getGeminiClient();
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are an AI search interpreter for "Bozeman Business Hub", a local business directory.
Analyze this user query: "${query}".
Extract search parameters into JSON format with keys:
- category: string or null (one of: "contractors", "restaurants", "outdoor", "retail", "automotive", "professional", "health", "wellness")
- neighborhood: string or null
- requiresOpenNow: boolean
- requiresPortfolio: boolean
- requiresEmergency: boolean
- keywords: array of strings
- interpretationSummary: a friendly 1-sentence explanation of what was interpreted.

Return ONLY raw JSON, no markdown code blocks.`,
      });

      const text = response.text ? response.text.trim() : '';
      const cleanJson = text.replace(/^```(json)?/i, '').replace(/```$/, '').trim();
      const parsed = JSON.parse(cleanJson);
      return res.json({ success: true, aiPowered: true, parsed });
    } catch (err) {
      console.warn('Gemini search interpretation error, using deterministic parsing:', err);
    }
  }

  // Heuristic rule-based fallback
  const lower = query.toLowerCase();
  let category: string | null = null;
  if (lower.includes('restaurant') || lower.includes('food') || lower.includes('pizza') || lower.includes('eat') || lower.includes('bakery') || lower.includes('steak')) category = 'restaurants';
  else if (lower.includes('plumb') || lower.includes('contractor') || lower.includes('build') || lower.includes('timber') || lower.includes('remodel') || lower.includes('heat')) category = 'contractors';
  else if (lower.includes('fish') || lower.includes('bike') || lower.includes('ski') || lower.includes('outfit') || lower.includes('guide')) category = 'outdoor';
  else if (lower.includes('auto') || lower.includes('truck') || lower.includes('car') || lower.includes('diesel') || lower.includes('mechanic')) category = 'automotive';
  else if (lower.includes('dent') || lower.includes('doctor') || lower.includes('clinic')) category = 'health';
  else if (lower.includes('spa') || lower.includes('massage') || lower.includes('sauna')) category = 'wellness';
  else if (lower.includes('legal') || lower.includes('attorney') || lower.includes('law') || lower.includes('water right')) category = 'professional';
  else if (lower.includes('leather') || lower.includes('boot') || lower.includes('shop') || lower.includes('store')) category = 'retail';

  const requiresOpenNow = lower.includes('open now') || lower.includes('open tonight') || lower.includes('tonight');
  const requiresPortfolio = lower.includes('portfolio') || lower.includes('work') || lower.includes('projects');
  const requiresEmergency = lower.includes('emergency') || lower.includes('24/7') || lower.includes('urgent');

  let neighborhood: string | null = null;
  if (lower.includes('downtown') || lower.includes('main street')) neighborhood = 'Downtown Main Street';
  else if (lower.includes('cannery')) neighborhood = 'Cannery District';
  else if (lower.includes('four corners')) neighborhood = 'Four Corners';
  else if (lower.includes('midtown') || lower.includes('7th')) neighborhood = 'Midtown & North 7th';

  res.json({
    success: true,
    aiPowered: false,
    parsed: {
      category,
      neighborhood,
      requiresOpenNow,
      requiresPortfolio,
      requiresEmergency,
      keywords: query.split(/\s+/).filter(w => w.length > 3),
      interpretationSummary: `Interpreting search for ${category || 'local businesses'} in Bozeman${neighborhood ? ` near ${neighborhood}` : ''}.`,
    },
  });
});

// API: AI Business Assistant ("Ask About This Business")
app.post('/api/ai/assistant', async (req, res) => {
  const { business, question } = req.body;
  if (!business || !question) {
    return res.status(400).json({ error: 'Business details and question are required' });
  }

  const ai = getGeminiClient();
  if (ai) {
    try {
      const prompt = `You are the AI Business Assistant for "${business.name}" in Bozeman, Montana on the Bozeman Business Hub platform.
CRITICAL INSTRUCTION:
- You must ONLY answer using the facts provided below in the business profile.
- If the requested information is not mentioned in the business profile data, you MUST respond exactly: "This information isn't currently listed on the business profile. Please contact the business directly via phone (${business.contact?.formattedPhone || 'listed number'}) or WhatsApp."
- Keep your answer direct, professional, warm, concise, and helpful (max 3-4 sentences).

BUSINESS PROFILE DATA:
- Name: ${business.name}
- Tagline: ${business.tagline}
- Category: ${business.categoryName} (${business.subcategoryName || ''})
- Address: ${business.location?.address}, ${business.location?.neighborhood}, Bozeman, MT
- Phone: ${business.contact?.formattedPhone}
- WhatsApp: ${business.contact?.whatsapp}
- Website: ${business.contact?.website}
- Years in Business: ${business.yearsInBusiness} years (founded ${business.foundedYear})
- Price Range: ${business.priceRange}
- Verification Tier: ${business.verificationTier}
- Verified Items: ${(business.verifiedItems || []).join('; ')}
- Services: ${(business.services || []).map((s: any) => `${s.name} (${s.priceType === 'fixed' ? `$${s.price}` : s.priceType}) - ${s.description}`).join(' | ')}
- Products: ${(business.products || []).map((p: any) => `${p.name} ($${p.price || 'N/A'}) - ${p.description}`).join(' | ')}
- FAQs: ${(business.faqs || []).map((f: any) => `Q: ${f.question} A: ${f.answer}`).join(' | ')}
- Badges: ${(business.badges || []).join(', ')}

USER QUESTION: "${question}"`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const answer = response.text ? response.text.trim() : '';
      return res.json({ success: true, answer, aiPowered: true });
    } catch (err) {
      console.warn('Gemini assistant error, falling back to profile matcher:', err);
    }
  }

  // Deterministic profile search fallback
  const qLower = question.toLowerCase();
  let answer = '';

  if (qLower.includes('hour') || qLower.includes('open') || qLower.includes('close') || qLower.includes('time')) {
    answer = `${business.name} is open Monday through Friday, with weekend hours specified on their profile. Their location is ${business.location?.address} in the ${business.location?.neighborhood}.`;
  } else if (qLower.includes('service') || qLower.includes('do they') || qLower.includes('offer')) {
    const serviceNames = (business.services || []).map((s: any) => s.name).slice(0, 3).join(', ');
    answer = `${business.name} offers specialized services including ${serviceNames}. You can view the complete service catalog and request a quote on this page.`;
  } else if (qLower.includes('price') || qLower.includes('cost') || qLower.includes('how much') || qLower.includes('rate')) {
    answer = `${business.name} operates in the ${business.priceRange} price tier. Many services and products have starting prices listed in the catalog, or you can request a customized quote.`;
  } else if (qLower.includes('phone') || qLower.includes('contact') || qLower.includes('call') || qLower.includes('whatsapp')) {
    answer = `You can call ${business.name} at ${business.contact?.formattedPhone} or connect instantly via WhatsApp at +${business.contact?.whatsapp}.`;
  } else if (qLower.includes('location') || qLower.includes('where') || qLower.includes('address')) {
    answer = `${business.name} is located at ${business.location?.address} in the ${business.location?.neighborhood} area of Bozeman, MT.`;
  } else {
    // Check FAQ match
    const matchingFaq = (business.faqs || []).find((f: any) =>
      qLower.split(' ').some((word: string) => word.length > 4 && f.question.toLowerCase().includes(word))
    );
    if (matchingFaq) {
      answer = matchingFaq.answer;
    } else {
      answer = `This information isn't currently listed on the business profile. Please contact ${business.name} directly via phone at ${business.contact?.formattedPhone} or WhatsApp.`;
    }
  }

  res.json({ success: true, answer, aiPowered: false });
});

// API: Record new lead / inquiry / quote request
app.post('/api/leads', (req, res) => {
  const leadData = req.body;
  if (!leadData.businessId || !leadData.customerName || !leadData.customerEmail) {
    return res.status(400).json({ error: 'Missing required lead fields' });
  }

  const newLead = {
    id: 'lead-' + Date.now(),
    createdAt: new Date().toISOString(),
    status: 'new',
    ...leadData,
  };

  storedLeads.unshift(newLead);
  res.json({ success: true, lead: newLead });
});

app.get('/api/leads', (req, res) => {
  res.json({ success: true, leads: storedLeads });
});

// Initialize Vite server or static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Bozeman Business Hub running at http://localhost:${PORT}`);
  });
}

startServer();
