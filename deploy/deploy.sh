#!/bin/bash
echo "Deploy to ${SSH_USER}@${SSH_HOST}..."
SSH_CMD="ssh -o StrictHostKeyChecking=no ${SSH_USER}@${SSH_HOST}"

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
    export DOCKER_USERNAME="${DOCKER_USERNAME}"
    export DOCKER_PASSWORD="${DOCKER_PASSWORD}"
    export TEST="123"
    chmod +x ./gcp.sh
    ./gcp.sh
EOF