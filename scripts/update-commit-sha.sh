#!/usr/bin/env bash
eval GNU=false

set -e
TEMP=".tmp"

show_help() {
    echo "Usage: update-commit-sha.sh"
    echo ""
    echo "-t or --token  Github ouath token"
    echo "-v or --version version to bump"
    echo "-gnu for gnu"
}

gnu_mode() {
    echo "====== GNU MODE ====="
    GNU=true
}

npm install @alfresco/adf-cli@alpha
if $GNU; then
    ./node_modules/@alfresco/adf-cli/bin/adf-cli update-version --pathPackage "$(pwd)" --version $VERSION
else
    # ./node_modules/@alfresco/adf-cli/bin/adf-cli update-version --pathPackage "$(pwd)" --version $VERSION --skipGnu
    ./node_modules/@alfresco/adf-cli/bin/adf-cli update-commit-sha --pointer "HEAD" --pathPackage "$(pwd)" --skipGnu
fi

