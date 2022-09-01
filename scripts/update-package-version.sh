#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
VERSION=$1

eval packages=(
    "$DIR"
)
packagesLength=${#packages[@]}

for (( j=0; j<${packagesLength}; j++ ));
do
    PACKAGE_PATH="${packages[$j]}"
    echo "====== UPDATE PACKAGE VERSION of ${packages[$j]} to ${VERSION} ======"
    cd $PACKAGE_PATH;
    npm version --no-git-tag-version $VERSION
done
