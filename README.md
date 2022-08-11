# 世羽全家桶! (shiyu family bucket)

[访问主站请点我](https://www.shiyuquanjiatong.com/)

一个用阿里云存储的简单的文件共享网站。

## 架构

这个项目由三个部分组成:
- 前端：通过[Mantine](https://mantine.dev/) + [Next.js](https://nextjs.org/)开发并deploy的react网站。
- 后端：通过[Vercel serverless functions](https://vercel.com/docs/concepts/functions#serverless-functions)用[next-auth](https://next-auth.js.org/)处理身份验证和[STS身份](https://www.alibabacloud.com/help/zh/resource-access-management/latest/what-is-sts)颁发的请求。
- 云存储：用STS身份通过[阿里云OSS]进行文件I/O操作。

此外，这个项目还用了三个额外的服务：
- AWS Route 53: 域名注册与DNS解析。
- [Upstash Redis](https://upstash.com/)：用于临时存储邮箱登录的token信息。（session信息通过jwt存储在cookie里面）
- [Sendgrid](https://sendgrid.com/)：用于发送登录邮件。

## 如何deploy

### 下载代码

需要Node16（其他版本未测试）。

```bash
git clone git@github.com:mumingpo/shiyu_family_bucket.git
cd shiyu_family_bucket
yarn install
```

如想要有自己的version control, 开个fork就行。

### 本地运行

`npm run dev`

### 后端设置

#### 设置信任用户

从`.env.local.template`创建`.env.local`，并且记录云架构/配置部分所需的环境变量。如需引用其他的环境变量，请在`configs.ts`里面加进去并且集中管理。

注：默认环境变量在前端是看不到的。如需前端能看到的环境变量，请把变量名加上`NEXT_PUBLIC_`的前缀([Next.js 文档](https://nextjs.org/docs/basic-features/environment-variables))。

通过`whitelist.ts.template`里面设置`{ '成员昵称': [成员邮箱1, 成员邮箱2, ...] }`的方式设置信任用户。`admins`将拥有r/w权限。`members`将拥有readonly权限。`nonMembers`只能看到`sampleData.ts`里面的内容。

注：必须有一个邮箱='default'的通用用户用于处理没有通过身份验证的人。

### 云架构/配置

#### Vercel

去[Vercel](https://vercel.com/)申请账号，下载Vercel CLI登录，即可享（bai）用（piao）Vercel优质的网页CDN和serverless后端服务。

#### 阿里云对象存储（OSS）设置（baipiao不能，呜呜呜）

本应用已包括针对阿里云OSS的接口。请如下设置好OSS Bucket。

1. 创建Bucket。在“权限管理>跨域设置”下：
1. 1. 允许来源里设好主站网站。（懒人可以直接填“*”）
1. 2. 允许全五项(HEAD/GET/PUT/POST/DELETE)
1. 3. 允许headers填“*”
1. 4. 暴露headers填“ETag”
2. 请按照[这个教程](https://www.alibabacloud.com/help/zh/resource-access-management/latest/use-an-sts-token-for-authorizing-a-mobile-app-to-access-alibaba-cloud-resources?spm=a2c63.p38356.0.0.7e2060ccsMQDjf#concept-tdn-n2k-xdb)去设置好两个RAM Role（只读/读写），以及服务器有assumeRole功能的RAM User。
3. 在`.env.local`里面记录下相应的接口名，bucket名，以及用户id/secret/arn。

#### 非阿里云存储设置（可选）

国内用户可以在几家云服务（阿里云，华为云，等等）之间选择一款适合自己需求的云存储服务。如果想用别的云服务请修改`clientApi.ts`（I/O接口），`components/UserContextProvider.tsx`（向serverless function请求并缓存credentials），以及`pages/api/sts/authInfo.ts`（作为serverless function处理用户credentials的请求）里面的内容，并修改`configs.ts`和环境变量。

#### Upstash Redis设置

本应用已包括针对Upstash Redis的接口。请如下享（bai）用（piao）Upstash Redis免费的存储空间。

1. 申请Upstash账号。
2. 创建默认数据库（应该是自动给你创建好的）？
3. 将相应信息放到`env.local`里面

#### SMTP设置

在`.env.local`里面设置邮件发送服务器。任何[已知可用nodemailer](http://nodemailer.com/smtp/well-known/)的SMTP服务都不会有问题。

本项目默认使（bai）用（piao）[Sendgrid](https://sendgrid.com/)。如想使用请参照其教程进行注册和设置。

#### OAuth提供商设置（可选）

本项目默认使用邮件登录所以需要一个数据库来提供存存储/一个SMTP服务器提供发送。如果想使用OAuth登录/不想使用（数据库+SMTP服务器），可以按照[next-auth](https://next-auth.js.org/configuration/providers/oauth)里面针对不同providers的相应教程进行配置。

### deployment设置

#### 设置环境变量

如果你想用同样的架构，请直接通过`.env.local.template`里面设置好相应的环境变量放在`.env.local`即可。如果你想用其他的服务，请按你的需求修改`.env.local`和`configs.ts`。

注：默认环境变量在前端是看不到的。如需前端能看到的环境变量，请把变量名加上`NEXT_PUBLIC_`的前缀（[Next.js 文档](https://nextjs.org/docs/basic-features/environment-variables)）。

需要设置好`NEXTAUTH_SECRET`环境变量。可以使用`openssl rand -base64 32`来生成一个高强度的production secret。

#### 使用Vercel分配的域名

deploy后上Vercel就能看到Production在用什么域名。可以在Vercel上进行一定程度的配置。

#### 设置私有域名（可选）

如果你想用自己的域名，请：

1. 在Vercel项目的域名配置中填上自己的域名
2. 根据提示在自己的域名提供商出加上CNAME和A的DNS记录。
3. 在`.env.production.local`里面加上相应的`NEXTAUTH_URL`（[说明文档](https://next-auth.js.org/configuration/options#nextauth_url)）。

#### 发布！

`bash deploy.sh`

## 已知bug

将于2202年之前修复（咕）。

- `components/UserContextProvider.tsx`不能有效的缓存并刷新用户的STS身份，导致过量的请求和加载过程。
