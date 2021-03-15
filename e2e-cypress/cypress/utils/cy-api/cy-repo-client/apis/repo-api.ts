/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2020 Alfresco Software Limited
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail.  Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

// import { browser } from 'protractor';
import { AlfrescoApi } from '@alfresco/js-api';
// import { Logger } from '@alfresco/adf-testing';

export abstract class RepoApi {
  alfrescoJsApi = new AlfrescoApi();

  protected constructor(
    public username: string = Cypress.env('params').ADMIN_USERNAME,
    private password: string = Cypress.env('params').ADMIN_PASSWORD
  ) {
    this.alfrescoJsApi.setConfig(Cypress.env('params').config);
  }

  apiAuth(): Promise<any> {
    return this.alfrescoJsApi.login(this.username, this.password);
  }

  protected handleError(message: string, response: any) {
    cy.log(`\n--- ${message} error :`);
    cy.log('\t>>> username: ', this.username);
    cy.log('\t>>> JSON: ', JSON.stringify(Cypress.env('params').config));
    if (response.status && response.response) {
      try {
        cy.log('\t>>> Status: ', response.status);
        cy.log('\t>>> Text: ', response.response.text);
        cy.log('\t>>> Method: ', response.response.error.method);
        cy.log('\t>>> Path: ', response.response.error.path);
      } catch {
        cy.log('\t>>> ', response);
      }
    } else cy.log('\t>>> ', response);
  }
}
