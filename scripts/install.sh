#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

if [ "${TRAVIS_BRANCH}" != "master" ]; then
   ./scripts/update-version.sh -v alpha
fi
