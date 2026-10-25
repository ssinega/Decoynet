import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json({ limit: '10mb' }));

  // AI Incident Analysis API Endpoint powered by Gemini
  app.post('/api/analyze-incident', async (req, res) => {
    try {
      const { incidentId, scenarioName, events, triggeredRules, affectedAssets, threatScore } = req.body;

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
        return res.status(503).json({
          error: 'Gemini API Key missing or unconfigured in environment',
          fallbackAvailable: true,
          details: 'GEMINI_API_KEY is not configured in environment settings.'
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const promptPayload = `Incident ID: ${incidentId}
Scenario Name: ${scenarioName}
Threat Score: ${threatScore}/100
Affected Assets: ${JSON.stringify(affectedAssets)}
Triggered Detection Rules: ${JSON.stringify(triggeredRules)}
Structured Telemetry Log:
${JSON.stringify(events, null, 2)}`;

      const systemInstruction = `You are DECOYNET's defensive cybersecurity incident analyst. Analyze only the supplied simulated security telemetry. Identify the observed suspicious behaviors, reconstruct the apparent attack sequence, describe why deception assets triggered alerts, assess risk using the supplied detection results, and recommend defensive actions. Do not invent actions, network connections, vulnerabilities, or evidence not present in the input. This is a synthetic training simulation. Do not provide attack instructions. Return a concise professional security incident analysis.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: promptPayload,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'OBJECT' as any,
            properties: {
              executiveSummary: { type: 'STRING' as any },
              attackTechnique: { type: 'STRING' as any },
              observedAttackPath: { type: 'STRING' as any },
              evidence: { type: 'STRING' as any },
              rootCauseHypothesis: { type: 'STRING' as any },
              severityExplanation: { type: 'STRING' as any },
              recommendedActions: {
                type: 'ARRAY' as any,
                items: { type: 'STRING' as any },
              },
              confidenceLevel: { type: 'STRING' as any },
              limitations: { type: 'STRING' as any },
            },
            required: [
              'executiveSummary',
              'attackTechnique',
              'observedAttackPath',
              'evidence',
              'rootCauseHypothesis',
              'severityExplanation',
              'recommendedActions',
              'confidenceLevel',
              'limitations',
            ],
          },
        },
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error('Received empty response text from Gemini API');
      }

      const analysisData = JSON.parse(responseText);

      return res.json({
        success: true,
        analysis: analysisData,
        analyzedAt: new Date().toISOString(),
        model: 'gemini-3.8-flash'
      });
    } catch (error: any) {
      console.error('Server side Gemini incident analysis error:', error);
      return res.status(500).json({
        error: 'Failed to complete AI incident analysis',
        message: error.message || 'Internal AI service error',
        fallbackAvailable: true
      });
    }
  });

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'DECOYNET Engine', timestamp: new Date().toISOString() });
  });

  // Vite middleware in development or static serving in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[DECOYNET] Operational Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[DECOYNET] Failed to start server:', err);
  process.exit(1);
});
