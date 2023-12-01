/*
 * Copyright © 2005 - 2021 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

export const getExcludedTestsRegExpArray = (excludedJson: any, projectName: string) => {
    const prefix = `[ 🎭 Playwright Excludes - ${projectName} ]`;
    const objectKeys = Object.keys(excludedJson);

    if (!objectKeys.length) {
        console.info(`${prefix} ✅ No excluded tests 🎉 `);
    } else {
        console.warn(`${prefix} ❌ Tests excluded because of 🐛 : ${objectKeys}`);
    }

    return objectKeys.map((key) => new RegExp(key));
};
