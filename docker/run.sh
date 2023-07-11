#!/usr/bin/env bash

DOCKER_IMAGE_REPO=alfresco/alfresco-content-app
HOST_PORT=8081
CONTAINER_PORT=8080

docker rmi -f $DOCKER_IMAGE_REPO
docker build -t $DOCKER_IMAGE_REPO .

echo "http://localhost:${HOST_PORT}"

docker run --rm -it \
  --user 1000:1000 \
  --publish $HOST_PORT:$CONTAINER_PORT $DOCKER_IMAGE_REPO
