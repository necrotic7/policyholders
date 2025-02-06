## cmd
```node src/index.js```
## 注意事項
  需先執行migrate資料夾中的sql以建立測試資料
## 測試結構
                          1 (Alice)
                        /          \
                2 (Bob)         3 (Charlie)
                /      \         /         \
        4 (David)    5 (Eve)  6 (Frank)  7 (Grace)
           /   \             / 
     8(Henry) 9(Ivy)     11(Kim)
               /
            10(Jack)
        
## typescript 環境
使用 tsx（esbuild-based TypeScript runtime）：

  1.直接執行 TypeScript，無需額外編譯
  
  2.支援 ESM（不需 require）
  
  3.不強制 .js 副檔名

安裝tsx

```npm i -g tsx```

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
  module: "ESNext" → 使用最新 ESM
  moduleResolution: "bundler" → 允許省略 .js（這是 tsx 的特性）
```
{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true
  }
}
```
