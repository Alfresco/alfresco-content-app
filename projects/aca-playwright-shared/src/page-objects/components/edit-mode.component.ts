/*!
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Alfresco Example Content Application
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail. Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * from Hyland Software. If not, see <http://www.gnu.org/licenses/>.
 */

import { BaseComponent } from './base.component';
import { Page } from '@playwright/test';

export class EditModeComponent extends BaseComponent {
  private static readonly rootElement = '.aca-details-container';

  constructor(page: Page) {
    super(page, EditModeComponent.rootElement);
  }

  public tagsAccordion = this.page.locator('[data-automation-id="adf-content-metadata-tags-panel"]');
  public tagsAccordionPenButton = this.tagsAccordion.locator('[data-automation-id="showing-tag-input-button"]');
  public tagsInput = this.tagsAccordion.locator('input');
  public tagsChips = this.tagsAccordion.locator('[role="listitem"]');
  public tagsAccordionConfirmButton = this.getChild('[data-automation-id="save-tags-metadata"]');
  public createTagButton = this.tagsAccordion.locator('.adf-create-tag-label');
  public existingTags = this.tagsAccordion.locator('.adf-tag');

  public categoriesAccordion = this.page.locator('[data-automation-id="adf-content-metadata-categories-panel"]');
  public categoriesAccordionPenButton = this.categoriesAccordion.locator('[data-automation-id="meta-data-categories-edit"]');
  public categoriesInput = this.categoriesAccordion.locator('input');
}
