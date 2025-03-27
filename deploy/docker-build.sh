#!/bin/bash
echo "Building Policyholders Docker image..."
docker build --platform linux/amd64 -f deploy/app/Dockerfile -t policyholders .
if [ $? -ne 0 ]; then
    echo "Error: Failed to docker build policyholders"
    exit 1  # 停止腳本執行
fi

echo "Pushing to Docker Hub"
docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD
docker tag policyholders:latest $DOCKER_USERNAME/policyholders:latest
docker push $DOCKER_USERNAME/policyholders:latest