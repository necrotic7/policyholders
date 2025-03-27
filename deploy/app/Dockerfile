# docker build  --platform linux/amd64 -f deploy/Dockerfile -t policyholders .
# 使用 Oracle 官方的 Oracle Linux 映像作為基礎映像
FROM ghcr.io/oracle/oraclelinux7-instantclient:19

# 顯示 LD_LIBRARY_PATH
RUN echo $LD_LIBRARY_PATH

# 安裝 Node.js
RUN curl -sL https://rpm.nodesource.com/setup_16.x | bash
RUN yum install nodejs -y

# 設定工作目錄
WORKDIR /app

# 複製配置
COPY *.json ./
# COPY .env ./

# 安裝 Node 依賴
RUN npm install

# 複製應用程式源碼
COPY ./src .

# 編譯 TypeScript 程式
RUN npm run build

# 開放 Port (假設是 3000)
EXPOSE 3000

# 設定 Oracle Instant Client 的環境變數
# ENV LD_LIBRARY_PATH=/usr/lib/oracle/19.8/client64/lib:$LD_LIBRARY_PATH
# ENV PATH=/usr/lib/oracle/19.8/client64/bin:$PATH

# 啟動應用
CMD ["npm", "run", "start:prod"]
