#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

show_help() {
    echo "Usage: affected-filtered-project.sh"
    echo ""
    echo "-target Project target"
    echo "-tag Filter project with tag"
    echo "-name Filter project with name"
    echo "-test-runner Test runner to use (playwright or protractor)"
}

project_target(){
    PROJECT_TARGET=$1
}

target_options(){
    OPTIONS="$1"
}

test_runner(){
    TEST_RUNNER=$1
}

while [[ $1  == -* ]]; do
    case "$1" in
      -target)  project_target $2; shift 2;;
      -options)  target_options $2; shift 2;;
      -test-runner)  test_runner $2; shift 2;;
      -*) echo "invalid option: $1" 1>&2; show_help; exit 0;;
    esac
done

./node_modules/.bin/tsc -p "./e2e/$E2E_TSCONFIG" || exit 1;
./node_modules/.bin/http-server -c-1 $CONTENT_CE_DIST_PATH -p 4200 > /dev/null &\

if [ "$TEST_RUNNER" == "playwright" ]; then
  echo "Running playwright tests with options $OPTIONS"
  npx playwright test --config $OPTIONS
else
   echo "Running protractor tests with options $OPTIONS"
   echo "./node_modules/.bin/protractor \"./protractor.conf.js\" $OPTIONS || exit 1"
   ./node_modules/.bin/protractor "./protractor.conf.js" $OPTIONS $E2E_PROTRACTOR_OPTS || exit 1
fi
