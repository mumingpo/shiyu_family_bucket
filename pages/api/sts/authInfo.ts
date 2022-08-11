// Nobody cared to write a types declaration file for sts-sdk :(
// @ts-expect-error
import StsClient from '@alicloud/sts-sdk';

import { unstable_getServerSession } from 'next-auth';
import type { NextApiRequest, NextApiResponse } from 'next';
import { nextAuthOptions } from '../auth/[...nextauth]';

import { AuthInfo } from '../../../types';
import configs from '../../../configs';

import getUserFromSession from '../../../utils/getUserFromSession';

const sts = new StsClient({
  endpoint: configs.storageConfig.stsEndpoint,
  accessKeyId: configs.storageConfig.stsManagerId,
  accessKeySecret: configs.storageConfig.stsManagerSecret,
});

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await unstable_getServerSession(req, res, nextAuthOptions);
  const user = getUserFromSession(session);

  const ossAuth: AuthInfo = {
    accessKeyId: '',
    accessKeySecret: '',
    stsToken: '',
    bucket: configs.storageConfig.ossBucket,
    endpoint: configs.storageConfig.ossEndpoint,
  };

  // no typescript annotation, so yeah, just follow docs
  // https://www.alibabacloud.com/help/zh/resource-access-management/latest/use-an-sts-token-for-authorizing-a-mobile-app-to-access-alibaba-cloud-resources?spm=a2c63.p38356.0.0.7e2060ccsMQDjf#concept-tdn-n2k-xdb
  if (user.type === 'admin') {
    const response = await sts.assumeRole(
      configs.storageConfig.ossAdminRoleArn,
      `admin-${(new Date()).getTime()}`
    );
    ossAuth.accessKeyId = response.Credentials.AccessKeyId;
    ossAuth.accessKeySecret = response.Credentials.AccessKeySecret;
    ossAuth.stsToken = response.Credentials.SecurityToken;
  } else if (user.type === 'member') {
    const response = await sts.assumeRole(
      configs.storageConfig.ossUserRoleArn,
      `user-${(new Date()).getTime()}`
    );
    ossAuth.accessKeyId = response.Credentials.AccessKeyId;
    ossAuth.accessKeySecret = response.Credentials.AccessKeySecret;
    ossAuth.stsToken = response.Credentials.SecurityToken;
  }

  res.status(200).json({ ossAuth });
}

export default handler;
