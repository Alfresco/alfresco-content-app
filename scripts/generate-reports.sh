#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"

npm run ci:audit
npm run ci:licenses
npm run ci:changelog
