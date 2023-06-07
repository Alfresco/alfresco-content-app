const buildNumber = () => {
    let buildNumber = process.env.GH_BUILD_NUMBER;
    if (!buildNumber) {
        process.env.GH_BUILD_NUMBER = Date.now();
    }

    return process.env.GH_BUILD_NUMBER;
}

module.exports = buildNumber;
