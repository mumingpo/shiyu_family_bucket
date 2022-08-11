import * as React from 'react';
import {
  Text,
  Table,
  ActionIcon,
  Group,
} from '@mantine/core';
import { useToggle } from '@mantine/hooks';

import { Download } from 'tabler-icons-react';

import fileSize from 'filesize';

import clientApi from '../clientApi';
import useUser from '../hooks/useUser';
import useFileList from '../hooks/useFileList';
import renderIf from '../utils/renderIf';
import FileDeletionButton from './FileDeletionButton';
import TableHeaderUnstyledButton from './TableHeaderUnstyledButton';

type SortOptions = null | 'key' | 'size' | 'lastModified';
type ComponentProps = {
  query: string,
};

function FileTable(props: ComponentProps): JSX.Element {
  const { query } = props;
  const { user, ossClient } = useUser();
  const { data: fileList } = useFileList();

  const [sortBy, setSortBy] = React.useState<SortOptions>(null);
  const [sortDirection, toggleSortDirection] = useToggle(['asc', 'desc'] as const);
  
  if (!fileList) {
    return <Text>没有数据可以显示。</Text>;
  }

  const processed = fileList
    .filter((fileDescriptor) => (fileDescriptor.key.includes(query)));
  
  if (sortBy === 'key') {
    processed.sort((a, b) => (a.key.localeCompare(b.key) * (sortDirection === 'asc' ? 1 : -1)));
  } else if (sortBy === 'size') {
    processed.sort((a, b) => ((a.size - b.size) * (sortDirection === 'asc' ? 1 : -1)));
  } else if (sortBy === 'lastModified') {
    processed.sort((a, b) => ((a.lastModified.getTime() - b.lastModified.getTime()) * (sortDirection === 'asc' ? 1 : -1)));
  }

  const rows = processed
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
          <th>
            <TableHeaderUnstyledButton
              text="文件名"
              columnName="key"
              sortBy={sortBy}
              setSortBy={setSortBy}
              sortDirection={sortDirection}
              toggleSortDirection={toggleSortDirection}
            />
          </th>
          <th>
            <TableHeaderUnstyledButton
              text="文件大小"
              columnName="size"
              sortBy={sortBy}
              setSortBy={setSortBy}
              sortDirection={sortDirection}
              toggleSortDirection={toggleSortDirection}
            />
          </th>
          <th>
            <TableHeaderUnstyledButton
              text="最后更改时间"
              columnName="lastModified"
              sortBy={sortBy}
              setSortBy={setSortBy}
              sortDirection={sortDirection}
              toggleSortDirection={toggleSortDirection}
            />
          </th>
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
