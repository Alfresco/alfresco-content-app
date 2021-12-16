#!/usr/bin/env bash

set -e

HOST_PORT=8081
CONTAINER_PORT=8080
docker rmi -f $DOCKER_IMAGE_REPO
docker build --build-arg PROJECT_NAME=$PROJECT_NAME -t $DOCKER_IMAGE_REPO .
echo "http://localhost:${HOST_PORT}${BASE_PATH}"
docker run --rm -it \
  --env BASE_PATH=$BASE_PATH \
  --env APP_CONFIG_AUTH_TYPE=$APP_CONFIG_AUTH_TYPE \
  --env APP_CONFIG_IDENTITY_HOST=$APP_CONFIG_IDENTITY_HOST \
  --env APP_CONFIG_OAUTH2_HOST=$APP_CONFIG_OAUTH2_HOST \
  --env APP_CONFIG_OAUTH2_CLIENTID=$APP_CONFIG_OAUTH2_CLIENTID \
  --env APP_CONFIG_OAUTH2_IMPLICIT_FLOW=$APP_CONFIG_OAUTH2_IMPLICIT_FLOW \
  --env APP_CONFIG_OAUTH2_SILENT_LOGIN=$APP_CONFIG_OAUTH2_SILENT_LOGIN \
  --env APP_CONFIG_OAUTH2_REDIRECT_SILENT_IFRAME_URI=$APP_CONFIG_OAUTH2_REDIRECT_SILENT_IFRAME_URI \
  --env APP_CONFIG_OAUTH2_REDIRECT_LOGIN=$APP_CONFIG_OAUTH2_REDIRECT_LOGIN \
  --env APP_CONFIG_OAUTH2_REDIRECT_LOGOUT=$APP_CONFIG_OAUTH2_REDIRECT_LOGOUT \
  --env APP_CONFIG_BPM_HOST=$APP_CONFIG_BPM_HOST \
  --env APP_CONFIG_ECM_HOST=$APP_CONFIG_ECM_HOST \
  --env APP_BASE_SHARE_URL=$APP_BASE_SHARE_URL \
  --env APP_EXTENSIONS_IGNORE_REFS=$APP_EXTENSIONS_IGNORE_REFS \
  --env APP_CONFIG_PLUGIN_AOS=${APP_CONFIG_PLUGIN_AOS} \
  --user 1000:1000 --publish $HOST_PORT:$CONTAINER_PORT $DOCKER_IMAGE_REPO
