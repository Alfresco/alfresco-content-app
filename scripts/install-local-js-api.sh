#!/bin/bash

rm -rf node_modules
./alfresco-js-api/scripts/build.sh
npm install
rm -rf node_modules/@alfresco/js-api
mkdir -p node_modules/@alfresco/js-api
cp -rf alfresco-js-api/dist/package/* node_modules/@alfresco/js-api
