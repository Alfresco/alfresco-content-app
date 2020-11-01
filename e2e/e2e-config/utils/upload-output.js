const fs = require('fs');
const path = require('path');
const AlfrescoApi = require('@alfresco/js-api').AlfrescoApiCompatibility;

function buildNumber() {
  let buildNumber = process.env.TRAVIS_BUILD_NUMBER;
  if (!buildNumber) {
    process.env.TRAVIS_BUILD_NUMBER = Date.now();
  }

  return process.env.TRAVIS_BUILD_NUMBER;
}

async function uploadScreenshot(retryCount) {
  console.log(`Start uploading report ${retryCount}`);

  let alfrescoJsApi = new AlfrescoApi({
    provider: 'ECM',
    hostEcm: process.env.SCREENSHOT_URL
  });

  await alfrescoJsApi.login(process.env.SCREENSHOT_USERNAME, process.env.SCREENSHOT_PASSWORD);

  let folderNode;

  const screenshotSavePath = `Builds/ACA/${buildNumber()}/${process.env.TRAVIS_JOB_NAME.replace(/[^a-z0-9]/gi, '_').toLowerCase()}`;

  try {
    folderNode = await alfrescoJsApi.nodes.addNode(
      '-my-',
      {
        name: `retry-${retryCount}`,
        relativePath: screenshotSavePath,
        nodeType: 'cm:folder'
      },
      {},
      {
        overwrite: true
      }
    );
  } catch (error) {
    folderNode = await alfrescoJsApi.nodes.getNode(
      '-my-',
      {
        relativePath: `${screenshotSavePath}/retry-${retryCount}`,
        nodeType: 'cm:folder'
      },
      {},
      {
        overwrite: true
      }
    );
  }

  const screenShotsPath = path.resolve(__dirname, '../../../e2e-output/screenshots/');
  let files = fs.readdirSync(screenShotsPath);
  for (const fileName of files) {
    let pathFile = path.join(screenShotsPath, fileName);
    let file = fs.createReadStream(pathFile);

    let safeFileName = fileName.replace(new RegExp('"', 'g'), '');

    try {
      await alfrescoJsApi.upload.uploadFile(file, '', folderNode.entry.id, null, {
        name: safeFileName,
        nodeType: 'cm:content',
        autoRename: true
      });
    } catch (error) {
      console.log(error);
    }
  }

  fs.renameSync(path.resolve(__dirname, '../../../e2e-output/'), path.resolve(__dirname, `../../e2e-output-${retryCount}/`));

  const child_process = require('child_process');
  child_process.execSync(` tar -czvf ../e2e-result-${process.env.TRAVIS_JOB_NUMBER}-${retryCount}.tar .`, {
    cwd: path.resolve(__dirname, `../../e2e-output-${retryCount}/`)
  });

  let pathFile = path.join(__dirname, `../../e2e-result-${process.env.TRAVIS_JOB_NUMBER}-${retryCount}.tar`);
  let file = fs.createReadStream(pathFile);
  await alfrescoJsApi.upload.uploadFile(file, '', folderNode.entry.id, null, {
    name: `e2e-result-${process.env.TRAVIS_JOB_NUMBER}-${retryCount}.tar`,
    nodeType: 'cm:content',
    autoRename: true
  });
  fs.rmdirSync(path.resolve(__dirname, `../../e2e-output-${retryCount}/`), { recursive: true });
}

module.exports = {
  uploadScreenshot: uploadScreenshot
};
