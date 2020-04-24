#!/bin/bash

if [ "${TRAVIS_BRANCH}" != "master" ]; then
   ./update-version.sh -v alpha
fi
