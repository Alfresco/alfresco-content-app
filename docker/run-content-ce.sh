#!/usr/bin/env bash

set -e

env PROJECT_NAME=app BASE_PATH=/workspace DOCKER_IMAGE_REPO=alfresco/alfresco-content-app $(dirname "$0")/run.sh
