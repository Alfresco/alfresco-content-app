#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

if [ "$CI" = "true" ]; then
    echo "Updating wedriver-manager with chromedriver: $npm_package_config_chromeDriver."
    webdriver-manager update --gecko=false --versions.chrome=$npm_package_config_chromeDriver
else
    echo "Updating wedriver-manager with latest chromedriver, be sure to use evergreen Chrome."
    webdriver-manager update --gecko=false
fi
