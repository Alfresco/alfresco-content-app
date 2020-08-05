const uploadOutput = require('../utils/upload-output');

const SAVE_SCREENSHOT = process.env.SAVE_SCREENSHOT === 'true';

async function afterLaunch() {

    if (SAVE_SCREENSHOT) {
        console.log(`Save screenshot is ${SAVE_SCREENSHOT}, trying to save screenshots.`);

        try {
            await uploadOutput();
            console.log('Screenshots saved successfully.');
        } catch (e) {
            console.log('Error happened while trying to upload screenshots and test reports: ', e);
        }
    } else {
        console.log(`Save screenshot is ${SAVE_SCREENSHOT}, no need to save screenshots.`);
    }
}

module.exports = afterLaunch;
