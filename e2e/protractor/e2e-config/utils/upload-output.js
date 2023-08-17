const path = require('node:path');
const fs = require('node:fs');
const child_process = require('node:child_process');
const { AlfrescoApi, NodesApi, UploadApi } = require('@alfresco/js-api');
const buildNumber = require('./build-number');
const outputDir = path.resolve(__dirname, '../../../e2e-output/');

async function saveScreenshots(retryCount) {
  const folderName = process.env.GITHUB_JOB;
  console.log(`Start uploading report in ${folderName}`);

  const alfrescoJsApi = new AlfrescoApi({
    provider: 'ECM',
    hostEcm: process.env.SCREENSHOT_URL
  });

  const nodesApi = new NodesApi(alfrescoJsApi);
  const uploadApi = new UploadApi(alfrescoJsApi);

  await alfrescoJsApi.login(process.env.SCREENSHOT_USERNAME, process.env.SCREENSHOT_PASSWORD);

  let folderNode;

  try {
    folderNode = await nodesApi.createNode(
      '-my-',
      {
        name: `retry-${retryCount}`,
        relativePath: `Builds/ACA-${buildNumber()}/${folderName}/`,
        nodeType: 'cm:folder'
      },
      {},
      {
        overwrite: true
      }
    );
  } catch (error) {
    folderNode = await nodesApi.createNode(
      '-my-',
      {
        relativePath: `Builds/ACA-${buildNumber()}/${folderName}/retry-${retryCount}`,
        nodeType: 'cm:folder'
      },
      {},
      {
        overwrite: true
      }
    );
  }

  fs.renameSync(outputDir, path.join(`${outputDir}-${folderName}-${retryCount}/`));

  child_process.execSync(` tar -czvf ../e2e-result-${folderName}-${retryCount}.tar .`, {
    cwd: `${outputDir}-${folderName}-${retryCount}/`
  });

  const pathFile = path.join(outputDir, `../e2e-result-${folderName}-${retryCount}.tar`);
  const file = fs.createReadStream(pathFile);

  await uploadApi.uploadFile(file, '', folderNode.entry.id, null, {
    name: `e2e-result-${folderName}-${retryCount}.tar`,
    nodeType: 'cm:content',
    autoRename: true
  });
}

module.exports = {
  saveScreenshots: saveScreenshots
};
