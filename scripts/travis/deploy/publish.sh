#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_AFFECTED="$1"
DOMAIN="$2"
USERNAME="$3"
PASSWORD="$4"

cd $DIR/../../../

npm ci && npm run build.release

# Get Tag Image
TAG_VERSION=$(./scripts/travis/deploy/get-docker-image-tag-name.sh)
echo "Running the docker with tag" $TAG_VERSION
DOCKER_PROJECT_ARGS="PROJECT_NAME=$PROJECT_AFFECTED"
DOCKER_REPOSITORY="$DOMAIN/$REPO_SLUG"

# Publish Image to quay.io or dockerhub or another domain - only publish the version on master - elsewhere version and branch
if [[ $TRAVIS_BRANCH == "master" ]]; then
    echo "npx @alfresco/adf-cli docker-publish --loginCheck --loginUsername '$USERNAME' --loginPassword '$PASSWORD' --loginRepo '$DOMAIN' --dockerRepo '$DOCKER_REPOSITORY' --buildArgs  $DOCKER_PROJECT_ARGS  --dockerTags '$TAG_VERSION' "
    npx       @alfresco/adf-cli docker-publish --loginCheck --loginUsername "$USERNAME" --loginPassword "$PASSWORD" --loginRepo "$DOMAIN" --dockerRepo "$DOCKER_REPOSITORY" --buildArgs "$DOCKER_PROJECT_ARGS" --dockerTags "$TAG_VERSION" --pathProject "$(pwd)"
else
    echo "npx @alfresco/adf-cli docker-publish --loginCheck --loginUsername '$USERNAME' --loginPassword '$PASSWORD' --loginRepo '$DOMAIN' --dockerRepo '$DOCKER_REPOSITORY' --buildArgs  $DOCKER_PROJECT_ARGS  --dockerTags '$TAG_VERSION,$TRAVIS_BRANCH' "
    npx       @alfresco/adf-cli docker-publish --loginCheck --loginUsername "$USERNAME" --loginPassword "$PASSWORD" --loginRepo "$DOMAIN" --dockerRepo "$DOCKER_REPOSITORY" --buildArgs "$DOCKER_PROJECT_ARGS" --dockerTags "$TAG_VERSION,$TRAVIS_BRANCH" --pathProject "$(pwd)"
fi;
