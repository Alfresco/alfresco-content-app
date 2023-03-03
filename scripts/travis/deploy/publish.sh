#!/usr/bin/env bash

DOMAIN="$1"
USERNAME="$2"
PASSWORD="$3"
TAG_VERSION="$4"
BRANCH_NAME="$5"
DRY_RUN="$6"

npm ci && npm run build.release

echo "Running the docker with tag" $TAG_VERSION
DOCKER_PROJECT_ARGS="PROJECT_NAME=content-ce"
DOCKER_REPOSITORY="$DOMAIN/$REPO_SLUG"

# Publish Image to quay.io or dockerhub or another domain - only publish the version on master - elsewhere version and branch
if [[ $TRAVIS_BRANCH == "master" ]]; then
    echo "npx @alfresco/adf-cli docker-publish --loginCheck --loginUsername '$USERNAME' --loginPassword '$PASSWORD' --loginRepo '$DOMAIN' --dockerRepo '$DOCKER_REPOSITORY' --buildArgs  $DOCKER_PROJECT_ARGS  --dockerTags '$TAG_VERSION' "
     if [[ $DRY_RUN == false ]]; then
        npx       @alfresco/adf-cli docker-publish --loginCheck --loginUsername "$USERNAME" --loginPassword "$PASSWORD" --loginRepo "$DOMAIN" --dockerRepo "$DOCKER_REPOSITORY" --buildArgs "$DOCKER_PROJECT_ARGS" --dockerTags "$TAG_VERSION" --pathProject "$(pwd)"
      fi;
else
    echo "npx @alfresco/adf-cli docker-publish --loginCheck --loginUsername '$USERNAME' --loginPassword '$PASSWORD' --loginRepo '$DOMAIN' --dockerRepo '$DOCKER_REPOSITORY' --buildArgs  $DOCKER_PROJECT_ARGS  --dockerTags '$TAG_VERSION,$BRANCH_NAME' "
     if [[ $DRY_RUN == false ]]; then
      npx       @alfresco/adf-cli docker-publish --loginCheck --loginUsername "$USERNAME" --loginPassword "$PASSWORD" --loginRepo "$DOMAIN" --dockerRepo "$DOCKER_REPOSITORY" --buildArgs "$DOCKER_PROJECT_ARGS" --dockerTags "$TAG_VERSION,$BRANCH_NAME" --pathProject "$(pwd)"
    fi;
fi;
