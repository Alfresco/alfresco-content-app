#!/bin/bash

FLAGS=""

if [ "$PUBLISH_PROJECTS" = "false" ]; then
    FLAGS="--dryrun"
fi

echo "Publish libraries with flags: ${FLAGS}"

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
bash ${DIR}/publish-libs.sh $FLAGS
