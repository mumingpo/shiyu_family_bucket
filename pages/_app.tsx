import * as React from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { MantineProvider } from '@mantine/core';

import { SessionProvider } from 'next-auth/react';

function App(props: AppProps): JSX.Element {
  const { Component, pageProps: { session, ...pageProps } } = props;

  return (
    <>
      <Head>
        <title>世羽全家桶！</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>

      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
      >
        <SessionProvider session={session}>
          <Component {...pageProps} />
        </SessionProvider>
      </MantineProvider>
    </>
  );
}

export default App;
