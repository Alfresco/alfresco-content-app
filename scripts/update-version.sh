#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

eval libs=( "@alfresco/adf-core"
    "@alfresco/adf-content-services"
    "@alfresco/adf-extensions"
    "@alfresco/adf-testing"
    "@alfresco/adf-cli"
)

cd ${DIR}/..

show_help() {
    echo "Usage: update-version.sh -v latest"
    echo ""
    echo "-v or -version the new version of the libraries, can also be alpha|beta|latest"
    echo "-vj or --versionjsapi  to use a different version of js-api"
}

set_version() {
    VERSION=$1
}

set_js_version() {
    JS_VERSION=$1
}

update(){
    eval libsWithVersions=();

    for (( i=0; i<${libslength}; i++ ));
    do
        EXACT_VERSION="${libs[$i]}@${VERSION}"
        eval libsWithVersions=( "${libsWithVersions[@]}" "${EXACT_VERSION}" )
    done

    echo "npm i --ignore-scripts -E ${libsWithVersions[*]}"
    npm i --ignore-scripts -E ${libsWithVersions[*]}
}

update_js_api(){
    eval jsWithVersions=();

    echo "npm i --ignore-scripts -E @alfresco/js-api@${JS_VERSION}"
    npm i --ignore-scripts -E @alfresco/js-api@${JS_VERSION}
}

while [[ $1  == -* ]]; do
    case "$1" in
      -h|--help|-\?) show_help; exit 0;;
      -v|version) set_version $2; shift 2;;
      -vj|version) set_js_version $2; shift 2;;
      -*) shift;;
    esac
done

if [[ "${VERSION}" == "" ]]
then
  echo "Error: version number is required"
  exit 1
fi

libslength=${#libs[@]}

echo "====== Updating dependencies ======"
update

if [[ "${JS_VERSION}" == "" ]]
then
  JS_VERSION=$VERSION
fi

update_js_api
