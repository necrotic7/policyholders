#!/bin/bash
echo "Deploy to ${SSH_USER}@${SSH_HOST}..."
SSH_CMD="ssh -o StrictHostKeyChecking=no ${SSH_USER}@${SSH_HOST}"

echo "DOCKER_USERNAME=${DOCKER_USERNAME}" > ./deploy/.env
echo "DOCKER_PASSWORD=${DOCKER_PASSWORD}" >> ./deploy/.env

# 把專案程式碼複製到遠端 VPS
$SSH_CMD 'mkdir -p /web/policyholders/'
scp -o "StrictHostKeyChecking=no" -r ./deploy ${SSH_USER}@${SSH_HOST}:/web/policyholders

if [ $? -ne 0 ]; then
    echo "Error: SCP failed"
    exit 1
fi

# 遠端登入並執行 gcp.sh
$SSH_CMD << 'EOF'
    cd /web/policyholders/deploy/
    chmod +x ./gcp.sh
    ./gcp.sh
EOF