import * as React from 'react';
import {
  Text,
  Table,
  ActionIcon,
  Group,
} from '@mantine/core';
import { closeAllModals, openConfirmModal } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';

import { Trash, Download, CircleCheck, CircleX } from 'tabler-icons-react';

import fileSize from 'filesize';

import clientApi from '../clientApi';
import useUser from '../hooks/useUser';
import useFileList from '../hooks/useFileList';

function FileTable(): JSX.Element {
  const { user, ossClient } = useUser();
  const { data: fileList } = useFileList();
  
  if (!fileList) {
    return <Text>没有数据可以显示。</Text>;
  }

  const rows = fileList.map((fileDescriptor) => (
    <tr key={fileDescriptor.key}>
      <td>{fileDescriptor.key}</td>
      <td>{fileSize(fileDescriptor.size)}</td>
      <td>{fileDescriptor.lastModified.toLocaleString()}</td>
      <td>
        <Group>
          {!(user.isLabMember) || (
            <ActionIcon
              component="a"
              href={ossClient ? clientApi.getObjectUrl(ossClient, fileDescriptor.key) : '#'}
              download={`${fileDescriptor.key}.zip`}
            >
              <Download />
            </ActionIcon>
          )}
          {!(user.isShiyu) || (
            <ActionIcon
              onClick={() => {
                openConfirmModal({
                  title: '删除文件',
                  children: <Text>真的要删除这个文件么？（才怪！根本删除不掉！为什么同样在js sdk里面list/get/put都可以就delete不行！）</Text>,
                  labels: { confirm: '删除（会发送删除请求但收不到回应）', cancel: '取消' },
                  confirmProps: { color: 'red' },
                  onCancel: closeAllModals,
                  onConfirm: () => {
                    closeAllModals();
                    if (!ossClient) {
                      showNotification({
                        title: '文件删除失败！',
                        message: 'ossClient未初始化。',
                        color: 'red',
                        icon: <CircleX />,
                      });
                      return;
                    }
                    clientApi.deleteObject(ossClient, fileDescriptor.key)
                    // fetch(clientApi.getObjectUrl(ossClient, fileDescriptor.key), { method: 'DELETE' })
                      .then(() => {
                        showNotification({
                          title: '文件已删除',
                          message: '世羽羽要记得补回来哦~',
                          icon: <CircleCheck />,
                        });
                      })
                      .catch((error) => {
                        let errorString = error
                          ? `错误名：“${error.name}”, 错误信息：“${error.message}”。`
                          : '发生了未知错误。';
                        if (error?.name === 'AccessDeniedError') {
                          errorString = '你不是世羽！（敲）';
                        }
                        showNotification({
                          title: '文件删除失败！',
                          message: errorString,
                          color: 'red',
                          icon: <CircleX />,
                        });
                      });
                  },
                });
              }}
            >
              <Trash />
            </ActionIcon>
          )}
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
