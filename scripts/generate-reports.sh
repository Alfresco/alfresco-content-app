#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"

./node_modules/.bin/adf-cli audit -d $DIR/docs/audit
./node_modules/.bin/adf-cli licenses -d $DIR/docs/licences
./node_modules/.bin/adf-cli changelog -o $DIR/docs/changelog --exclude="bot\|Alfresco Build User\|alfresco-build"
