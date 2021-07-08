const path = require('path');
const fs = require('fs');
const AlfrescoApi = require('@alfresco/js-api').AlfrescoApiCompatibility;
const buildNumber = require('./build-number');
const outputDir = path.resolve(__dirname, '../../../e2e-output/');

async function saveScreenshots(retryCount) {
  const folderName = process.env.TRAVIS_JOB_NAME.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  console.log(`Start uploading report in ${folderName}`);

  let alfrescoJsApi = new AlfrescoApi({
    provider: 'ECM',
    hostEcm: process.env.SCREENSHOT_URL
  });

  await alfrescoJsApi.login(process.env.SCREENSHOT_USERNAME, process.env.SCREENSHOT_PASSWORD);

  let folderNode;

  try {
    folderNode = await alfrescoJsApi.nodes.addNode('-my-', {
      'name': `retry-${retryCount}`,
      'relativePath': `Builds/ACA-${buildNumber()}/${folderName}/`,
      'nodeType': 'cm:folder'
    }, {}, {
      'overwrite': true
    });
  } catch (error) {
    folderNode = await alfrescoJsApi.nodes.getNode('-my-', {
      'relativePath': `Builds/ACA-${buildNumber()}/${folderName}/retry-${retryCount}`,
      'nodeType': 'cm:folder'
    }, {}, {
      'overwrite': true
    });
  }

  fs.renameSync(outputDir, path.join(`${outputDir}-${folderName}-${retryCount}/`));

  const child_process = require("child_process");
  child_process.execSync(` tar -czvf ../e2e-result-${folderName}-${retryCount}.tar .`, {
    cwd: `${outputDir}-${folderName}-${retryCount}/`
  });

  let pathFile = path.join(outputDir, `../e2e-result-${folderName}-${retryCount}.tar`);

  let file = fs.createReadStream(pathFile);
  await alfrescoJsApi.upload.uploadFile(
    file,
    '',
    folderNode.entry.id,
    null,
    {
      'name': `e2e-result-${folderName}-${retryCount}.tar`,
      'nodeType': 'cm:content',
      'autoRename': true
    }
  );

}

module.exports = {
  saveScreenshots: saveScreenshots
};
