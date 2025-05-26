#!/bin/bash
source .env

docker rm -f policyholders

# 使用 docker-compose 啟動 postgresql & Policyholders 容器
echo "Starting Policyholders container..."
docker compose --env-file .env up -d
if [ $? -ne 0 ]; then
    echo "Error: Failed to docker compose"
    exit 1  # 停止腳本執行
fi

echo "Setup completed successfully!"
