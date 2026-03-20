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
    const randomBytes = new Uint32Array(length);
    crypto.getRandomValues(randomBytes);
    return Array.from(randomBytes, (byte) => charSet[byte % charSet.length]).join('');
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
        authType: 'BASIC',
        hostBpm: host,
        hostEcm: host,
        provider: 'ECM',
        contextRoot: 'alfresco'
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

        indexed = await waitForIndexing('File', testFileName, async () => {
            const result = await searchApi.search({
                query: { query: `cm:name:"${testFileName}"`, language: 'afts' },
                paging: { skipCount: 0, maxItems: 5 }
            });
            const entries = result?.list?.entries || [];
            return entries.some((entry) => entry.entry?.name === testFileName);
        });
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

async function waitForIndexing(label, name, searchFn) {
    const maxRetries = Math.ceil(INDEXING_TIMEOUT_SECONDS / RETRY_INTERVAL_SECONDS);
    const startTime = Date.now();

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const found = await searchFn();
            if (found) {
                const elapsedSeconds = ((Date.now() - startTime) / 1000).toFixed(1);
                console.info(`[ 🔍 ${label} ] "${name}" indexed after ${elapsedSeconds}s (attempt ${attempt}/${maxRetries}).`);
                return true;
            }
        } catch (error) {
            console.warn(`[ 🔍 ${label} ] Search query failed on attempt ${attempt}: ${error?.message || error}`);
        }

        if (attempt % 10 === 0) {
            const elapsedSeconds = ((Date.now() - startTime) / 1000).toFixed(1);
            console.info(`[ 🔍 ${label} ] Still waiting for "${name}"... ${elapsedSeconds}s elapsed (attempt ${attempt}/${maxRetries}).`);
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

        const adminSearchApiUser = new SearchApi(adminAlfrescoJsApi);
        indexed = await waitForIndexing('User/Group', testUsername, async () => {
            const result = await adminSearchApiUser.search({
                query: {
                    query: `(userName:*${testUsername}* OR email:*${testUsername}* OR firstName:*${testUsername}* OR lastName:*${testUsername}* OR authorityName:*${testUsername}* OR authorityDisplayName:*${testUsername}*) AND PATH:"//cm:APP.DEFAULT/*"`,
                    language: 'afts'
                },
                include: ['properties', 'aspectNames'],
                paging: { skipCount: 0, maxItems: 20 },
                filterQueries: [{ query: "TYPE:'cm:authority'" }]
            });
            const entries = result?.list?.entries || [];
            return entries.length > 0;
        });
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

        const adminSearchApiGroup = new SearchApi(adminAlfrescoJsApi);
        indexed = await waitForIndexing('User/Group', testGroupId, async () => {
            const result = await adminSearchApiGroup.search({
                query: {
                    query: `(userName:*${testGroupId}* OR email:*${testGroupId}* OR firstName:*${testGroupId}* OR lastName:*${testGroupId}* OR authorityName:*${testGroupId}* OR authorityDisplayName:*${testGroupId}*) AND PATH:"//cm:APP.DEFAULT/*"`,
                    language: 'afts'
                },
                include: ['properties', 'aspectNames'],
                paging: { skipCount: 0, maxItems: 20 },
                filterQueries: [{ query: "TYPE:'cm:authority'" }]
            });
            const entries = result?.list?.entries || [];
            return entries.length > 0;
        });
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



async function checkCategoryIndexing(uniqueId) {
    const testCategoryName = `${TEST_PREFIX}-category-${uniqueId}`;
    let createdCategoryId;
    let indexed = false;

    try {
        console.info(`[ 🔍 Category ] Creating test category: ${testCategoryName}`);
        createdCategoryId = (await categoriesApi.createSubcategories('-root-', [{ name: testCategoryName }])).entry?.id;
        console.info(`[ 🔍 Category ] Category "${testCategoryName}" created with id: ${createdCategoryId}`);

        const adminSearchApiCategory = new SearchApi(adminAlfrescoJsApi);
        indexed = await waitForIndexing('Category', testCategoryName, async () => {
            const result = await adminSearchApiCategory.search({
                query: {
                    query: `cm:name:"*${testCategoryName}*" AND TYPE:'cm:category' AND PATH:"/cm:categoryRoot/cm:generalclassifiable//*"`,
                    language: 'afts'
                },
                paging: { skipCount: 0, maxItems: 25 },
                include: ['path']
            });
            const entries = result?.list?.entries || [];
            return entries.some((entry) => entry.entry?.name === testCategoryName);
        });
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



async function delayInSeconds(seconds) {
    await new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

main().catch((error) => {
    console.error('[ 🔍 Search Indexing Check ] Unexpected error:', error);
    exit(1);
});
