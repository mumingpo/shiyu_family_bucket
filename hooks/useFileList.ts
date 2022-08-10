import useSWR from 'swr';

import useUser from './useUser';

import clientApi from '../clientApi';

function useFileList() {
  const { user, auth } = useUser();

  return useSWR(
    '/fileList',
    async () => {
      if (user.isLabMember) {
        return clientApi.listBucket(auth);
      }
      return clientApi.getSampleBucketList();
    },
    {
      // 5 minutes
      refreshInterval: 5 * 60 * 1000,
    },
  );
}

export default useFileList;
