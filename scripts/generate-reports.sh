#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"

npx @alfresco/adf-cli@latest audit -d $DIR/docs/audit
npx @alfresco/adf-cli@latest licenses -d $DIR/docs/licences
npx @alfresco/adf-cli@alpha changelog -o $DIR/docs/changelog --exclude="bot\|Alfresco Build User\|alfresco-build"
