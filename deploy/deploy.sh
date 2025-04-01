#!/bin/bash
echo "Deploy to ${SSH_USER}@${SSH_HOST}..."

# # 把專案程式碼複製到遠端 VPS
scp -r ./deploy/* ${SSH_USER}@${SSH_HOST}:/web/policyholders/deploy/

if [ $? -ne 0 ]; then
    echo "Error: SCP failed"
    exit 1
fi

# 遠端登入並執行 deploy.sh
ssh ${SSH_USER}@${SSH_HOST} << 'EOF'
    cd /web/policyholders/
    ls
EOF