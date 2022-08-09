import * as React from 'react';
import { Avatar, Menu } from '@mantine/core';
import { Logout } from 'tabler-icons-react';

import { useSession, signOut } from 'next-auth/react';

import whiteList from '../whitelist';

function ProfileIcon(): JSX.Element {
  const { data: session } = useSession();

  if (!session) {
    return <div />;
  }

  const user = whiteList[session.user?.email || 'default'];
  const alias = user?.alias ?? '未知';
  const avatar = <Avatar alt={alias}>{alias}</Avatar>;

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
