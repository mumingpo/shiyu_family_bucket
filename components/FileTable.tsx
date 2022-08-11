import * as React from 'react';
import {
  Text,
  Table,
  ActionIcon,
  Group,
} from '@mantine/core';

import { Download } from 'tabler-icons-react';

import fileSize from 'filesize';

import clientApi from '../clientApi';
import useUser from '../hooks/useUser';
import useFileList from '../hooks/useFileList';
import renderIf from '../utils/renderIf';
import FileDeletionButton from './FileDeletionButton';

type ComponentProps = {
  query: string,
};

function FileTable(props: ComponentProps): JSX.Element {
  const { query } = props;
  const { user, ossClient } = useUser();
  const { data: fileList } = useFileList();
  
  if (!fileList) {
    return <Text>没有数据可以显示。</Text>;
  }

  const rows = fileList
    .filter((fileDescriptor) => (fileDescriptor.key.includes(query)))
    .map((fileDescriptor) => (
      <tr key={fileDescriptor.key}>
        <td>{fileDescriptor.key}</td>
        <td>{fileSize(fileDescriptor.size)}</td>
        <td>{fileDescriptor.lastModified.toLocaleString()}</td>
        <td>
          <Group>
            { renderIf((
              <ActionIcon
                component="a"
                href={ossClient ? clientApi.getObjectUrl(ossClient, fileDescriptor.key) : '#'}
                download={`${fileDescriptor.key}.zip`}
              >
                <Download />
              </ActionIcon>
            ), user.type !== 'nonMember') }
            { renderIf((
              <FileDeletionButton
                ossClient={ossClient}
                objKey={fileDescriptor.key}
              />
            ), user.type === 'admin')}
          </Group>
        </td>
      </tr>
    ));

  return (
    <Table striped highlightOnHover>
      <thead>
        <tr>
          <th>文件key</th>
          <th>文件大小</th>
          <th>最后更改时间</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        {rows}
      </tbody>
    </Table>
  );
}

export default FileTable;
