#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR=${DIR}/../../..
DIST_DIR=${ROOT_DIR}/dist/@alfresco
PROJECTS_DIR=${ROOT_DIR}/projects

DRY_RUN=""
if [ "$PUBLISH_PROJECTS" = "false" ]; then
    DRY_RUN=true
    echo "PUBLISH_PROJECTS is set to false, run in dry mode"
fi

VERSION_IN_PACKAGE_JSON=`node -p "require('$ROOT_DIR/package.json')".version;`;

if [[ $TRAVIS_BRANCH =~ ^master.*?$ ]] ; then
  NEW_LIBRARY_VERSION=VERSION_IN_PACKAGE_JSON
else
  NEW_LIBRARY_VERSION="${VERSION_IN_PACKAGE_JSON}-${TRAVIS_BUILD_NUMBER}"
fi

if [[ $TRAVIS_BRANCH =~ ^master(-patch.*)?$ ]]
then
    # Pre-release versions
    if [[ $VERSION_IN_PACKAGE_JSON =~ ^[0-9]*\.[0-9]*\.[0-9]*-A\.[0-9]*$ ]];
    then
        TAG_NPM=next
    # Stable major versions
    else
        TAG_NPM=latest
    fi
fi

if [[ $TRAVIS_BRANCH =~ ^develop(-patch.*)?$ ]]
then
    TAG_NPM=alpha
fi

echo -e "Branch is '$TRAVIS_BRANCH', therefore publish with '$TAG_NPM' tag\n"

PROJECTS=(
    'aca-shared'
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
  PREVIOUS_LIBRARY_VERSION=$(npm view @alfresco/${PROJECT} version)

  if [ "$DRY_RUN" = "true" ] ; then
    echo -e "Publish with dry mode for project: $PROJECT\n"
    echo -e "npm publish --dry-run --tag $TAG_NPM \n"

    npm publish --dry-run --tag $TAG_NPM

    echo -e "Deprecating old version of @alfresco/$PROJECT the old version is $PREVIOUS_LIBRARY_VERSION\n"

    echo "npm deprecate @alfresco/$PROJECT@$PREVIOUS_LIBRARY_VERSION 'Upgrade to @latest or $NEW_LIBRARY_VERSION'"
  else
    echo -e "Publish $PROJECT\n"
    echo -e "npm publish --tag $TAG_NPM\n"

    echo 'strict-ssl=false' >> .npmrc
    echo 'registry=http://${NPM_REGISTRY_ADDRESS}' >> .npmrc
    echo '//${NPM_REGISTRY_ADDRESS}/:_authToken="${NPM_REGISTRY_TOKEN}"' >> .npmrc

    npm publish --tag $TAG_NPM
    npm deprecate "@alfresco/$PROJECT@$PREVIOUS_LIBRARY_VERSION" "Upgrade to @latest or $NEW_LIBRARY_VERSION"
  fi
done
