npm run build.e2e -- --base-href ./

node -e "
const fs = require('fs');
const config = require('./dist/app/app.config.json');
config.baseShareUrl = 'http://localhost:8080/content-app/#/preview/s/';
fs.writeFileSync(
  './dist/app/app.config.json',
  JSON.stringify(config, null, 2)
);
"

jar -cvf docker/tomcat/artifacts/content-app.war -C dist/app/ .
