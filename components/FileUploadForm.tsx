import * as React from 'react';
import {
  Button,
  FileInput,
  Group,
  Stack,
  LoadingOverlay,
  TextInput,
  Text,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { closeAllModals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';

import { CircleCheck, Upload } from 'tabler-icons-react';

import useUser from '../hooks/useUser';
import clientApi from '../clientApi';

type FormValues = {
  objKey: string,
  file: null | File,
};

// https://regex101.com/r/10bH9C/1
const acceptableKeyFormat = /^\p{Script=Hani}+[1-9]\d*$/mu;

function FileUploadForm(): JSX.Element {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const { auth } = useUser();

  const initialValues: FormValues = {
    objKey: '',
    file: null,
  };

  const form = useForm({
    initialValues,
    validate: {
      objKey: (val) => {
        if (!acceptableKeyFormat.test(val)) {
          return '文件名必须是“名字123”这样的格式！';
        }
        return null;
      },
      file: (val: File | null) => {
        if (val === null) {
          return '忘选择需要上传的文件了！（敲）';
        }
        return null;
      }
    },
  });

  const handleSubmit = (formValues: typeof form.values) => {
    setLoading(true);
    setError(null);

    const { objKey, file } = formValues;
    
    // file is not null due to validation,
    // but just put it here to pacify typescript
    if (file === null) {
      setLoading(false);
      setError('没有选择文件！');
      return;
    }

    clientApi.putObject(auth, objKey, file)
      .then(() => {
        setLoading(false);
        closeAllModals();
        showNotification({
          title: '上传成功！',
          message: '感谢世羽！快去通知大家吧。(记得叫上慕茗！）',
          icon: <CircleCheck />,
        });
      })
      .catch((error) => {
        setLoading(false);
        let errorString = error
          ? `上传失败！错误名：“${error.name}”, 错误信息：“${error.message}”。`
          : '发生了未知错误。';
        if (error?.name === 'AccessDeniedError') {
          errorString = '你不是世羽！（敲）';
        }
        setError(errorString);
      });
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)} autoComplete="off">
      <LoadingOverlay visible={loading} />
      <Stack m="xl" spacing="md">
        {(!error) || (
          <Text color="red">{error}</Text>
        )}
        <TextInput
          required
          label="文件名"
          placeholder="慕茗123"
          {...form.getInputProps('objKey')}
        />
        <FileInput
          required
          label="上传文件"
          placeholder="慕茗123.zip"
          {...form.getInputProps('file')}
        />
      </Stack>
      <Group position="right" m="xl">
        <Button
          type="submit"
          leftIcon={<Upload />}
        >
          上传
        </Button>
      </Group>
    </form>
  );
}

export default FileUploadForm;
