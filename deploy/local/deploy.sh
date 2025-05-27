#!/bin/bash
source .env
# 此為部署在 local 上的流程，僅做留存

# 1. 複製env檔
echo "Starting copy env file..."
cp .env deploy/
if [ $? -ne 0 ]; then
    echo "Error: Failed to copy .env file to deploy/"
    exit 1  # 停止腳本執行
fi

# 2. 更新版號
echo "Start to update versions"
LAST_VERSION=$(npm pkg get version | jq -r .)
VERSION=$(npm version patch)
echo "update version from($LAST_VERSION) to($VERSION)"
# 將新版號寫入env
echo "VERSION=$VERSION" >> deploy/.env

# 3. 使用 docker-compose 啟動 Policyholders 容器
echo "Starting Policyholders container..."
docker-compose -f deploy/local/docker-compose.yml --env-file deploy/.env up -d
if [ $? -ne 0 ]; then
    echo "Error: Failed to start policyholders"
    exit 1  # 停止腳本執行
fi

echo "Setup completed successfully!"
