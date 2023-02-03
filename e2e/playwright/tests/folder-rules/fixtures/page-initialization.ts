/*
 * Copyright © 2005 - 2023 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { PersonalFilesPage } from '../page-objects';
import { test as base } from '@playwright/test';
import { ApiClientFactory } from '../../../shared/api/api-client-factory';
import { NodesPage } from "../page-objects";

interface Pages {
    personalFiles: PersonalFilesPage;
    nodesPage: NodesPage
}

interface Api {
    apiClient: ApiClientFactory;
}

export const test = base.extend<Pages & Api>({
    personalFiles: async ({ page }, use) => { await use(new PersonalFilesPage(page)); },
    nodesPage: async ({ page }, use) => { await use(new NodesPage(page)); },
    apiClient: async({}, use) => {
      let apiClient = new ApiClientFactory();
      await apiClient.setUpAcaBackend("admin");
      await use(apiClient);
    }
});

