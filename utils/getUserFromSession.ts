import { Session } from 'next-auth';

import whiteList from '../whitelist';

function getUserFromSession(session: Session | null) {
  const email = session?.user?.email;

  if (!email || !(Object.hasOwn(whiteList, email))) {
    return whiteList.default;
  }

  return whiteList[email as keyof typeof whiteList];
};

export default getUserFromSession;
