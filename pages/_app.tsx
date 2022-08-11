import * as React from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';

import { MantineProvider, ColorSchemeProvider } from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import { NotificationsProvider } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';

import { SessionProvider } from 'next-auth/react';
import UserContextProvider from '../components/UserContextProvider';

function App(props: AppProps): JSX.Element {
  const { Component, pageProps: { session, ...pageProps } } = props;

  const [colorScheme, toggleColorScheme] = useToggle(['light', 'dark'] as const);

  return (
    <>
      <Head>
        <title>世羽全家桶！</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>

      <SessionProvider session={session}>
        <UserContextProvider>
          <ColorSchemeProvider
            colorScheme={colorScheme}
            toggleColorScheme={toggleColorScheme}
          >
            <MantineProvider
              withGlobalStyles
              withNormalizeCSS
              theme={{ colorScheme }}
            >
              <NotificationsProvider>
                <ModalsProvider>
                  <Component {...pageProps} />
                </ModalsProvider>
              </NotificationsProvider>
            </MantineProvider>
          </ColorSchemeProvider>
        </UserContextProvider>
      </SessionProvider>
    </>
  );
}

export default App;
