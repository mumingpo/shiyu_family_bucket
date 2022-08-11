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

export type Admin<A extends string = string> = { alias: A, type: 'admin' };
export type Member<A extends string = string> = { alias: A, type: 'member' };
export type NonMember<A extends string = string> = { alias: A, type: 'nonMember' };
export type User = Admin | Member | NonMember;
