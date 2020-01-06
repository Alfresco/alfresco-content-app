#!/bin/bash

git pull
git submodule sync --recursive
git submodule update --init --recursive
# Go through all of the submodules switching them to their branches and updating them

echo
echo "Updating alfresco-js-api ..."
echo  --------------------------
cd alfresco-js-api && git checkout master && git pull
cd ..

echo
