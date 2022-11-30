#!/usr/bin/env bash
# ---------------------------------------------------------------
# ADF linking
# ---------------------------------------------------------------
echo "Commit message: $COMMIT_MESSAGE"
if [[ $COMMIT_MESSAGE == *"[link-adf:"* ]]; then
    BRANCH=`echo $COMMIT_MESSAGE | grep -o "\[link-adf\:[^]]*\]" | sed -e 's#\[link-adf:##g' | sed -e 's#\]##g'`
    echo "Checking out ADF's branch: ${BRANCH}" && \
    git clone https://github.com/Alfresco/alfresco-ng2-components.git --depth=1 --branch ${BRANCH} ../alfresco-ng2-components
    # ADF theming needs it the styling
    CWD=`pwd`
    cd ../alfresco-ng2-components
    npm install @angular/material
    cd $CWD
    export BUILD_OPTS="--configuration=adfprod,e2e"
else
    echo -e "\e[32mUsing ADF from installed node_modules.\e[0m"
fi ;
