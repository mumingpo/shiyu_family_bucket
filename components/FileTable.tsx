import * as React from 'react';
import {
  Text,
  Table,
  ActionIcon,
  Group,
} from '@mantine/core';

import { Trash, Download } from 'tabler-icons-react';

import useSWR from 'swr';

import fileSize from 'filesize';

import clientApi from '../clientApi';
import useUser from '../hooks/useUser';

function FileTable(): JSX.Element {
  const { data } = useSWR('/fileList', clientApi.listBucket);
  const user = useUser();
  
  if (!data) {
    return <Text>没有数据可以显示。</Text>;
  }

  const rows = data.map((dataPoint) => (
    <tr key={dataPoint.key}>
      <td>{dataPoint.key}</td>
      <td>{fileSize(dataPoint.size)}</td>
      <td>{dataPoint.lastModified.toLocaleString()}</td>
      <td>
        <Group>
          {!(user.isLabMember) || <ActionIcon><Download /></ActionIcon>}
          {!(user.isShiyu) || <ActionIcon><Trash /></ActionIcon>}
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
