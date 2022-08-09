import {
  Header,
  Group,
  Text,
} from '@mantine/core';

function MyHeader() {
  return (
    <Header height={80}>
      <Group position="apart" align="center">
        <Text>世羽全家桶！</Text>
        <Text>Login stuff placeholder.</Text>
      </Group>
    </Header>
  );
}

export default MyHeader;
