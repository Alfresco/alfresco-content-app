#!/usr/bin/env bash

# Upload protractor-smartrunner artifact related to this particular job to S3
./scripts/ci/utils/artifact-to-s3.sh -a "$SMART_RUNNER_DIRECTORY" -o "$S3_DBP_FOLDER/protractor-smartrunner-$TRAVIS_JOB_ID.tar.bz2"

./node_modules/@alfresco/adf-cli/bin/adf-cli scan-env --host "$API_CONTENT_HOST" -u "$ADMIN_EMAIL" -p "$ADMIN_PASSWORD"
