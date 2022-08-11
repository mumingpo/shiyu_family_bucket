import * as React from 'react';
import type { KeyedMutator } from 'swr';
import OSS from 'ali-oss';

import type { AuthInfo } from '../types';
import whiteList from '../whitelist';
import type { Member } from '../whitelist';

type UserContextType = {
  user: Member,
  mutateAuth: KeyedMutator<AuthInfo>, 
  ossClient: OSS | null,
}

const UserContext = React.createContext<UserContextType>({
  user: whiteList.default,
  mutateAuth: async () => undefined,
  ossClient: null,
});

export default UserContext;
