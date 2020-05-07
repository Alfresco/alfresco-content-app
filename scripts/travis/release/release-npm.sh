#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT=${DIR}/../../..
DIST=${ROOT}/dist/@alfresco

if [[ $TRAVIS_PULL_REQUEST == "false" ]];
then
    TAG_NPM=latest
    if [[ $TRAVIS_BRANCH == "develop" ]];
    then
        TAG_NPM=alpha
        if [[ $TRAVIS_EVENT_TYPE == "cron" ]];
        then
            TAG_NPM=beta
        fi
    fi
fi;

cd $DIST/aca-shared

set -e
touch .npmrc
echo 'strict-ssl=false' >> .npmrc
echo 'registry=http://${NPM_REGISTRY_ADDRESS}' >> .npmrc
echo '//${NPM_REGISTRY_ADDRESS}/:_authToken="${NPM_REGISTRY_TOKEN}"' >> .npmrc

npm publish

cd $DIST/adf-office-services-ext

set -e
touch .npmrc
echo 'strict-ssl=false' >> .npmrc
echo 'registry=http://${NPM_REGISTRY_ADDRESS}' >> .npmrc
echo '//${NPM_REGISTRY_ADDRESS}/:_authToken="${NPM_REGISTRY_TOKEN}"' >> .npmrc

npm publish
