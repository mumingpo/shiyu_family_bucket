import * as React from 'react';
import UserContext from '../components/UserContext';

function useUser() {
  const ctx = React.useContext(UserContext);

  return ctx;
}

export default useUser;
