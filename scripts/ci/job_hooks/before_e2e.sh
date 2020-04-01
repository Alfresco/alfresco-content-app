#!/usr/bin/env bash

FROM=$1;
TO=$2;

./scripts/ci/utils/artifact-from-s3.sh -a "$FROM" -o "$TO"
node "./scripts/app-config-replace.js" --config="$TO/app.config.json" -a
