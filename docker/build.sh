#!/usr/bin/env bash

set -e

echo building $1
npm clean-install
npm run build.release $*
