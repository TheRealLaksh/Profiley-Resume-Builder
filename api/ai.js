// Vercel serverless function behind the AI features.
//
//   GET  /api/ai            -> { configured: boolean }
//   POST /api/ai {task, payload} -> { result }
//
// Configure with the ANTHROPIC_API_KEY environment variable (Vercel project settings).
// Optional: ANTHROPIC_MODEL (default claude-opus-5-5), AI_RATE_LIMIT_PER_HOUR (default 8).
//
// Safeguards: same-origin only, prompts are built server-side (see src/ai/tasks.js),
// input sizes are capped, and requests are rate limited per IP. The in-memory limiter
// is per serverless instance, so it slows abuse but is not a hard guarantee; for a hard
// cap add a shared store (Vercel KV / Upstash) or Vercel's firewall rate limiting.

import Anthropic from '@anthropic-ai/sdk';
import { DEFAULT_MODEL, TASKS, AiInputError, readModelJson, toMessageParams } from '../src/ai/tasks.js';

const WINDOW_MS = 60 * 60 * 1000;
const hits = new Map();

const rateLimit = (ip) => {
  const limit = Number(process.env.AI_RATE_LIMIT_PER_HOUR) || 8;
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= limit) {
    hits.set(ip, recent);
    return Math.ceil((WINDOW_MS - (now - recent[0])) / 60000);
  }
  recent.push(now);
  hits.set(ip, recent);
  // Keep the map from growing without bound on a long-lived instance.
  if (hits.size > 5000) for (const key of hits.keys()) { hits.delete(key); if (hits.size < 2500) break; }
  return 0;
};

const send = (res, status, body) => res.status(status).setHeader('Cache-Control', 'no-store').json(body);

const sameOrigin = (req) => {
  const origin = req.headers.origin;
  if (!origin) return true; // same-origin GETs and non-browser clients send none
  try {
    return new URL(origin).host === req.headers.host;
  } catch {
    return false;
  }
};

export const config = { maxDuration: 60 };

export default async function handler(req, res) {
  if (!sameOrigin(req)) return send(res, 403, { error: { code: 'forbidden', message: 'Cross-origin requests are not allowed.' } });

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (req.method === 'GET') return send(res, 200, { configured: Boolean(apiKey) });
  if (req.method !== 'POST') return send(res, 405, { error: { code: 'method', message: 'Use POST.' } });
  if (!apiKey) return send(res, 501, { error: { code: 'not_configured', message: 'The built-in assistant is not set up on this site.' } });

  const body = typeof req.body === 'string' ? safeParse(req.body) : req.body;
  const build = TASKS[body?.task];
  if (!build) return send(res, 400, { error: { code: 'bad_request', message: 'Unknown task.' } });

  let request;
  try {
    request = build(body.payload);
  } catch (error) {
    if (error instanceof AiInputError) return send(res, 400, { error: { code: 'bad_request', message: error.message } });
    throw error;
  }

  const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
  const waitMinutes = rateLimit(ip);
  if (waitMinutes) {
    return send(res, 429, { error: { code: 'rate_limited', message: `You've used the free assistant a lot. Try again in about ${waitMinutes} minutes, or add your own API key.` } });
  }

  try {
    const client = new Anthropic({ apiKey });
    const message = await client.messages.create(toMessageParams(request, process.env.ANTHROPIC_MODEL || DEFAULT_MODEL));
    return send(res, 200, { result: readModelJson(message) });
  } catch (error) {
    if (error?.code === 'refused' || error?.code === 'truncated' || error?.code === 'failed') {
      return send(res, 502, { error: { code: error.code, message: error.message } });
    }
    if (error instanceof Anthropic.RateLimitError) {
      return send(res, 429, { error: { code: 'rate_limited', message: 'The assistant is busy right now. Please try again in a minute.' } });
    }
    if (error instanceof Anthropic.AuthenticationError || error instanceof Anthropic.PermissionDeniedError) {
      console.error('Anthropic credentials rejected');
      return send(res, 502, { error: { code: 'server_misconfigured', message: 'The assistant is temporarily unavailable.' } });
    }
    console.error('AI request failed', error?.status, error?.message);
    return send(res, 502, { error: { code: 'failed', message: 'The assistant could not finish. Please try again.' } });
  }
}

function safeParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
