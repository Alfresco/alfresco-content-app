#!/bin/bash

rm -rf node_modules
./alfresco-js-api/scripts/build.sh
npm install
rm -rf node_modules/@alfresco/js-api
mkdir -p node_modules/@alfresco/js-api
cp -rf alfresco-js-api/dist/package/* node_modules/@alfresco/js-api

LOCAL=LOCAL
echo "== Rename local JS API version with attaching _$LOCAL ==="
VERSION=$(node -p "require('./node_modules/@alfresco/js-api/package.json').version")
sed -i'' -e "s#\"version\": \"$VERSION\"#\"version\": \"${VERSION}_$LOCAL\"#g" ./node_modules/@alfresco/js-api/package.json
