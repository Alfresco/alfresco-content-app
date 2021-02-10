#!/usr/bin/env bash

# Settings for Angular builder --------------------------------------------------------
export NODE_OPTIONS="--max_old_space_size=30000"

# Settings for protractor-smartrunner -------------------------------------------------
export GIT_HASH=`git rev-parse HEAD`
export SMART_RUNNER_DIRECTORY=".protractor-smartrunner"

# Settings for Nx ---------------------------------------------------------------------
export BASE_HASH="$(git describe --tags `git rev-list --tags --max-count=1`)"
export HEAD_HASH="HEAD"

# Settings for S3 caching -------------------------------------------------------------
pip install --user awscli
S3_DBP_PATH="s3://alfresco-travis-builds/aca"
if [ "${TRAVIS_EVENT_TYPE}" == "push" ]; then
    export S3_DBP_ROOT_FOLDER="$S3_DBP_PATH/$TRAVIS_BRANCH"
elif [ "${TRAVIS_EVENT_TYPE}" == "pull_request" ]; then
    export S3_DBP_ROOT_FOLDER="$S3_DBP_PATH/$TRAVIS_PULL_REQUEST"
    export BASE_HASH="origin/$TRAVIS_BRANCH"
elif [ "${TRAVIS_EVENT_TYPE}" == "cron" ]; then
    export S3_DBP_ROOT_FOLDER="$S3_DBP_PATH/cron"
else
    export S3_DBP_ROOT_FOLDER="$S3_DBP_PATH/api"
fi
export S3_DBP_FOLDER="$S3_DBP_ROOT_FOLDER/$TRAVIS_BUILD_ID"

echo "BASE_HASH: $BASE_HASH"
echo "S3 DBP root folder: $S3_DBP_ROOT_FOLDER"
echo "S3 DBP destination: $S3_DBP_FOLDER"
