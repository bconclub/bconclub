'use client';

import { useEffect } from 'react';
import { MARKUP } from './markup';

let started = false;

export default function Flight() {
  useEffect(() => {
    if (started) return;
    started = true;
    import('./engine').then(({ startFlight }) => startFlight());
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: MARKUP }} />;
}
