#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
VERSION=$1

if [[ "${VERSION}" == "" ]]
then
  echo "Usage: release.sh <version>"
  exit 1
fi

cd ${DIR}

echo "Updating ADF to latest"
./update-version.sh -v latest || exit 1

echo "Updating project versions"
./update-projects.js $VERSION || exit 1

cd ${DIR}/..

echo "Generating reports"
npx @alfresco/adf-cli@latest audit -d ./docs/audit && \
npx @alfresco/adf-cli@latest licenses -d ./docs/licences && \
npx @alfresco/adf-cli@alpha changelog -o ./docs/changelog

echo "Changelog for master..develop"
npx @alfresco/adf-cli@alpha changelog
