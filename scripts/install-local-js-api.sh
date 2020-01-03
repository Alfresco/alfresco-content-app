#!/bin/bash

./alfresco-js-api/scripts/build.sh
rm -f node_modules/@alfresco/js-api
mkdir -p node_modules/@alfresco/js-api
cp alfresco-js-api/dist/package node_modules/@alfresco/js-api
