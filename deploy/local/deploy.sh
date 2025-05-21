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

# 2. 使用 docker-compose 啟動 Policyholders 容器
echo "Starting Policyholders container..."
docker-compose -f deploy/local/docker-compose.yml --env-file deploy/.env up -d
if [ $? -ne 0 ]; then
    echo "Error: Failed to start policyholders"
    exit 1  # 停止腳本執行
fi

echo "Pushing to Docker Hub"
echo "docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD"
docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD
docker tag policyholders:latest $DOCKER_USERNAME/policyholders:latest
docker push $DOCKER_USERNAME/policyholders:latest

echo "Setup completed successfully!"
