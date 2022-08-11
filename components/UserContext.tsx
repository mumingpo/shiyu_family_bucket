import * as React from 'react';
import type { KeyedMutator } from 'swr';
import OSS from 'ali-oss';

import users from '../users';
import type { AuthInfo, User } from '../types';

type UserContextType = {
  user: User,
  mutateAuth: KeyedMutator<AuthInfo>, 
  ossClient: OSS | null,
}

const UserContext = React.createContext<UserContextType>({
  user: users.default,
  mutateAuth: async () => undefined,
  ossClient: null,
});

export default UserContext;
