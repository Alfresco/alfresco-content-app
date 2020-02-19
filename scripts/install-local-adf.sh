#!/bin/bash

cd alfresco-ng2-components
npm install
echo "== install ADF libs =="
./scripts/build/build-core.sh
./scripts/build/build-content-services.sh
./scripts/build/build-extensions.sh
cd ..
echo "== copy ADF libs =="
rm -rf node_modules/@alfresco/adf-content-services
rm -rf node_modules/@alfresco/adf-core
rm -rf node_modules/@alfresco/adf-extensions
mkdir -p node_modules/@alfresco/adf-content-services
mkdir -p node_modules/@alfresco/adf-core
mkdir -p node_modules/@alfresco/adf-extensions
cp -rf alfresco-ng2-components/lib/dist/content-services/* node_modules/@alfresco/adf-content-services
cp -rf alfresco-ng2-components/lib/dist/core/* node_modules/@alfresco/adf-core
cp -rf alfresco-ng2-components/lib/dist/extensions/* node_modules/@alfresco/adf-extensions

LOCAL=LOCAL
echo "== Rename local ADF libs version with attaching _$LOCAL ==="
CORE_VERSION=$(node -p "require('./node_modules/@alfresco/adf-core/package.json').version")
echo "CORE_VERSION $CORE_VERSION"
sed -i'' -e "s#\"version\": \"$CORE_VERSION\"#\"version\": \"${CORE_VERSION}_$LOCAL\"#g" ./node_modules/@alfresco/adf-core/package.json
CONTENT_VERSION=$(node -p "require('./node_modules/@alfresco/adf-content-services/package.json').version")
sed -i'' -e "s#\"version\": \"$CONTENT_VERSION#\"version\": \"${CONTENT_VERSION}_$LOCAL#g" ./node_modules/@alfresco/adf-content-services/package.json
EXT_VERSION=$(node -p "require('./node_modules/@alfresco/adf-extensions/package.json').version")
sed -i'' -e "s#\"version\": \"$EXT_VERSION#\"version\": \"${EXT_VERSION}_$LOCAL#g" ./node_modules/@alfresco/adf-extensions/package.json
