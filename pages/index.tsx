import * as React from 'react';
import type { NextPage } from 'next';

import {
  Stack,
  ScrollArea,
  Group,
  Button,
  Title,
  Text,
  LoadingOverlay,
} from '@mantine/core';

import { Refresh, Upload } from 'tabler-icons-react';
import useSWR from 'swr';

import Layout from '../components/Layout';
import FileTable from '../components/FileTable';

import useUser from '../hooks/useUser';
import useHeightToBottomOfViewport from '../hooks/useHeightToBottomOfViewport';

import clientApi from '../clientApi';

const Home: NextPage = () => {
  const { height, ref } = useHeightToBottomOfViewport();
  const user = useUser();
  const { error, isValidating, mutate } = useSWR('/fileList', clientApi.listBucket);

  return (
    <Layout>
      <LoadingOverlay visible={isValidating} />
      <Stack
        sx={(theme)=>({
          height,
          margin: 'auto',
          maxWidth: 1200,
          backgroundColor: theme.white,
        })}
        p='xl'
        ref={ref}
      >
        <Group position="apart">
          <Title order={2}>我想要一份世羽！</Title>
          <Group>
            { !(user.isLabMember) || <Button leftIcon={<Refresh />}>更新列表</Button> }
            { !(user.isShiyu) || <Button leftIcon={<Upload />} color="green">上传</Button> }
          </Group>
        </Group>
        { !(error) || <Text color="red" m="xl">{error}</Text>}
        <ScrollArea p="xl" style={{ height: '100%', flex: '1 1 0' }}>
          <FileTable />
        </ScrollArea>
      </Stack>
    </Layout>
  );
}

export default Home;
