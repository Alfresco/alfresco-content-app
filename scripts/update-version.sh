#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
eval JS_API=true
eval GNU=false
eval EXEC_COMPONENT=true
eval DIFFERENT_JS_API=false
eval AUTO=false

eval libs=( "core"
    "content-services"
    #"process-services"
    #"insights"
)

cd ${DIR}/..

prefix="@alfresco/adf-"

show_help() {
    echo "Usage: update-version.sh"
    echo ""
    echo "-sj or -sjsapi  don't update js-api version"
    echo "-vj or -versionjsapi  to use a different version of js-api"
    echo "-v or -version  version to update"
    echo "-alpha update last alpha version of js-api and lib automatically"
    echo "-beta update beta alpha version of js-api and lib automatically"
    echo "-gnu for gnu"
}

skip_js() {
    echo "====== Skip JS-API change version $1 ====="
    JS_API=false
}

last_alpha_mode() {
    echo "====== Auto find last ALPHA version ====="
    VERSION=$(npm view @alfresco/adf-core@alpha version)

    echo "====== version lib ${VERSION} ====="

    DIFFERENT_JS_API=true
    VERSION_JS_API=$(npm view alfresco-js-api@alpha version)

    echo "====== version js-api ${DIFFERENT_JS_API} ====="
}

last_beta_mode() {
    echo "====== Auto find last BETA version ====="
    VERSION=$(npm view @alfresco/adf-core@beta version)

    echo "====== version lib ${VERSION} ====="

    DIFFERENT_JS_API=true
    VERSION_JS_API=$(npm view alfresco-js-api@beta version)

    echo "====== version js-api ${DIFFERENT_JS_API} ====="
}

gnu_mode() {
    echo "====== GNU MODE ====="
    GNU=true
}

version_change() {
    echo "====== New version $1 ====="
    VERSION=$1
}

version_js_change() {
    echo "====== Alfresco JS-API version $1 ====="
    VERSION_JS_API=$1
    DIFFERENT_JS_API=true
}

update_component_dependency_version(){
    for (( j=0; j<${libslength}; j++ ));
    do
        echo "====== UPDATE ${prefix}${libs[$j]} to ${VERSION}======"
        EXACT_VERSION="${prefix}${libs[$j]}@${VERSION}"
        npm install -E ${EXACT_VERSION}
    done
}

update_component_js_version(){
    echo "====== UPDATE alfresco-js-api to ${1} ======"
    PACKAGETOCHANGE="alfresco-js-api"
    EXACT_VERSION="${PACKAGETOCHANGE}@${1}"
    npm install -E ${EXACT_VERSION}
}

while [[ $1  == -* ]]; do
    case "$1" in
      -h|--help|-\?) show_help; exit 0;;
      -v|version) version_change $2; shift 2;;
      -sj|sjsapi) skip_js; shift;;
      -vj|versionjsapi)  version_js_change $2; shift 2;;
      -gnu) gnu_mode; shift;;
      -alpha) last_alpha_mode; shift;;
      -beta) last_beta_mode; shift;;
      -*) shift;;
    esac
done

if $GNU; then
 sedi='-i'
else
 sedi=('-i' '')
fi

if [[ "${VERSION}" == "" ]]
then
  echo "Version number required"
  exit 1
fi

projectslength=${#projects[@]}
libslength=${#libs[@]}

if $EXEC_COMPONENT == true; then
    echo "====== UPDATE  ======"

     update_component_dependency_version

     if $JS_API == true; then

      if $DIFFERENT_JS_API == true; then
          update_component_js_version ${VERSION_JS_API}
      else
          update_component_js_version ${VERSION}
      fi

     fi
fi
