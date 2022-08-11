import * as React from 'react';
import { ActionIcon, Text } from '@mantine/core';
import { openConfirmModal, closeAllModals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';

import { CircleX, CircleCheck, Trash } from 'tabler-icons-react';

import OSS from 'ali-oss';

import clientApi from '../clientApi';

type ComponentProps = {
  ossClient: OSS | null,
  objKey: string,
};

function failureNotification(msg: string) {
  return {
    title: '文件删除失败！',
    message: msg,
    color: 'red',
    icon: <CircleX />,
  };
}

function FileDeletionButton(props: ComponentProps): JSX.Element {
  const { ossClient, objKey } = props;

  return (
    <ActionIcon
      onClick={() => {
        openConfirmModal({
          title: '删除文件',
          children: <Text>真的要删除这个文件么？</Text>,
          labels: { confirm: '删除', cancel: '取消' },
          confirmProps: { color: 'red' },
          onCancel: closeAllModals,
          onConfirm: () => {
            closeAllModals();
            if (!ossClient) {
              showNotification(failureNotification('ossClient未初始化。'));
              return;
            }
            clientApi.deleteObject(ossClient, objKey)
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
                showNotification(failureNotification(errorString));
              });
          },
        });
      }}
    >
      <Trash />
    </ActionIcon>
  );
}

export default FileDeletionButton;
