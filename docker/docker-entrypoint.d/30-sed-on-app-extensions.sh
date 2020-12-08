#!/bin/sh

set -e

echo Running sed on "${NGINX_ENVSUBST_OUTPUT_DIR}/assets/app.extensions.json"

# modifies the "$ignoreReferenceList" property using a comma-delimited string
if [ -n "${APP_EXTENSIONS_IGNORE_REFS}" ]; then
echo "replace APP_EXTENSIONS_IGNORE_REFS"

  replace="\/"
  encoded=${APP_EXTENSIONS_IGNORE_REFS//\//$replace}
  sed -e "s/\"$ignoreReferenceList\": \".*\"/\"$ignoreReferenceList\": \[${encoded}\]/g" \
    -i "${NGINX_ENVSUBST_OUTPUT_DIR}/app.extensions.json"
fi
