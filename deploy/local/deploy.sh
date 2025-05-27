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

# 2. 取得版號
echo "Start to get versions"
# 用ssh clone repo時，要先打開ssh-agent
# eval "$(ssh-agent -s)"
# ssh-add ~/.ssh/id_rsa

# 抓 git tags
git fetch --tags

# 判斷有沒有 tag，沒有就預設 v0.0.0
if git tag | grep -q .; then
  latestTag=$(git describe --tags "$(git rev-list --tags --max-count=1)")
else
  latestTag="v0.0.0"
fi

echo "最新 tag：$latestTag"

# 升版號：最後一位 +1（v1.2.3 -> v1.2.4）
VERSION=$(echo "$latestTag" | awk -F. -v OFS=. '{$NF += 1; print}')

echo "新 tag：$VERSION"

echo "VERSION=$VERSION" >> deploy/.env

# 3. 使用 docker-compose 啟動 Policyholders 容器
echo "Starting Policyholders container..."
docker-compose -f deploy/local/docker-compose.yml --env-file deploy/.env up -d
if [ $? -ne 0 ]; then
    echo "Error: Failed to start policyholders"
    exit 1  # 停止腳本執行
fi

echo "Setup completed successfully!"
