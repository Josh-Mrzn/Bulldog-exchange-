import { useMemo, useSyncExternalStore } from 'react';
import { SESSION_EVENT, getRawSession } from './api';

const subscribe = (callback) => {
  window.addEventListener(SESSION_EVENT, callback);
  return () => window.removeEventListener(SESSION_EVENT, callback);
};

// The signed-in user, re-rendering the component whenever the session changes (e.g. a profile edit).
export default function useSessionUser() {
  const raw = useSyncExternalStore(subscribe, getRawSession);
  return useMemo(() => (raw ? JSON.parse(raw).user : null), [raw]);
}
