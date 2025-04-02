#!/bin/bash
source /web/policyholders/.env
echo "test: ${TEST}"
echo "usr: ${DOCKER_USERNAME}"
echo "pwd: ${DOCKER_PASSWORD}"

# docker pull
echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
docker pull $DOCKER_USERNAME/policyholders:latest

# # 1. 檢查 Docker network 是否存在，若不存在則建立
# NETWORK_NAME="my_network"
# docker network inspect $NETWORK_NAME > /dev/null 2>&1
# if [ $? -ne 0 ]; then
#     echo "Network $NETWORK_NAME does not exist. Creating it now..."
#     docker network create $NETWORK_NAME
# else
#     echo "Network $NETWORK_NAME already exists. Skipping creation."
# fi

# # 2. 拉取 Oracle DB 的 Docker image
# echo "Pulling Oracle DB Docker image..."
# docker pull rollernaut/oracle19c:latest
# if [ $? -ne 0 ]; then
#     echo "Error: Failed to pull oracle db image"
#     exit 1  # 停止腳本執行
# fi

# # 3. 使用 docker-compose 啟動 Oracle DB 容器
# echo "Starting Oracle DB container..."
# docker-compose -f deploy/db/docker-compose.yml up -d
# if [ $? -ne 0 ]; then
#     echo "Error: Failed to establish oracle db"
#     exit 1  # 停止腳本執行
# fi