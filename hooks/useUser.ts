import { useSession } from 'next-auth/react';

import getUserFromSession from '../utils/getUserFromSession';

function useUser() {
  const { data: session } = useSession();

  return getUserFromSession(session);
}

export default useUser;
