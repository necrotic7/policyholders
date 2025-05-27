#!/bin/bash
source deploy/.env

# 1. 取得版號
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

# GitHub Actions bot 設定身份
git config --global user.name "github-actions[bot]"
git config --global user.email "github-actions[bot]@users.noreply.github.com"

# 改 remote，用 GITHUB_TOKEN 認證
git remote set-url origin "https://x-access-token:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git"

# 打 tag 並推上去
git tag "$VERSION"
git push origin "$VERSION"

echo "VERSION=$VERSION" >> deploy/.env

# 3. build app
echo "Building Policyholders Docker image..."
docker build --progress=plain -f deploy/Dockerfile -t policyholders:$VERSION .
if [ $? -ne 0 ]; then
    echo "Error: Failed to docker build policyholders"
    exit 1  # 停止腳本執行
fi

# 4. push to docker hub
echo "Pushing to Docker Hub"
echo "docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD"
docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD
docker tag policyholders:$VERSION $DOCKER_USERNAME/policyholders:$VERSION
docker push $DOCKER_USERNAME/policyholders:$VERSION

# 5. 部署到遠端機器 
echo "Deploy to ${SSH_USER}@${SSH_HOST}..."
SSH_CMD="ssh -o StrictHostKeyChecking=no ${SSH_USER}@${SSH_HOST}"

# 把專案程式碼複製到遠端 VPS
$SSH_CMD 'rm -rf /web/policyholders'
$SSH_CMD 'mkdir -p /web/policyholders/'
scp -o "StrictHostKeyChecking=no" -r ./deploy/remote/* ${SSH_USER}@${SSH_HOST}:/web/policyholders
scp -o "StrictHostKeyChecking=no" ./deploy/.env ${SSH_USER}@${SSH_HOST}:/web/policyholders

if [ $? -ne 0 ]; then
    echo "Error: SCP failed"
    exit 1
fi

# 遠端登入並執行 gcp.sh
$SSH_CMD << 'EOF'
    cd /web/policyholders
    chmod +x ./gcp.sh
    ./gcp.sh
EOF