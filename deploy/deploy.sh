#!/bin/bash

mkdir -p ~/.ssh
# echo "$SSH_PRIVATE_KEY" | sed 's/\\n/\n/g' > ~/.ssh/id_rsa
# chmod 600 ~/.ssh/id_rsa

ssh-keyscan -H 35.209.10.171 >> ~/.ssh/known_hosts

chmod 600 ./deploy/github_actions01
echo "SSH Test"
ssh -vvv -i ./deploy/github_actions01 -o "StrictHostKeyChecking=no" -tt github_actions_01@35.209.10.171

# echo "Deploying to ${SSH_USER}@${SSH_HOST}..."
# # 把專案程式碼複製到遠端 VPS
# scp -r ./deploy/* ${SSH_USER}@${SSH_HOST}:/web/policyholders/

# if [ $? -ne 0 ]; then
#     echo "Error: SCP failed"
#     exit 1
# fi

# echo "Files copied successfully!"