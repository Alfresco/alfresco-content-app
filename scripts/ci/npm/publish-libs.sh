#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR=${DIR}/../../..
DIST_DIR=${ROOT_DIR}/dist/@alfresco
PROJECTS_DIR=${ROOT_DIR}/projects

for var in "$@"
do
    case "$var" in
      --dryrun) DRY_RUN=true
      echo -e "Run with --dryrun, therefore script won't publish packages\n" ;
    esac
done

VERSION_IN_PACKAGE_JSON=`node -p "require('$ROOT_DIR/package.json')".version;`;

if [ "$TRAVIS_BRANCH" = "master" ] ; then
  NEW_LIBRARY_VERSION=VERSION_IN_PACKAGE_JSON
else
  NEW_LIBRARY_VERSION="${VERSION_IN_PACKAGE_JSON}-${TRAVIS_BUILD_NUMBER}"
fi

PROJECTS=(
    'aca-shared'
    'aca-about'
    'adf-office-services-ext'
    'aca-preview'
    'aca-viewer'
    'aca-content'
    'aca-folder-rules'
    'aca-settings'
    'aca-testing-shared'
);

for PROJECT in "${PROJECTS[@]}"
do
    echo "Update ${PROJECT} version to ${NEW_LIBRARY_VERSION}"

    cd $PROJECTS_DIR/${PROJECT}
    npm version ${NEW_LIBRARY_VERSION};
done

echo -e "\n\nBuild projects"
cd ${ROOT_DIR}
npm run build-libs

for PROJECT in "${PROJECTS[@]}"
do
  cd $DIST_DIR/${PROJECT}

  if [ "$DRY_RUN" = "true" ] ; then
    echo -e "Publish with dry mode for project: ${PROJECT}"

    npm publish --dry-run
  else
    echo "Publish ${PROJECT}"

    echo 'strict-ssl=false' >> .npmrc
    echo 'registry=http://${NPM_REGISTRY_ADDRESS}' >> .npmrc
    echo '//${NPM_REGISTRY_ADDRESS}/:_authToken="${NPM_REGISTRY_TOKEN}"' >> .npmrc

    npm publish
  fi
done
