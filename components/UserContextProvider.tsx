import * as React from 'react';
import { useSession } from 'next-auth/react';

import useSWR from 'swr';

import OSS from 'ali-oss';

import UserContext from './UserContext';
import getUserFromSession from '../utils/getUserFromSession';

import type { AuthInfo } from '../types';

const AUTH_INFO_PATH = '/api/sts/authInfo';

type ComponentProps = {
  children: JSX.Element,
};

function UserContextProvider(props: ComponentProps): JSX.Element {
  const { children } = props;
  const { data: session } = useSession();
  const user = getUserFromSession(session);

  const { data: auth, mutate: mutateAuth, error } = useSWR<AuthInfo>(
    AUTH_INFO_PATH,
    async () => {
      const res = await fetch(AUTH_INFO_PATH);
      const body = await res.json();
      return body.ossAuth;
    },
    {
      revalidateIfStale: false,
      // 2.5 minutes. default sts expiration is 3 minutes
      refreshInterval: 2.5 * 60 * 1000,
    },
  );

  const refreshSTSToken = React.useMemo(() => {
    const refreshFn = (async () => {
      const result = await mutateAuth();
      if (!result) {
        throw new Error('This should not happen.');
      }
      return result;
    });

    return refreshFn;
  }, [mutateAuth]);

  const ossClient = React.useMemo(() => {
    if (!(auth?.accessKeyId) || error) {
      return null;
    }
    // FIXME: I don't know why this is causing an infinite update loop
    // but I had enough of bashing my head against the wall.
    return new OSS({
      refreshSTSToken,
      refreshSTSTokenInterval: 2.5 * 60 * 1000 * 1000000000000,
      ...auth,
    });
  }, [auth, refreshSTSToken, error]);

  const userContext = React.useMemo(() => ({
    user,
    mutateAuth,
    ossClient,
  }), [user, mutateAuth, ossClient]);

  return (
    <UserContext.Provider value={userContext}>
      {children}
    </UserContext.Provider>
  );
}

export default UserContextProvider;
