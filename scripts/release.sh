#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
VERSION=$1

cd ${DIR}

echo "Running release for ${VERSION}"

echo "Updating project versions"
./update-projects.js $VERSION || exit 1

cd ${DIR}/..

echo "Generating reports"
npx @alfresco/adf-cli@latest audit -d $DIR/docs/audit
npx @alfresco/adf-cli@latest licenses -d $DIR/docs/licences
npx @alfresco/adf-cli@alpha changelog -o $DIR/docs/changelog

echo "Changelog for master..develop"
npx @alfresco/adf-cli changelog
