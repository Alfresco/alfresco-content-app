#!/usr/bin/env bash

set -e

if [[ "$BUILD_ENABLED" == "true" ]]
then
  npm clean-install
  npm run build
fi
docker rmi -f $DOCKER_IMAGE_REPO
docker build --build-arg PROJECT_NAME=$PROJECT_NAME -t $DOCKER_IMAGE_REPO .
echo http://localhost:8080$BASE_PATH
docker run --rm -it \
  --env BASE_PATH=$BASE_PATH \
  --env IDENTITY_HOST=$IDENTITY_HOST \
  --env OAUTH_HOST=$OAUTH_HOST \
  --user 1000:1000 --publish 8080:8080 $DOCKER_IMAGE_REPO
