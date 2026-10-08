import { useCallback, useEffect, useState } from 'react';
import { getUserKey, probeServer } from './client';

let serverProbe; // one request per page load, shared by every component

/**
 * Where AI requests will go:
 *  'checking' while we find out, 'server' if the site has its own assistant,
 *  'user' if the person added their own key, 'none' if neither.
 */
export default function useAiStatus() {
  const [serverAvailable, setServerAvailable] = useState(null);
  const [hasUserKey, setHasUserKey] = useState(() => Boolean(getUserKey()));

  useEffect(() => {
    let cancelled = false;
    serverProbe ??= probeServer();
    serverProbe.then((available) => { if (!cancelled) setServerAvailable(available); });
    return () => { cancelled = true; };
  }, []);

  const refresh = useCallback(() => setHasUserKey(Boolean(getUserKey())), []);

  const status = serverAvailable === null ? 'checking' : serverAvailable ? 'server' : hasUserKey ? 'user' : 'none';
  return { status, serverAvailable, hasUserKey, ready: status === 'server' || status === 'user' || (serverAvailable === false && hasUserKey), refresh };
}
