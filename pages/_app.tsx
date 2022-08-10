import * as React from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';

import { MantineProvider, ColorSchemeProvider } from '@mantine/core';
import type { ColorScheme } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';

import { SessionProvider } from 'next-auth/react';

function App(props: AppProps): JSX.Element {
  const { Component, pageProps: { session, ...pageProps } } = props;

  const [colorScheme, setColorScheme] = React.useState<ColorScheme>('light');
  const toggleColorScheme = (value?: ColorScheme) => {
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'))
  };

  return (
    <>
      <Head>
        <title>世羽全家桶！</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>


      <SessionProvider session={session}>
        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
          <MantineProvider
              withGlobalStyles
              withNormalizeCSS
            >
              <NotificationsProvider>
                <ModalsProvider>
                  <Component {...pageProps} />
                </ModalsProvider>
              </NotificationsProvider>
            </MantineProvider>
        </ColorSchemeProvider>
      </SessionProvider>
    </>
  );
}

export default App;
