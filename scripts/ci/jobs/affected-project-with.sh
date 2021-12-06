#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

show_help() {
    echo "Usage: affected-filtered-project.sh"
    echo ""
    echo "-target Project target"
    echo "-tag Filter project with tag"
    echo "-name Filter project with name"
}

project_target(){
    PROJECT_TARGET=$1
}

target_options(){
    OPTIONS="$1"
}

while [[ $1  == -* ]]; do
    case "$1" in
      -target)  project_target $2; shift 2;;
      -options)  target_options $2; shift 2;;
      -*) echo "invalid option: $1" 1>&2; show_help; exit 0;;
    esac
done


echo "Run alfresco-content-e2e protractor with options $OPTIONS"
echo "./node_modules/.bin/protractor \"./protractor.conf.js\" $OPTIONS || exit 1"

./node_modules/.bin/tsc -p "./e2e/tsconfig.e2e.json" || exit 1;
./node_modules/.bin/http-server -c-1 $CONTENT_CE_DIST_PATH -p 4200 > /dev/null &\
./node_modules/.bin/protractor "./protractor.conf.js" $OPTIONS || exit 1
