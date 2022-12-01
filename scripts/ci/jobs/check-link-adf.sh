#!/usr/bin/env bash

BRANCH=`echo $COMMIT_MESSAGE | grep -o "\[link-adf\:[^]]*\]" | sed -e 's#\[link-adf:##g' | sed -e 's#\]##g'`
echo -e "\e[31mPRs are not mergeable with conditional build. This build was run with custom ADF branch: $BRANCH \e[0m"
exit 1
