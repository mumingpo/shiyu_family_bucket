import * as React from 'react';
import {
  Header,
  Group,
  Text,
  Anchor,
  ActionIcon,
  useMantineColorScheme,
} from '@mantine/core';
import { useSession } from 'next-auth/react';

import { Sun, MoonStars } from 'tabler-icons-react';

import ProfileIcon from './ProfileIcon';

function MyHeader(): JSX.Element {
  const { data: session } = useSession();

  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  const userComponent = session
    ? <ProfileIcon />
    : <Anchor href='/api/auth/signin'>登录</Anchor>

  return (
    <Header height={80} p="xl">
      <Group position="apart" align="center">
        <Text size="xl" weight={1000}>世羽全家桶！</Text>
        <Group>
          { userComponent }
          <ActionIcon onClick={() => { toggleColorScheme(); }}>
            { colorScheme === 'light' ? <Sun /> : <MoonStars />}
          </ActionIcon>
        </Group>
      </Group>
    </Header>
  );
}

export default MyHeader;
