#!/usr/bin/env bash

set -e

[[ "$BUILD_ENABLED" == "true" ]] && $(dirname $0)/build.sh

env \
  PROJECT_NAME=content-ce \
  BASE_PATH=${BASE_PATH:-/workspace} \
  DOCKER_IMAGE_REPO=alfresco/alfresco-content-app \
  $(dirname $0)/run.sh
