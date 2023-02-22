#!/usr/bin/env bash

# ---------------------------------------------------------------
# Validating replaced app.config.json
# ---------------------------------------------------------------
app_config_checker(){
    APP_CONFIG_FILE_PATH=$1;

    echo  -n "     \_ Validating replaced config file ... ";
        $(npm bin)/ajv validate -s ./node_modules/@alfresco/adf-core/app.config.schema.json -d $APP_CONFIG_FILE_PATH --errors=text --verbose || exit 4

        if grep -E -q '\$\{[A-Z0-9_]*\}' $APP_CONFIG_FILE_PATH; then
            echo -e "\e[31m        \_ ERROR: Variables are still present in the app.config.json file. Some of them might not have default value set.\e[0m";
            exit 5;
        fi
}

FROM=$1;
TO=$2;
PARAMS=$3;

echo "====== Check content UP ====="

./node_modules/@alfresco/adf-cli/bin/adf-cli check-cs-env --host "$APP_CONFIG_ECM_HOST" -u "$ADMIN_EMAIL" -p "$ADMIN_PASSWORD" || exit 1

echo "====== Download artifacts ====="
# Download built application artifact from S3
./scripts/ci/utils/artifact-from-s3.sh -a "$FROM" -o "$TO"

APP_CONFIG_FILE_PATH="$TO/app.config.json"
EXTRA_ENV_SETTINGS=""
# Replace variables in app.config.json
envsub $EXTRA_ENV_SETTINGS --all $APP_CONFIG_FILE_PATH $APP_CONFIG_FILE_PATH || exit 1

app_config_checker $APP_CONFIG_FILE_PATH

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
