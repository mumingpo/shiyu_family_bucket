import * as React from 'react';
import { AppShell } from '@mantine/core';

import MyHeader from './MyHeader';

type ComponentProps = {
  children: JSX.Element | JSX.Element[],
};

function Layout(props: ComponentProps): JSX.Element {
  const { children } = props;
  const [navbarOpened, setNavbarOpened] = React.useState(false);
  const [burger, setBurger] = React.useState<HTMLButtonElement | null>(null);

  return (
    <AppShell
      navbarOffsetBreakpoint="sm"
      fixed
      padding={0}
      header={<MyHeader />}
      sx={(theme) => ({
        main: {
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
          width: '100%',
          height: '100%',
        },
      })}
    >
      { children }
    </AppShell>
  );
}

export default Layout;