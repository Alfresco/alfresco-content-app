/*!
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

import { PersonEntry, PeopleApi } from '@alfresco/js-api';
import { PersonModel, SitesApi, UploadApi, NodesApi, Person, SharedLinksApi } from './repo-client/apis';
import { UserActions } from './user-actions';
import { browser } from 'protractor';

export class AdminActions extends UserActions {
  sites: SitesApi = new SitesApi();
  upload: UploadApi = new UploadApi();
  nodes: NodesApi = new NodesApi();
  shared: SharedLinksApi = new SharedLinksApi();

  async login(username?: string, password?: string) {
    return super.login(username || browser.params.ADMIN_USERNAME, password || browser.params.ADMIN_PASSWORD);
  }

  async createUser(user: PersonModel): Promise<PersonEntry> {
    const person = new Person(user);
    const peopleApi = new PeopleApi(this.alfrescoApi);

    await this.login();
    try {
      return peopleApi.createPerson(person);
    } catch (error) {
      super.handleError('Admin Actions - createUser failed : ', error);
      return null;
    }
  }
}
