import * as React from 'react';
import type { NextPage } from 'next';

import {
  Stack,
  ScrollArea,
  Group,
  Button,
  Title,
  Text,
  TextInput,
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
import renderIf from '../utils/renderIf';

const Home: NextPage = () => {
  const { height, ref } = useHeightToBottomOfViewport();
  const { user, mutateAuth } = useUser();
  const { isValidating, error, mutate: mutateFileList } = useFileList();
  const [query, setQuery] = React.useState('');

  const refreshButton = (
    <Button
      leftIcon={<Refresh />}
      onClick={async () => {
        await mutateAuth();
        mutateFileList();
      }}
    >
      更新列表与身份信息
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
            { renderIf(refreshButton, user.type !== 'nonMember') }
            { renderIf(uploadButton, user.type === 'admin') }
          </Group>
        </Group>
        { renderIf(<Text color="red" m="xl">{`${error}`}</Text>, !!error) }
        <TextInput
          label="搜索"
          placeholder="按文件名来搜索"
          value={query}
          onChange={(event) => { setQuery(event.currentTarget.value); }}
          width="100%"
          mx="xl"
        />
        <ScrollArea p="xl" style={{ height: '100%', flex: '1 1 0' }}>
          <FileTable query={query} />
        </ScrollArea>
      </Stack>
    </Layout>
  );
}

export default Home;
