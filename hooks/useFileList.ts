import useSWR from 'swr';

import useUser from './useUser';

import clientApi from '../clientApi';

function useFileList() {
  const { user, ossClient } = useUser();

  return useSWR(
    '/fileList',
    async () => {
      if (user.type !== 'nonMember' && ossClient) {
        return clientApi.listBucket(ossClient);
      }
      return clientApi.getSampleBucketList();
    },
    {
      // 5 minutes
      refreshInterval: 5 * 60 * 1000,
      dedupingInterval: 5 * 60 * 1000,
    },
  );
}

export default useFileList;
