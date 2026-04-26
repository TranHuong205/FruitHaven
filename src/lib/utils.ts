import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function handleFirestoreError(error: any, operationType: any, path: string | null = null): never {
  const errorInfo = {
    error: error.message || 'Unknown Firestore error',
    operationType,
    path,
    authInfo: {
      userId: 'anonymous',
      email: 'none',
      emailVerified: false,
      isAnonymous: true,
      providerInfo: []
    }
  };
  
  throw JSON.stringify(errorInfo);
}
