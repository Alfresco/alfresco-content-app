#!/usr/bin/env bash

BUILD_PIPELINE_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
REPO_DIR="$BUILD_PIPELINE_DIR/../.."

TEMP_GENERATOR_DIR=".tmp-generator";
BRANCH_TO_CREATE="update-alfresco-aca-dependencies"
TOKEN=""
PR_NUMBER=""
DRY_RUN="false"

show_help() {
    echo "Usage: update-project.sh"
    echo ""
    echo "-t or --token: Github ouath token"
    echo "-p or --pr: Originating ACA PR number"
    echo "-v or --version: version to update"
    echo "-c or --commit: commit"
    echo "-d or --dry-run: The script won't execute critical operation, just simulate them"
    echo "-r or --repo: Repository to update"
}

set_token() {
    TOKEN=$1
}

set_pr() {
    PR_NUMBER=$1
}

version() {
    VERSION=$1
}

set_commit() {
    COMMIT=$1
}

set_dryrun() {
    DRY_RUN="true"
}

set_repo() {
    REPO=$1
}


update_dependency() {
    PKG=$1
    PKG_VERSION=$(npm view $PKG@$VERSION version)
    echo "Update $PKG to $PKG_VERSION in $REPO"

    for i in $(find . ! -path "*/node_modules/*" -name "package-lock.json" | xargs grep -l $PKG); do
        directory=$(dirname $i)
        echo "Update $PKG in  $directory"
        ( cd $directory ; npm i --ignore-scripts $PKG@$PKG_VERSION --save-exact)
    done

    git add .
    git commit -n -m "[ci:force][auto-commit] Update $PKG to $PKG_VERSION for branch: $BRANCH_TO_CREATE originated from $PKG PR: $PR_NUMBER"
}

update() {
    PKG_VERSION=$(npm view $PKG@$VERSION version)
    echo "Update dependencies $REPO"

    git clone https://$TOKEN@github.com/Alfresco/$REPO.git $TEMP_GENERATOR_DIR
    cd $TEMP_GENERATOR_DIR

    git fetch

    # Checkout branch if exist, otherwise create it
    BRANCH_CREATED=false
    if git checkout $BRANCH_TO_CREATE 2>/dev/null ; then
        git reset --hard origin/develop
    else
        BRANCH_CREATED=true
        git checkout -b $BRANCH_TO_CREATE origin/develop
    fi

    update_dependency "@alfresco/aca-shared"
    update_dependency "@alfresco/aca-content"
    update_dependency "@alfresco/aca-preview"
    update_dependency "@alfresco/aca-viewer"
    update_dependency "@alfresco/aca-folder-rules"

    if [ "$BRANCH_CREATED" = true ]; then
        git push origin $BRANCH_TO_CREATE
    else
        git push --force origin $BRANCH_TO_CREATE
    fi

    node $BUILD_PIPELINE_DIR/pr-creator.js --token=$TOKEN --title="Update branch for ACA ${PKG_VERSION} [ci:force]" --head=$BRANCH_TO_CREATE --repo=$REPO --commit=$COMMIT

    cd ..
    rm -rf $TEMP_GENERATOR_DIR
}

while [[ $1 == -* ]]; do
    case "$1" in
      -h|--help|-\?) show_help; exit 0;;
      -t|--token) set_token $2; shift; shift;;
      -p|--pr) set_pr $2; shift; shift;;
      -v|--version)  version $2; shift 2;;
      -c|--commit) set_commit $2; shift 2;;
      -d|--dry-run) set_dryrun $2; shift; shift;;
      -r|--repo) set_repo $2; shift; shift;;
      -*) echo "invalid option: $1" 1>&2; show_help; exit 1;;
    esac
done

cd "$REPO_DIR"

if [[ (-z "$TOKEN") || (-z "$VERSION") ]]
  then
    echo "Each of 'branch name' (-b)  token (-t) pr number (-p) and repo (-r) have to be set. See -help."
    exit 1;
fi

rm -rf $TEMP_GENERATOR_DIR

isSameACASha=$(node $BUILD_PIPELINE_DIR/aca-same-commit-verify.js --token=$TOKEN --head=$BRANCH_TO_CREATE --repo=$REPO --commit=$COMMIT )
if [ "$isSameACASha" = 'true' ]; then
        echo 'ACA sha is the same. No need to create another pr'
    else
        if [ "$DRY_RUN" = "false" ]; then
            update $REPO
        else
            echo "[dry-run] it would have update $REPO repo"
        fi
fi

exit $?
