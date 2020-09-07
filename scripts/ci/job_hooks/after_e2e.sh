#!/usr/bin/env bash

echo "get docker logs after run"
echo "--------------------------------"
docker logs `docker ps | grep 'alfresco/alfresco-content-repository-community:latest' | awk '{ print $1 }'`
echo "--------------------------------"

# Upload protractor-smartrunner artifact related to this particular job to S3
./scripts/ci/utils/artifact-to-s3.sh -a "$SMART_RUNNER_DIRECTORY" -o "$S3_DBP_FOLDER/protractor-smartrunner-$TRAVIS_JOB_ID.tar.bz2"
