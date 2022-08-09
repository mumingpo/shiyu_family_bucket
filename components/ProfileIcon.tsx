import * as React from 'react';
import { Avatar, Menu } from '@mantine/core';
import { Logout } from 'tabler-icons-react';

import { useSession, signOut } from 'next-auth/react';
import useUser from '../hooks/useUser';

function ProfileIcon(): JSX.Element {
  const { data: session } = useSession();
  const user = useUser();

  if (!session) {
    return <div />;
  }

  const avatar = <Avatar alt={user.alias} color="blue">{user.alias}</Avatar>;

  return (
    <Menu>
      <Menu.Target>
        {avatar}
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>操作</Menu.Label>
        <Menu.Item
          icon={<Logout />}
          onClick={() => { signOut(); }}
        >
          退出
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

export default ProfileIcon;
