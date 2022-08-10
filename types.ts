export type FileDescriptor = {
  key: string,
  size: number,
  lastModified: Date,
};

export type AuthInfo = {
  accessKeyId: string,
  accessKeySecret: string,
  stsToken: string,
  bucket: string,
  endpoint: string,
};
