#!/bin/bash

# 1. 檢查 Docker network 是否存在，若不存在則建立
NETWORK_NAME="my_network"
docker network inspect $NETWORK_NAME > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "Network $NETWORK_NAME does not exist. Creating it now..."
    docker network create $NETWORK_NAME
else
    echo "Network $NETWORK_NAME already exists. Skipping creation."
fi

# 2. 拉取 Oracle DB 的 Docker image
echo "Pulling Oracle DB Docker image..."
docker pull rollernaut/oracle19c:latest
if [ $? -ne 0 ]; then
    echo "Error: Failed to pull oracle db image"
    exit 1  # 停止腳本執行
fi

# 3. 使用 docker-compose 啟動 Oracle DB 容器
echo "Starting Oracle DB container..."
docker-compose -f deploy/db/docker-compose.yml up -d
if [ $? -ne 0 ]; then
    echo "Error: Failed to establish oracle db"
    exit 1  # 停止腳本執行
fi

# 等待 Oracle DB 容器變為健康狀態
TIMEOUT=600  # 設定 10 分鐘為 timeout 時間
START_TIME=$(date +%s)

until [ "$(docker inspect --format '{{.State.Health.Status}}' oracle)" == "healthy" ]; do
    CURRENT_TIME=$(date +%s)
    ELAPSED_TIME=$((CURRENT_TIME - START_TIME))

    # 檢查是否超過了 timeout 時間
    if [ $ELAPSED_TIME -ge $TIMEOUT ]; then
        echo "Timeout reached. Oracle DB did not become healthy in time."
        exit 1  # 超過時間則退出腳本
    fi

    echo "Waiting for container to be healthy..."
    sleep 10  # 每隔10秒檢查一次
done

echo "Oracle DB container is healthy. Proceeding..."

# 進入db容器執行所有 init SQL 腳本
for sql_file in $(docker exec oracle ls /docker-entrypoint-initdb.d); do
    echo "Executing $sql_file"
    docker exec -i oracle bash -c "sqlplus -S sys/system@localhost:1521/ORCLPDB1 as sysdba @/docker-entrypoint-initdb.d/${sql_file} <<EOF
EXIT;
EOF"
done

echo "SQL scripts executed successfully."

# 4. 複製env檔
echo "Starting copy env file..."
cp .env deploy/app/
if [ $? -ne 0 ]; then
    echo "Error: Failed to copy .env file to deploy/app/"
    exit 1  # 停止腳本執行
fi

# 5. Build Policyholders 的 Docker image
echo "Building Policyholders Docker image..."
docker build --platform linux/amd64 -f deploy/app/Dockerfile -t policyholders .
if [ $? -ne 0 ]; then
    echo "Error: Failed to docker build policyholders"
    exit 1  # 停止腳本執行
fi

# 6. 使用 docker-compose 啟動 Policyholders 容器
echo "Starting Policyholders container..."
docker-compose -f deploy/app/docker-compose.yml up -d
if [ $? -ne 0 ]; then
    echo "Error: Failed to start policyholders"
    exit 1  # 停止腳本執行
fi

echo "Setup completed successfully!"
