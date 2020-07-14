const path = require('path');
const fs = require('fs');
const AlfrescoApi = require('@alfresco/js-api').AlfrescoApiCompatibility;
const buildNumber = require('./build-number');
const configScreenshotsPath = path.join(`${path.resolve(__dirname)}/../../../e2e-output/screenshots/`);
const rimraf = require('rimraf');

uploadOutput = async function() {

    let alfrescoJsApi = new AlfrescoApi({ provider: 'ECM', hostEcm: process.env.SCREENSHOT_URL });
    alfrescoJsApi.login(process.env.SCREENSHOT_USERNAME, process.env.SCREENSHOT_PASSWORD);

    await saveScreenshots(alfrescoJsApi);

    rimraf(configScreenshotsPath, function () {
        console.log('done delete screenshot');
    });
}

async function saveScreenshots(alfrescoJsApi) {
    let files = fs.readdirSync(configScreenshotsPath);

    if (files && files.length > 0) {

        let folder;

        try {
            folder = await alfrescoJsApi.nodes.addNode('-my-', {
                'name': `screenshot`,
                'relativePath': `Builds/ACA-${buildNumber()}`,
                'nodeType': 'cm:folder'
            }, {}, {
                'overwrite': true
            });
        } catch (error) {
            folder = await alfrescoJsApi.nodes.getNode('-my-', {
                'relativePath': `Builds/ACA-${buildNumber()}/screenshot`,
                'nodeType': 'cm:folder'
            }, {}, {
                'overwrite': true
            });
        }

        for (const fileName of files) {
            let pathFile = path.join(configScreenshotsPath, fileName);
            let file = fs.createReadStream(pathFile);

            let safeFileName = fileName.replace(new RegExp('"', 'g'), '');

            try {
                await alfrescoJsApi.upload.uploadFile(
                    file,
                    '',
                    folder.entry.id,
                    null,
                    {
                        'name': safeFileName,
                        'nodeType': 'cm:content',
                        'autoRename': true
                    }
                );
            }catch(error){
                console.log(error);
            }
        }
    }
};

module.exports = uploadOutput;
