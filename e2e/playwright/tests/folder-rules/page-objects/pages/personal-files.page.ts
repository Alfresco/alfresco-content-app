/*
 * Copyright © 2005 - 2023 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { BasePage } from '../../../../shared/page-objects/pages/base.page';
import { Page } from '@playwright/test';
import { DataTableComponent } from '../../../../shared/page-objects/components/dataTable/data-table.component';

export class PersonalFilesPage extends BasePage {
  private static pageUrl = 'personal-files';

  constructor(page: Page) {
    super(page, PersonalFilesPage.pageUrl);
  }

  public dataTable = new DataTableComponent(this.page);
}
