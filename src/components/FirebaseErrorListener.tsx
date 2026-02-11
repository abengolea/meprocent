'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';

export function FirebaseErrorListener() {
  useEffect(() => {
    const handlePermissionError = (error: any) => {
      // Lanzar el error para que sea capturado por el overlay de Next.js
      throw error;
    };

    errorEmitter.on('permission-error', handlePermissionError);
    return () => {
      // @ts-ignore
      errorEmitter.removeListener('permission-error', handlePermissionError);
    };
  }, []);

  return null;
}
