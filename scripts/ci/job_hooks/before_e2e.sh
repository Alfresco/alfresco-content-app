#!/usr/bin/env bash

FROM=$1;
TO=$2;
PARAMS=$3;

echo "====== Scan environment ====="
./node_modules/@alfresco/adf-cli/bin/adf-cli scan-env --host "$API_CONTENT_HOST" -u "$ADMIN_EMAIL" -p "$ADMIN_PASSWORD"

echo "====== Check content UP ====="

./node_modules/@alfresco/adf-cli/bin/adf-cli check-cs-env --host "$API_CONTENT_HOST" -u "$ADMIN_EMAIL" -p "$ADMIN_PASSWORD" || exit 1

echo "====== Download artifacts ====="
# Download built application artifact from S3
./scripts/ci/utils/artifact-from-s3.sh -a "$FROM" -o "$TO"
node "./scripts/app-config-replace.js" --config="$TO/app.config.json" $PARAMS

# Download protractor-smartrunner artifact related to this particular job from S3, if exists
./scripts/ci/utils/artifact-from-s3.sh -a "$S3_DBP_FOLDER/protractor-smartrunner-$TRAVIS_JOB_ID.tar.bz2" -o "$SMART_RUNNER_DIRECTORY"

echo "====== Update webdriver-manager ====="
if [ "$CI" = "true" ]; then
    export chrome=$(google-chrome --product-version)
    echo "Updating wedriver-manager with chromedriver: $chrome."
    webdriver-manager update --gecko=false --versions.chrome=$chrome
else
    echo "Updating wedriver-manager with latest chromedriver, be sure to use evergreen Chrome."
    webdriver-manager update --gecko=false
fi
