import NextAuth from 'next-auth';

import type { AuthInfo } from './types';

declare module 'next-auth' {
  interface Session {
    ossAuth: AuthInfo,
  }
}
