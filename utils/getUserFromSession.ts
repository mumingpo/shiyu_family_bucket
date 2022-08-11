import { Session } from 'next-auth';

import users from '../users';

function getUserFromSession(session: Session | null) {
  const email = session?.user?.email;

  if (!email) {
    return users.default;
  }

  if (!Object.hasOwn(users, email)) {
    return users.default;
  }

  return users[email as keyof typeof users];
};

export default getUserFromSession;
