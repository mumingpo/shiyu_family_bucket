import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter"
import { Redis } from "@upstash/redis"

import configs from '../../../configs';

const emailProvider = EmailProvider(configs.emailConfig);
const redis = new Redis(configs.redisConfig);
const redisAdapter = UpstashRedisAdapter(redis)

const nextAuthOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  adapter: redisAdapter,
  providers: [
    emailProvider,
  ],
};

const nextAuth = NextAuth(nextAuthOptions);

export default nextAuth;
export { nextAuthOptions };
