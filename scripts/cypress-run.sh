#!/usr/bin/env bash

cd e2e-cypress && npm run cypress:run --group admin-tests --spec 'e2e-cypress/cypress/integration/**/*'
