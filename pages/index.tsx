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
import { openModal } from '@mantine/modals';

import { Refresh, Upload } from 'tabler-icons-react';

import Layout from '../components/Layout';
import FileTable from '../components/FileTable';
import FileUploadForm from '../components/FileUploadForm';

import useUser from '../hooks/useUser';
import useFileList from '../hooks/useFileList';
import useHeightToBottomOfViewport from '../hooks/useHeightToBottomOfViewport';

const Home: NextPage = () => {
  const { height, ref } = useHeightToBottomOfViewport();
  const { user } = useUser();
  const { isValidating, error, mutate } = useFileList();

  const refreshButton = (
    <Button
      leftIcon={<Refresh />}
      onClick={() => { mutate(); }}
    >
      更新列表
    </Button>
  );

  const uploadButton = (
    <Button
      leftIcon={<Upload />}
      color="green"
      onClick={() => openModal({ title: '上传文件', children: <FileUploadForm /> })}
    >
      上传
    </Button>
  );

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
            { !(user.isLabMember) || refreshButton }
            { !(user.isShiyu) || uploadButton }
          </Group>
        </Group>
        { !(error) || <Text color="red" m="xl">{`${error}`}</Text>}
        <ScrollArea p="xl" style={{ height: '100%', flex: '1 1 0' }}>
          <FileTable />
        </ScrollArea>
      </Stack>
    </Layout>
  );
}

export default Home;
