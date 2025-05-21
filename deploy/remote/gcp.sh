#!/bin/bash
source deploy/.env

# 使用 docker-compose 啟動 postgresql & Policyholders 容器
echo "Starting Policyholders container..."
docker-compose -f deploy/remote/docker-compose.yml --env-file deploy/.env up -d
if [ $? -ne 0 ]; then
    echo "Error: Failed to docker compose"
    exit 1  # 停止腳本執行
fi

echo "Setup completed successfully!"
