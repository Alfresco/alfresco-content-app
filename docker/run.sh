#!/usr/bin/env bash

set -e

eval ALL_ARGUMENTS=("BASE_PATH"
    "APP_BASE_SHARE_URL"
    "APP_CONFIG_IDENTITY_HOST"
    "APP_CONFIG_ECM_HOST"
)
ALL_ARGUMENTS_LENGTH=${#ALL_ARGUMENTS[@]}
DOCKER_ARGS=""
for (( j=0; j<${ALL_ARGUMENTS_LENGTH}; j++ )); do
    ARG="${ALL_ARGUMENTS[$j]}"
    if [  -v "${ARG}" ]; then
        DOCKER_ARGS="$DOCKER_ARGS --env $ARG=${!ARG}"
    fi
done

HOST_PORT=8081
CONTAINER_PORT=8080
docker rmi -f $DOCKER_IMAGE_REPO
docker build --build-arg PROJECT_NAME=$PROJECT_NAME -t $DOCKER_IMAGE_REPO .
echo "http://localhost:${HOST_PORT}${BASE_PATH}"
docker run --rm -it $DOCKER_ARGS --user 1000:1000 --publish $HOST_PORT:$CONTAINER_PORT $DOCKER_IMAGE_REPO
