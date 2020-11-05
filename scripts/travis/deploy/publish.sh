#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../../../

npm run build

# Get Tag Image
TAG_VERSION=$(./scripts/travis/deploy/get-docker-image-tag-name.sh)
echo "Running the docker with tag" $TAG_VERSION

# Publish Image to docker
./node_modules/@alfresco/adf-cli/bin/adf-cli docker-publish --loginCheck --loginUsername "$DOCKER_REPOSITORY_USER" --loginPassword "$DOCKER_REPOSITORY_PASSWORD" --loginRepo "$DOCKER_REPOSITORY_DOMAIN" --dockerRepo "$DOCKER_REPOSITORY" --dockerTags "$TAG_VERSION,$TRAVIS_BRANCH" --pathProject "$(pwd)"
