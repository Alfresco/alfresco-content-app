#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_AFFECTED=$1
cd $DIR/../../../

npm run build.release

# Get Tag Image
TAG_VERSION=$(./scripts/travis/deploy/get-docker-image-tag-name.sh)
echo "Running the docker with tag" $TAG_VERSION
DOCKER_PROJECT_ARGS="PROJECT_NAME=$PROJECT_AFFECTED"
DOCKER_REPOSITORY="$DOCKER_REPOSITORY_DOMAIN/$REPO_SLUG"
# Publish Image to docker
echo "npx @lfresco/adf-cli docker-publish --loginCheck --loginUsername '$DOCKER_REPOSITORY_USER' --loginPassword '$DOCKER_REPOSITORY_PASSWORD' --loginRepo '$DOCKER_REPOSITORY_DOMAIN' --dockerRepo '$DOCKER_REPOSITORY' --buildArgs $DOCKER_PROJECT_ARGS --dockerTags '$TAG_VERSION,$TRAVIS_BRANCH' "
npx @lfresco/adf-cli docker-publish --loginCheck --loginUsername "$DOCKER_REPOSITORY_USER" --loginPassword "$DOCKER_REPOSITORY_PASSWORD" --loginRepo "$DOCKER_REPOSITORY_DOMAIN" --dockerRepo "$DOCKER_REPOSITORY" --buildArgs "$DOCKER_PROJECT_ARGS" --dockerTags "$TAG_VERSION,$TRAVIS_BRANCH" --pathProject "$(pwd)"
