# Note no #!/bin/sh as this should not spawn
# an extra shell, since this partial shell script
# is supposed to be invoked as part of another.
# ---------------------------------------------------------------
# ADF linking
# ---------------------------------------------------------------
echo "Inside linking"
if [[ $COMMIT_MESSAGE == *"[link-adf:"* ]]; then
    echo "Entered if $COMMIT_MESSAGE"
    export BUILD_OPTS="--configuration=adfprod,e2e"
    BRANCH=`echo $COMMIT_MESSAGE | grep -o "\[link-adf\:[^]]*\]" | sed -e 's#\[link-adf:##g' | sed -e 's#\]##g'`
    echo "Checking out ADF's branch: ${BRANCH}" && \
    git clone https://github.com/Alfresco/alfresco-ng2-components.git --depth=1 --branch ${BRANCH} ../alfresco-ng2-components
    # ADF theming needs it the styling
    CWD=`pwd`
    cd ../alfresco-ng2-components
    npm install @angular/material
    cd $CWD
else
    echo -e "\e[32mUsing ADF from installed node_modules.\e[0m"
fi ;
