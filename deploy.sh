#!/bin/sh

ssh -o StrictHostKeyChecking=no root@$INSTANCE_IP << 'ENDSSH'
  if ! command -v docker &> /dev/null
  then
    echo "docker could not be found"
    echo "Installing docker"
    apt-get update -y
    apt-get install \
      ca-certificates \
      curl \
      gnupg \
      lsb-release -y
    mkdir -p /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker-archive-keyring.gpg
    echo \
      "deb [arch=amd64 signed-by=/etc/apt/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
      $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
    apt-get update -y
    apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin -y
    groupadd docker
    usermod -aG docker $USER
    newgrp docker
  fi
  if ! command -v docker-compose &> /dev/null
  then
    echo "docker-compose could not be found"
    echo "Installing docker-compose"
    apt-get update -y
    apt-get install docker-compose -y
  fi
  cd /app
  ls -la
  export $(cat .env | xargs)
  docker network create bookstore-network
  docker-compose -f docker-compose.deploy.yml down
  docker-compose -f docker-compose.deploy.yml stop
  docker-compose -f docker-compose.deploy.yml up --build -d
ENDSSH
