#!/bin/bash

# mkdir -p ~/.ssh
# chmod 700 ~/.ssh
# echo "$SSH_PRIVATE_KEY" > ~/.ssh/id_rsa
# chmod 600 ~/.ssh/id_rsa

ls -l ~/.ssh
# ssh-keyscan -H 35.209.10.171 >> ~/.ssh/known_hosts

echo "Connect to ${SSH_USER}@${SSH_HOST}..."
ssh -v -o "StrictHostKeyChecking=no" -tt ${SSH_USER}@${SSH_HOST}

# # 把專案程式碼複製到遠端 VPS
# scp -r ./deploy/* ${SSH_USER}@${SSH_HOST}:/web/policyholders/

# if [ $? -ne 0 ]; then
#     echo "Error: SCP failed"
#     exit 1
# fi

# echo "Files copied successfully!"