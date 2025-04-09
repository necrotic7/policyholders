#!/bin/bash
# NOTICE: 礙於 gcp 機器限制，無法在遠端上起一個 oracle db，因此僅做 app 部署
source .env

# 1. 檢查 Docker network 是否存在，若不存在則建立
NETWORK_NAME="my_network"
docker network inspect $NETWORK_NAME > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "Network $NETWORK_NAME does not exist. Creating it now..."
    docker network create $NETWORK_NAME
else
    echo "Network $NETWORK_NAME already exists. Skipping creation."
fi

# 4. docker pull Policyholders
echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
docker pull $DOCKER_USERNAME/policyholders:latest

# 5. 使用 docker-compose 啟動 Policyholders 容器
echo "Starting Policyholders container..."
export DOCKER_USERNAME=$DOCKER_USERNAME
docker compose -f app/docker-compose.yml up -d
if [ $? -ne 0 ]; then
    echo "Error: Failed to start policyholders"
    exit 1  # 停止腳本執行
fi

echo "Setup completed successfully!"
