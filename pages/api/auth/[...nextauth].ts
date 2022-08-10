import NextAuth from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter"
import { Redis } from "@upstash/redis"

// Nobody cared to write a types declaration file for sts-sdk :(
// @ts-expect-error
import StsClient from '@alicloud/sts-sdk';

import configs from '../../../configs';
import getUserFromSession from '../../../utils/getUserFromSession';
import type { AuthInfo } from '../../../types';

const emailProvider = EmailProvider(configs.emailConfig);
const redis = new Redis(configs.redisConfig);
const redisAdapter = UpstashRedisAdapter(redis)

const sts = new StsClient({
  endpoint: configs.storageConfig.stsEndpoint,
  accessKeyId: configs.storageConfig.stsManagerId,
  accessKeySecret: configs.storageConfig.stsManagerSecret,
});

const nextAuth = NextAuth({
  session: {
    strategy: 'jwt',
  },
  adapter: redisAdapter,
  providers: [
    emailProvider,
  ],
  callbacks: {
    session: async ({ session }) => {
      const u = getUserFromSession(session);

      const ossAuth: AuthInfo = {
        accessKeyId: '',
        accessKeySecret: '',
        stsToken: '',
        bucket: configs.storageConfig.ossBucket,
        endpoint: configs.storageConfig.ossEndpoint,
      };

      // no typescript annotation, so yeah, just follow docs
      // https://www.alibabacloud.com/help/zh/resource-access-management/latest/use-an-sts-token-for-authorizing-a-mobile-app-to-access-alibaba-cloud-resources?spm=a2c63.p38356.0.0.7e2060ccsMQDjf#concept-tdn-n2k-xdb
      if (u.isShiyu) {
        const response = await sts.assumeRole(
          configs.storageConfig.ossAdminRoleArn,
          `admin-${(new Date()).getTime()}`
        );
        ossAuth.accessKeyId = response.Credentials.AccessKeyId;
        ossAuth.accessKeySecret = response.Credentials.AccessKeySecret;
        ossAuth.stsToken = response.Credentials.SecurityToken;
      } else if (u.isLabMember) {
        const response = await sts.assumeRole(
          configs.storageConfig.ossUserRoleArn,
          `user-${(new Date()).getTime()}`
        );
        ossAuth.accessKeyId = response.Credentials.AccessKeyId;
        ossAuth.accessKeySecret = response.Credentials.AccessKeySecret;
        ossAuth.stsToken = response.Credentials.SecurityToken;
      }

      const newSession = {
        ossAuth,
        user: session.user,
        expires: session.expires,
      };

      return newSession;
    },
  }
})

export default nextAuth;
