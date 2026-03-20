#!/usr/bin/env node

/*
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * License rights for this program may be obtained from Hyland Software, Inc.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { AlfrescoApi, NodesApi, SearchApi, PeopleApi, GroupsApi, CategoriesApi } from '@alfresco/js-api';
import { exit } from 'node:process';

function generateRandomString(length = 8) {
    const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let text = '';
    for (let i = 0; i < length; i++) {
        text += charSet.charAt(Math.floor(Math.random() * charSet.length));
    }
    return text;
}

const INDEXING_TIMEOUT_SECONDS = 80;
const RETRY_INTERVAL_SECONDS = 2;
const TEST_PREFIX = 'search-indexing-check';

let alfrescoJsApi;
let adminAlfrescoJsApi;
let nodesApi;
let searchApi;
let peopleApi;
let groupsApi;
let categoriesApi;

async function main() {
    const host = process.env.BASE_URL;
    const username = process.env.HR_USER;
    const password = process.env.HR_USER_PASSWORD;
    const adminUsername = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD_SCRIPT;

    if (!host || !username || !password) {
        console.error('[ 🔍 Search Indexing Check ] Missing required parameters: host, username, or password');
        exit(1);
    }

    console.info(`[ 🔍 Search Indexing Check ] Checking search indexing on: ${host}`);

    const oauthConfig = {
        provider: 'ALL',
        hostBpm: host,
        hostEcm: host,
        authType: 'OAUTH',
        contextRoot: 'alfresco',
        oauth2: {
            host: `${host}/auth/realms/alfresco`,
            clientId: 'alfresco',
            scope: 'openid',
            redirectUri: '/'
        }
    };

    try {
        alfrescoJsApi = new AlfrescoApi(oauthConfig);
        await alfrescoJsApi.login(username, password);
        console.info('[ 🔍 Search Indexing Check ] Successfully logged in as regular user.');
    } catch (error) {
        console.error('[ 🔍 Search Indexing Check ] Regular user login failed:', error?.message || error);
        exit(1);
    }

    nodesApi = new NodesApi(alfrescoJsApi);
    searchApi = new SearchApi(alfrescoJsApi);

    if (adminUsername && adminPassword) {
        try {
            adminAlfrescoJsApi = new AlfrescoApi(oauthConfig);
            await adminAlfrescoJsApi.login(adminUsername, adminPassword);
            console.info('[ 🔍 Search Indexing Check ] Successfully logged in as admin user.');
        } catch (error) {
            console.warn('[ 🔍 Search Indexing Check ] Admin login failed, skipping user/group/category checks:', error?.message || error);
        }
    } else {
        console.warn('[ 🔍 Search Indexing Check ] Admin credentials not provided, skipping user/group/category checks.');
    }

    if (adminAlfrescoJsApi) {
        peopleApi = new PeopleApi(adminAlfrescoJsApi);
        groupsApi = new GroupsApi(adminAlfrescoJsApi);
        categoriesApi = new CategoriesApi(adminAlfrescoJsApi);
    }

    const uniqueId = Date.now();
    const results = {
        file: await checkFileIndexing(uniqueId),
        user: adminAlfrescoJsApi ? await checkUserIndexing(uniqueId) : null,
        group: adminAlfrescoJsApi ? await checkGroupIndexing(uniqueId) : null,
        category: adminAlfrescoJsApi ? await checkCategoryIndexing(uniqueId) : null
    };

    printSummary(results);
}

function printSummary(results) {
    console.info('[ 🔍 Search Indexing Check ] === Summary ===');

    const labels = {
        file: 'File',
        user: 'User',
        group: 'Group',
        category: 'Category'
    };

    let hasFailure = false;

    for (const [key, result] of Object.entries(results)) {
        if (result === null) {
            console.info(`[ 🔍 Search Indexing Check ] ⏭️  ${labels[key]}: skipped (admin credentials not provided).`);
        } else if (result.indexed) {
            console.info(`[ 🔍 Search Indexing Check ] ✅ ${labels[key]} "${result.name}" was indexed within ${INDEXING_TIMEOUT_SECONDS}s.`);
        } else {
            console.error(`[ 🔍 Search Indexing Check ] ❌ ${labels[key]} "${result.name}" was NOT indexed within ${INDEXING_TIMEOUT_SECONDS}s.`);
            hasFailure = true;
        }
    }

    if (hasFailure) {
        console.warn(
            '[ 🔍 Search Indexing Check ] ⚠️  Search indexing appears to be down or degraded. Tests may experience search-related failures.'
        );
        exit(1);
    }
}

async function checkFileIndexing(uniqueId) {
    const testFileName = `${TEST_PREFIX}-file-${uniqueId}.txt`;
    let createdNodeId;
    let indexed = false;

    try {
        console.info(`[ 🔍 File ] Creating test file: ${testFileName}`);
        const createdNode = await nodesApi.createNode('-my-', {
            name: testFileName,
            nodeType: 'cm:content'
        });
        createdNodeId = createdNode.entry.id;
        console.info(`[ 🔍 File ] File created with id: ${createdNodeId}`);

        indexed = await waitForFileIndexing(testFileName);
    } catch (error) {
        console.error(`[ 🔍 File ] Error during file indexing check: ${error?.message || error}`);
    } finally {
        if (createdNodeId) {
            try {
                await nodesApi.deleteNode(createdNodeId, { permanent: true });
                console.info(`[ 🔍 File ] Test file "${testFileName}" deleted successfully.`);
            } catch (error) {
                console.warn(`[ 🔍 File ] Failed to delete test file "${testFileName}": ${error?.message || error}`);
            }
        } else {
            console.warn(`[ 🔍 File ] No node ID found for "${testFileName}", skipping deletion.`);
        }
    }

    return { name: testFileName, indexed };
}

async function waitForFileIndexing(fileName) {
    const maxRetries = Math.ceil(INDEXING_TIMEOUT_SECONDS / RETRY_INTERVAL_SECONDS);
    const startTime = Date.now();

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const result = await searchApi.search({
                query: {
                    query: `cm:name:"${fileName}"`,
                    language: 'afts'
                },
                paging: { skipCount: 0, maxItems: 5 }
            });

            const entries = result?.list?.entries || [];
            const found = entries.some((entry) => entry.entry?.name === fileName);

            if (found) {
                const elapsedSeconds = ((Date.now() - startTime) / 1000).toFixed(1);
                console.info(`[ 🔍 File ] File indexed after ${elapsedSeconds}s (attempt ${attempt}/${maxRetries}).`);
                return true;
            }
        } catch (error) {
            console.warn(`[ 🔍 File ] Search query failed on attempt ${attempt}: ${error?.message || error}`);
        }

        if (attempt % 10 === 0) {
            const elapsedSeconds = ((Date.now() - startTime) / 1000).toFixed(1);
            console.info(`[ 🔍 File ] Still waiting... ${elapsedSeconds}s elapsed (attempt ${attempt}/${maxRetries}).`);
        }

        await delayInSeconds(RETRY_INTERVAL_SECONDS);
    }

    return false;
}

async function checkUserIndexing(uniqueId) {
    const testUsername = `${generateRandomString(5)}-${uniqueId}`;
    const email = `${generateRandomString(5)}`;
    const firstName = `${generateRandomString(5)}`;
    const lastName = `${generateRandomString(5)}`;
    const password = `${generateRandomString(5)}`;
    let indexed = false;

    try {
        console.info(`[ 🔍 User ] Creating test user: ${testUsername}`);
        await peopleApi.createPerson({
            id: testUsername,
            email,
            firstName,
            lastName,
            password
        });
        console.info(`[ 🔍 User ] User "${testUsername}" created successfully.`);

        indexed = await waitForUserOrGroupIndexing(testUsername);
    } catch (error) {
        console.error(`[ 🔍 User ] Error during user indexing check: ${error?.message || error}`);
    }

    return { name: testUsername, indexed };
}

async function checkGroupIndexing(uniqueId) {
    const testGroupId = `${TEST_PREFIX}-group-${uniqueId}`;
    const testGroupDisplayName = `SearchCheckGroup ${uniqueId}`;
    let created = false;
    let indexed = false;

    try {
        console.info(`[ 🔍 Group ] Creating test group: ${testGroupDisplayName}`);
        await groupsApi.createGroup({
            id: testGroupId,
            displayName: testGroupDisplayName
        });
        created = true;
        console.info(`[ 🔍 Group ] Group "${testGroupDisplayName}" created successfully.`);

        indexed = await waitForUserOrGroupIndexing(testGroupId);
    } catch (error) {
        console.error(`[ 🔍 Group ] Error during group indexing check: ${error?.message || error}`);
    } finally {
        if (created) {
            try {
                await groupsApi.deleteGroup(`GROUP_${testGroupId}`);
                console.info(`[ 🔍 Group ] Test group "${testGroupDisplayName}" deleted successfully.`);
            } catch (error) {
                console.warn(`[ 🔍 Group ] Failed to delete test group "${testGroupDisplayName}": ${error?.message || error}`);
            }
        } else {
            console.warn(`[ 🔍 Group ] Group "${testGroupDisplayName}" was not created, skipping deletion.`);
        }
    }

    return { name: testGroupDisplayName, indexed };
}

async function waitForUserOrGroupIndexing(searchTerm) {
    const adminSearchApi = new SearchApi(adminAlfrescoJsApi);
    const maxRetries = Math.ceil(INDEXING_TIMEOUT_SECONDS / RETRY_INTERVAL_SECONDS);
    const startTime = Date.now();

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const result = await adminSearchApi.search({
                query: {
                    query: `(userName:*${searchTerm}* OR email:*${searchTerm}* OR firstName:*${searchTerm}* OR lastName:*${searchTerm}* OR authorityName:*${searchTerm}* OR authorityDisplayName:*${searchTerm}*) AND PATH:"//cm:APP.DEFAULT/*"`,
                    language: 'afts'
                },
                include: ['properties', 'aspectNames'],
                paging: { skipCount: 0, maxItems: 20 },
                filterQueries: [{ query: "TYPE:'cm:authority'" }]
            });

            const entries = result?.list?.entries || [];
            if (entries.length > 0) {
                const elapsedSeconds = ((Date.now() - startTime) / 1000).toFixed(1);
                console.info(`[ 🔍 User/Group ] "${searchTerm}" indexed after ${elapsedSeconds}s (attempt ${attempt}/${maxRetries}).`);
                return true;
            }
        } catch (error) {
            console.warn(`[ 🔍 User/Group ] Search query failed on attempt ${attempt}: ${error?.message || error}`);
        }

        if (attempt % 10 === 0) {
            const elapsedSeconds = ((Date.now() - startTime) / 1000).toFixed(1);
            console.info(`[ 🔍 User/Group ] Still waiting for "${searchTerm}"... ${elapsedSeconds}s elapsed (attempt ${attempt}/${maxRetries}).`);
        }

        await delayInSeconds(RETRY_INTERVAL_SECONDS);
    }

    return false;
}

async function checkCategoryIndexing(uniqueId) {
    const testCategoryName = `${TEST_PREFIX}-category-${uniqueId}`;
    let createdCategoryId;
    let indexed = false;

    try {
        console.info(`[ 🔍 Category ] Creating test category: ${testCategoryName}`);
        createdCategoryId = (await categoriesApi.createSubcategories('-root-', [{ name: testCategoryName }])).entry?.id;
        console.info(`[ 🔍 Category ] Category "${testCategoryName}" created with id: ${createdCategoryId}`);

        indexed = await waitForCategoryIndexing(testCategoryName);
    } catch (error) {
        console.error(`[ 🔍 Category ] Error during category indexing check: ${error?.message || error}`);
    } finally {
        if (createdCategoryId) {
            try {
                await categoriesApi.deleteCategory(createdCategoryId);
                console.info(`[ 🔍 Category ] Test category "${testCategoryName}" deleted successfully.`);
            } catch (error) {
                console.warn(`[ 🔍 Category ] Failed to delete test category "${testCategoryName}": ${error?.message || error}`);
            }
        } else {
            console.warn(`[ 🔍 Category ] No category ID found for "${testCategoryName}", skipping deletion.`);
        }
    }

    return { name: testCategoryName, indexed };
}

async function waitForCategoryIndexing(categoryName) {
    const adminSearchApi = new SearchApi(adminAlfrescoJsApi);
    const maxRetries = Math.ceil(INDEXING_TIMEOUT_SECONDS / RETRY_INTERVAL_SECONDS);
    const startTime = Date.now();

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const result = await adminSearchApi.search({
                query: {
                    query: `cm:name:"*${categoryName}*" AND TYPE:'cm:category' AND PATH:"/cm:categoryRoot/cm:generalclassifiable//*"`,
                    language: 'afts'
                },
                paging: { skipCount: 0, maxItems: 25 },
                include: ['path']
            });

            const entries = result?.list?.entries || [];
            const found = entries.some((entry) => entry.entry?.name === categoryName);

            if (found) {
                const elapsedSeconds = ((Date.now() - startTime) / 1000).toFixed(1);
                console.info(`[ 🔍 Category ] Category indexed after ${elapsedSeconds}s (attempt ${attempt}/${maxRetries}).`);
                return true;
            }
        } catch (error) {
            console.warn(`[ 🔍 Category ] Search query failed on attempt ${attempt}: ${error?.message || error}`);
        }

        if (attempt % 10 === 0) {
            const elapsedSeconds = ((Date.now() - startTime) / 1000).toFixed(1);
            console.info(`[ 🔍 Category ] Still waiting... ${elapsedSeconds}s elapsed (attempt ${attempt}/${maxRetries}).`);
        }

        await delayInSeconds(RETRY_INTERVAL_SECONDS);
    }

    return false;
}

async function delayInSeconds(seconds) {
    await new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

main().catch((error) => {
    console.error('[ 🔍 Search Indexing Check ] Unexpected error:', error);
    exit(1);
});
