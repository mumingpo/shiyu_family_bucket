import type { EmailUserConfig } from 'next-auth/providers/email';
import type { RedisConfigNodejs } from '@upstash/redis';

type Configs = {
  emailConfig: EmailUserConfig,
  redisConfig: RedisConfigNodejs,
};

const configs: Configs = {
  emailConfig: {
    server: {
      host: process.env.SMTP_HOST || '',
      port: process.env.SMTP_PORT
        ? Number.parseInt(process.env.SMTP_PORT, 10)
        : 465,
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
      },
    },
    from: 'no-reply@shiyuquanjiatong.com',
  },
  redisConfig: {
    url: process.env.REDIS_URL || '',
    token: process.env.REDIS_TOKEN || '',
  },
} as const;

export default configs;
