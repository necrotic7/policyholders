# 讀取 GitHub Actions 傳進來的變數
SSH_PRIVATE_KEY=${SSH_PRIVATE_KEY}
SSH_USER=${SSH_USER}
SSH_HOST=${SSH_HOST}

mkdir -p ~/.ssh
echo "${SSH_PRIVATE_KEY}" > ~/.ssh/id_rsa
chmod 600 ~/.ssh/id_rsa
ssh-keyscan -H ${SSH_HOST} >> ~/.ssh/known_hosts

echo "Deploying to ${SSH_USER}@${SSH_HOST}..."
# 把專案程式碼複製到遠端 VPS
scp -r ./deploy/* ${SSH_USER}@${SSH_HOST}:/web/policyholders/

if [ $? -ne 0 ]; then
    echo "Error: SCP failed"
    exit 1
fi

echo "Files copied successfully!"