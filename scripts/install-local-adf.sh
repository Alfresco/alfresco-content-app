#!/bin/bash

cd alfresco-ng2-components
npm install
./scripts/build/build-all-lib.sh
./scripts/build/build-content-services.sh
./scripts/build/build-extensions.sh
cd ..
rm -rf node_modules/@alfresco/adf-content-services
rm -rf node_modules/@alfresco/adf-core
rm -rf node_modules/@alfresco/adf-extensions
mkdir -p node_modules/@alfresco/adf-content-services
mkdir -p node_modules/@alfresco/adf-core
mkdir -p node_modules/@alfresco/adf-extensions
cp -rf alfresco-ng2-components/lib/dist/content-services/* node_modules/@alfresco/adf-content-services
cp -rf alfresco-ng2-components/lib/dist/core/* node_modules/@alfresco/adf-core
cp -rf alfresco-ng2-components/lib/dist/extensions/* node_modules/@alfresco/adf-extensions
