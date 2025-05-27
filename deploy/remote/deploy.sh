#!/bin/bash
source deploy/.env

# 1. GitHub Actions bot 設定身份
git config --global user.name "github-actions[bot]"
git config --global user.email "github-actions[bot]@users.noreply.github.com"

# 改 remote，用 GITHUB_TOKEN 認證
git remote set-url origin "https://x-access-token:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git"

# 2. 更新版號
echo "Start to update versions"
LAST_VERSION=$(npm pkg get version | jq -r .)
VERSION=$(npm version patch)
if [ $? -ne 0 ]; then
    echo "Error: Failed to update version"
    exit 1
fi
git push origin

echo "update version from($LAST_VERSION) to($VERSION)"
# 將新版號寫入env
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
echo "docker login $DOCKER_USERNAME"
docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD
docker tag policyholders:$VERSION $DOCKER_USERNAME/policyholders:$VERSION
docker push $DOCKER_USERNAME/policyholders:$VERSION

if [ $? -ne 0 ]; then
    echo "Error: Failed to push to docker hub"
    exit 1  # 停止腳本執行
fi

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