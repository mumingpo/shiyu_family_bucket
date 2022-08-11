import OSS from 'ali-oss';

import sampleData from './sampleData';
import type { FileDescriptor } from './types';

interface ClientApi {
  getSampleBucketList: () => Promise<Array<FileDescriptor>>,
  listBucket: (client: OSS) => Promise<Array<FileDescriptor>>,
  getObjectUrl: (client: OSS, objKey: string) => string,
  putObject: (client: OSS, objKey: string, file: File) => Promise<void>,
  deleteObject: (client: OSS, objKey: string) => Promise<void>,
}

// TODO: Error Handling
const clientApi: ClientApi = {
  getSampleBucketList: async () => {
    return sampleData;
  },

  // TODO: when things get too large, read truncated and marker
  // https://github.com/ali-sdk/ali-oss#listquery-options
  listBucket: async (client) => {
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

  getObjectUrl: (client, objKey) => {
    const url = client.signatureUrl(objKey, {
      response: {
        "content-disposition": `attachment; filename=${encodeURIComponent(objKey)}.zip`
      },
    });
    
    return url;
  },

  putObject: async (client, objKey, file) => {
    // timeout 2 hours
    await client.put(objKey, file, { timeout: 2 * 60 * 60 * 1000 });
  },

  deleteObject: async (client, objKey) => {
    await client.delete(objKey);
    // await client.deleteMulti([objKey]);
  },
};

export default clientApi;
