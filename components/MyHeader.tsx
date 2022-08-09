import {
  Header,
  Group,
  Text,
  Anchor,
} from '@mantine/core';
import { useSession } from 'next-auth/react';

import ProfileIcon from './ProfileIcon';

function MyHeader() {
  const { data: session } = useSession();

  const userComponent = session
    ? <ProfileIcon />
    : <Anchor href='/api/auth/signin'>登录</Anchor>

  return (
    <Header height={80}>
      <Group position="apart" align="center">
        <Text>世羽全家桶！</Text>
        { userComponent }
      </Group>
    </Header>
  );
}

export default MyHeader;
