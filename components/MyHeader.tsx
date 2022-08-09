import * as React from 'react';
import {
  Header,
  Group,
  Text,
  Anchor,
} from '@mantine/core';
import { useSession } from 'next-auth/react';

import ProfileIcon from './ProfileIcon';

function MyHeader(): JSX.Element {
  const { data: session } = useSession();

  const userComponent = session
    ? <ProfileIcon />
    : <Anchor href='/api/auth/signin'>登录</Anchor>

  return (
    <Header height={80} p="xl">
      <Group position="apart" align="center">
        <Text size="xl" weight={1000}>世羽全家桶！</Text>
        { userComponent }
      </Group>
    </Header>
  );
}

export default MyHeader;
