#!/usr/bin/env bash

ROOT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/../../.." && pwd )"
VERSION=$1
DRY_RUN=$2

if [[ -z "$VERSION" ]]; then
    echo "Missing version parameter"
    exit 1
fi

export PROJECTS=(
  'aca-content'
  'aca-shared'
);

for PROJECT in ${PROJECTS[@]}
do
  echo "Updating \"$PROJECT\" to version \"$VERSION\""

  if [[ "$DRY_RUN" != "true" ]]; then
    PROJECT_DIR=$ROOT_DIR/projects/$PROJECT

    (cd $PROJECT_DIR && npm version --allow-same-version --no-git-tag-version --force "$VERSION")
  fi
done
