<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## Description

一個簡單的 Node.js API Server，負責管理保戶與保單，提供新增、修改、查詢等功能。  

> 🚀 **當前 `master` 分支對應 `06-deploy`**，此版本已支援 Docker 部署。

本專案透過不同分支（branch）來測試各種技術組合，每個分支代表不同的技術演進階段：  

| 分支名稱 | 語言 | API 框架 | API 架構 | 其他 | 說明 |
| --- | --- | --- | --- | --- | --- |
| 01-js-RESTful | JavaScript | Express | RESTful | Oracle | 專案的初始版本 |
| 02-ts | TypeScript | Express | RESTful | Oracle, tsx | 在 01 版基礎上，將語言改為 TypeScript |
| 03-koa | TypeScript | Koa | GraphQL | Oracle, tsx | 在 02 版基礎上，更換 API 框架為 Koa，並改為 GraphQL |
| 04-type-graphql | TypeScript | Koa | GraphQL | Oracle, tsx, type-graphql | 以 03 版為基礎，改用 TypeGraphQL 來定義 GraphQL Schema |
| 05-nestjs | TypeScript | NestJS | GraphQL | Oracle, nestjs/graphql, nestjs/apollo | 在 04 版基礎上，改用 NestJS 作為 API 框架，並使用 NestJS 相關套件來撰寫與編譯 Schema |
| 06-deploy | TypeScript | NestJS | GraphQL | Oracle, nestjs/graphql, nestjs/apollo, Docker | 在 05 版基礎上，新增部署腳本，可透過 Docker 啟動本地 Oracle DB 與 API Server |


# Local Startup

## Project setup

```bash
$ npm install
```

## Init env

在專案根目錄創建.env檔案，並填入以下資料

```
ORACLE_USER=POLICYHOLDERS
ORACLE_PASSWORD=safesync
ORACLE_CONNECT_STRING=//oracle:1521/ORCLPDB1
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

# Local Deploy

直接於專案根目錄執行

```bash
$ ./deploy/deploy.sh
```

### 附錄 快速產生GraphQL API Doc

### 方法1

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
  - url: "<http://localhost:3000>"

// 輸出api doc路徑
output:
  format: "html"
  targetDir: "./spectaql-output"

```

根據schema產生api doc

```
npx spectaql spectaql.yml

```

### 方法2

使用 graphdoc 透過 schema 快速產生 apidoc

```
graphdoc -s ./schema.graphql -o ./graphdoc

```