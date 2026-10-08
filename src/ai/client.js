import { DEFAULT_MODEL, MODEL_CHOICES, TASKS, readModelJson, toMessageParams, AiInputError } from './tasks';

const KEY_STORAGE = 'profiley_ai_key';
const MODEL_STORAGE = 'profiley_ai_model';

export class AiError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

const store = {
  get(key) {
    try { return localStorage.getItem(key) || ''; } catch { return ''; }
  },
  set(key, value) {
    try { value ? localStorage.setItem(key, value) : localStorage.removeItem(key); } catch { /* storage blocked: key lasts for this tab only */ }
  }
};

let sessionKey = '';

export const getUserKey = () => sessionKey || store.get(KEY_STORAGE);
export const setUserKey = (key) => { sessionKey = key.trim(); store.set(KEY_STORAGE, sessionKey); };
export const getUserModel = () => {
  const saved = store.get(MODEL_STORAGE);
  return MODEL_CHOICES.some((m) => m.id === saved) ? saved : DEFAULT_MODEL;
};
export const setUserModel = (model) => store.set(MODEL_STORAGE, model);

/** Does this deployment have a server-side key? (A missing /api route counts as "no".) */
export const probeServer = async (signal) => {
  try {
    const res = await fetch('/api/ai', { signal, headers: { Accept: 'application/json' } });
    if (!res.ok || !(res.headers.get('content-type') || '').includes('json')) return false;
    return Boolean((await res.json()).configured);
  } catch {
    return false;
  }
};

const fromServerError = (status, body) => {
  const code = body?.error?.code || 'failed';
  const message = body?.error?.message || 'The assistant could not finish. Please try again.';
  return new AiError(status === 501 ? 'not_configured' : code, message);
};

const runOnServer = async (task, payload, signal) => {
  let res;
  try {
    res = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task, payload }),
      signal
    });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new AiError('network', "Couldn't reach the assistant. Check your connection and try again.");
  }
  const body = await res.json().catch(() => null);
  if (!res.ok) throw fromServerError(res.status, body);
  return body.result;
};

const runWithUserKey = async (task, payload, signal, key) => {
  const request = TASKS[task](payload);
  // Loaded on demand: the SDK is only needed when someone uses their own key.
  const { default: Anthropic } = await import('@anthropic-ai/sdk');
  const client = new Anthropic({ apiKey: key, dangerouslyAllowBrowser: true });

  try {
    const message = await client.messages.create(toMessageParams(request, getUserModel()), { signal });
    return readModelJson(message);
  } catch (error) {
    if (error.name === 'AbortError' || error.name === 'APIUserAbortError') throw error;
    if (error?.code && ['refused', 'truncated', 'failed'].includes(error.code)) throw new AiError(error.code, error.message);
    if (error instanceof Anthropic.AuthenticationError) throw new AiError('bad_key', 'Anthropic rejected that API key. Check it and try again.');
    if (error instanceof Anthropic.PermissionDeniedError) throw new AiError('bad_key', 'That API key is not allowed to use this model.');
    if (error instanceof Anthropic.RateLimitError) throw new AiError('rate_limited', 'Anthropic is rate limiting this key. Try again in a minute.');
    if (error instanceof Anthropic.APIConnectionError) throw new AiError('network', "Couldn't reach Anthropic. Check your connection.");
    throw new AiError('failed', error?.message || 'The assistant could not finish.');
  }
};

/**
 * Runs an AI task: the site's built-in assistant when it has one, otherwise the
 * user's own key. Throws AiError with a friendly message (code 'not_configured'
 * means neither is available yet).
 */
export const runAiTask = async (task, payload, { signal, serverAvailable } = {}) => {
  try {
    TASKS[task](payload); // validate sizes before any network call
  } catch (error) {
    if (error instanceof AiInputError) throw new AiError('bad_request', error.message);
    throw error;
  }

  const key = getUserKey();
  if (serverAvailable !== false) {
    try {
      return await runOnServer(task, payload, signal);
    } catch (error) {
      // Fall back to the user's own key only when the site has no assistant or is rate limiting.
      const canFallBack = key && error instanceof AiError && ['not_configured', 'rate_limited'].includes(error.code);
      if (!canFallBack) throw error;
    }
  }
  if (!key) throw new AiError('not_configured', 'Add your Anthropic API key to use the assistant.');
  return runWithUserKey(task, payload, signal, key);
};

export { MODEL_CHOICES };
