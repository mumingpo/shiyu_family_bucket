import type { EmailUserConfig } from 'next-auth/providers/email';
import type { RedisConfigNodejs } from '@upstash/redis';

type OssConfig = {
  ossBucket: string,
  ossEndpoint: string,
  ossAdminRoleArn: string,
  ossUserRoleArn: string,
  stsEndpoint: string,
  stsManagerId: string,
  stsManagerSecret: string,
};

type Configs = {
  emailConfig: EmailUserConfig,
  redisConfig: RedisConfigNodejs,
  storageConfig: OssConfig,
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
  storageConfig: {
    ossBucket: process.env.OSS_BUCKET || '',
    ossEndpoint: process.env.OSS_ENDPOINT || '',
    ossAdminRoleArn: process.env.OSS_ADMIN_ROLE_ARN || '',
    ossUserRoleArn: process.env.OSS_USER_ROLE_ARN || '',
    stsEndpoint: process.env.STS_ENDPOINT || '',
    stsManagerId: process.env.STS_MANAGER_ID || '',
    stsManagerSecret: process.env.STS_MANAGER_SECRET || '',
  },
};

export default configs;
