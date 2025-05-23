#!/bin/bash
source deploy/.env
cat deploy/.env

echo "Building Policyholders Docker image..."
docker build --progress=plain -f deploy/Dockerfile -t policyholders .
if [ $? -ne 0 ]; then
    echo "Error: Failed to docker build policyholders"
    exit 1  # 停止腳本執行
fi

echo "Pushing to Docker Hub"
echo "docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD"
docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD
docker tag policyholders:latest $DOCKER_USERNAME/policyholders:latest
docker push $DOCKER_USERNAME/policyholders:latest

echo "Deploy to ${SSH_USER}@${SSH_HOST}..."
SSH_CMD="ssh -o StrictHostKeyChecking=no ${SSH_USER}@${SSH_HOST}"

# 把專案程式碼複製到遠端 VPS
$SSH_CMD 'rm -rf /web/policyholders'
$SSH_CMD 'mkdir -p /web/policyholders/'
scp -o "StrictHostKeyChecking=no" -r ./deploy ${SSH_USER}@${SSH_HOST}:/web/policyholders

if [ $? -ne 0 ]; then
    echo "Error: SCP failed"
    exit 1
fi

# 遠端登入並執行 gcp.sh
$SSH_CMD << 'EOF'
    cd /web/policyholders/deploy/remote
    chmod +x ./gcp.sh
    ./gcp.sh
EOF