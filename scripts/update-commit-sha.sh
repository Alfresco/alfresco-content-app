#!/usr/bin/env bash
eval GNU=false

show_help() {
    echo "Usage: update-commit-sha.sh"
    echo ""
    echo "-gnu for gnu"
}

gnu_mode() {
    echo "====== GNU MODE ====="
    GNU=true
}

while [[ $1 == -* ]]; do
    case "$1" in
      -h|--help|-\?) show_help; exit 0;;
      -gnu) gnu_mode; shift;;
      -*) echo "invalid option: $1" 1>&2; show_help; exit 1;;
    esac
done

npm install @alfresco/adf-cli@alpha
if $GNU; then
    ./node_modules/@alfresco/adf-cli/bin/adf-cli update-commit-sha --pointer "HEAD" --pathPackage "$(pwd)"
else
    ./node_modules/@alfresco/adf-cli/bin/adf-cli update-commit-sha --pointer "HEAD" --pathPackage "$(pwd)" --skipGnu
fi

