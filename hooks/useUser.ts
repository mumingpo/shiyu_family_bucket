import { useSession } from 'next-auth/react';

import getUserFromSession from '../utils/getUserFromSession';

import configs from '../configs';

import { AuthInfo } from '../types';

function useUser() {
  const { data: session } = useSession();

  const defaultAuthInfo: AuthInfo = {
    accessKeyId: '',
    accessKeySecret: '',
    stsToken: '',
    bucket: configs.storageConfig.ossBucket,
    endpoint: configs.storageConfig.ossEndpoint,
  };

  const user = getUserFromSession(session);
  const auth = session?.ossAuth || defaultAuthInfo;

  // console.log({ user, session, auth });

  return { user, auth };
}

export default useUser;
