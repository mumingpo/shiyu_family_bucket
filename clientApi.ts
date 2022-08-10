import OSS from 'ali-oss';

import sampleData from './sampleData';
import type { FileDescriptor, AuthInfo } from './types';

function getOssClient(auth: AuthInfo) {
  return new OSS({
    // TODO: implement these
    refreshSTSToken: undefined,
    refreshSTSTokenInterval: undefined,
    ...auth,
  });
} 

interface ClientApi {
  getSampleBucketList: () => Promise<Array<FileDescriptor>>,
  listBucket: (auth: AuthInfo) => Promise<Array<FileDescriptor>>,
  getObjectUrl: (auth: AuthInfo, objKey: string) => string,
  putObject: (auth: AuthInfo, objKey: string, file: File) => Promise<void>,
  deleteObject: (auth: AuthInfo, objKey: string) => Promise<void>,
}

// TODO: Error Handling
const clientApi: ClientApi = {
  getSampleBucketList: async () => {
    return sampleData;
  },

  // TODO: when things get too large, read truncated and marker
  // https://github.com/ali-sdk/ali-oss#listquery-options
  listBucket: async (auth) => {
    const client = getOssClient(auth);
    // FIXME: listV2 is recommended, but it is not type-annotated
    // by @types/ali-oss.
    const res = await client.list({ "max-keys": 100 }, {});
    const { objects } = res;

    const fileList = objects.map((obj) => ({
      key: obj.name,
      lastModified: new Date(obj.lastModified),
      size: obj.size,
    }));
    return fileList;
  },

  getObjectUrl: (auth, objKey) => {
    const client = getOssClient(auth);
    const url = client.signatureUrl(objKey, {
      response: {
        "content-disposition": `attachment; filename=${encodeURIComponent(objKey)}.zip`
      },
    });
    
    return url;
  },

  putObject: async (auth, objKey, file) => {
    const client = getOssClient(auth);
    await client.put(objKey, file, { timeout: 10000 });
  },

  deleteObject: async (auth, objKey) => {
    const client = getOssClient(auth);
    await client.delete(objKey);
  },
};

export default clientApi;
