<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description
一個簡易的api server，用於管理保戶與保單的新增/修改/查詢功能。


根據不同branch使用不同工具進行開發:

master 
  1. typescript
  2. nestjs
  3. GraphQL
  4. Apollo Server
  5. Oracle

ts-graphql
  1. typescript
  2. tsx
  3. Koa
  4. GraphQL
  5. Apollo Server
  6. type-graphql
  7. Oracle

js-RESTful
  1. javascript
  2. express
  3. RESTful
  4. Oracle



## Project setup

```bash
$ npm install
```

## Init env
在根目錄創建.env檔案，並填入以下資料
```
ORACLE_USER=root
ORACLE_PASSWORD=root
ORACLE_CONNECT_STRING=127.0.0.1:1521/DEV
```


## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```


### 快速產生GraphQL API Doc
#### 方法1
先安裝SpectaQL
```
  npx spectaql
```

設定config檔 spectaql.yml

```
introspection:
  // schema 路徑
  schemaFile: "./schema.graphql"

info:
  title: "sample doc"
  description: "..."

servers:
  - url: "http://localhost:3000"

// 輸出api doc路徑
output:
  format: "html"
  targetDir: "./spectaql-output"

```

根據schema產生api doc
```
npx spectaql spectaql.yml 
```
#### 方法2
使用 graphdoc 透過 schema 快速產生 apidoc
```
graphdoc -s ./schema.graphql -o ./graphdoc
```