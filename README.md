## Description
一個簡易的api server，用於管理保戶與保單的新增/修改/查詢功能。
## cmd
```
npm run dev
```     

### typescript 環境
使用 tsx（esbuild-based TypeScript runtime）：

  1.直接執行 TypeScript，無需額外編譯
  
  2.支援 ESM（不需 require）
  
  3.不強制 .js 副檔名

安裝tsx

```
npm i -g tsx
```

package.json
```
{
  "type": "module",
  "scripts": {
    "dev": "tsx src/index.ts"
  }
}
```

tsconfig.json
```
{
  "compilerOptions": {
    "module": "ESNext", → 使用最新 ESM
    "moduleResolution": "bundler",(或node) → 允許import時省略.js（tsx的特性）
    "strict": true
  }
}
```

### debug設置
launch.json
```
{
    "version": "0.2.0",
    "configurations": [
      {
        "name": "tsx",
        "type": "node",
        "request": "launch",
        "restart": true,
        // Debug current file in VSCode
        "cwd": "${workspaceFolder}/src",
        "program": "${workspaceFolder}/src/index.ts",
    
        /*
         * Path to tsx binary
         * Assuming locally installed
         */
        "runtimeExecutable": "tsx",
    
        /*
         * Open terminal when debugging starts (Optional)
         * Useful to see console.logs
         */
        "console": "integratedTerminal",
        "internalConsoleOptions": "neverOpen",
    
        // Files to exclude from debugger (e.g. call stack)
        "skipFiles": [
            // Node.js internal core modules
            "<node_internals>/**",
    
            // Ignore all dependencies (optional)
            "${workspaceFolder}/node_modules/**",
        ],
    }
    ]
  }
  
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