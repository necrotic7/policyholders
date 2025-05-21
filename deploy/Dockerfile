# docker build  --platform linux/amd64 -f deploy/Dockerfile -t policyholders .
FROM node:21.7.3

# 設定工作目錄
WORKDIR /app

# 複製配置
COPY . .
RUN ls -al

# 安裝 Node 依賴
RUN npm install
RUN npx tsc --showConfig
RUN npx tsc --project tsconfig.build.json --showConfig

# 編譯 TypeScript 程式
RUN npm run build

# 開放 Port
EXPOSE 10300

# 啟動應用
CMD ["npm", "run", "start:prod"]
