#!/usr/bin/env bash

set -e

ROOT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/../../.." && pwd )"
DIST_DIR="$ROOT_DIR/dist/@alfresco"
TAG=$1
DRY_RUN=$2

if [[ -z "$TAG" ]]; then
    echo "Missing tag parameter"
    exit 1
fi

export PROJECTS=(
  'aca-content'
  'aca-shared'
  'aca-playwright-shared'
);

for PROJECT in ${PROJECTS[@]}
do
  cd $DIST_DIR/$PROJECT

  if [[ "$DRY_RUN" == "true" ]]; then
    echo "[DRY RUN] Publishing \"$PROJECT\" with \"$TAG\" tag"
    npm publish --dry-run --tag "$TAG"
  else
    echo "Publishing \"$PROJECT\" with \"$TAG\" tag"
    npm publish --tag "$TAG"
  fi
done
