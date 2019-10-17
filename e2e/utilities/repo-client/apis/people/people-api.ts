/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2019 Alfresco Software Limited
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

import { PersonModel, Person } from './people-api-models';
import { RepoApi } from '../repo-api';
import { PeopleApi as AdfPeopleApi} from '@alfresco/js-api';

export class PeopleApi extends RepoApi {
  peopleApi = new AdfPeopleApi(this.alfrescoJsApi);

  constructor(username?, password?) {
    super(username, password);
  }

  async createUser(user: PersonModel) {
    try {
      const person = new Person(user);
      await this.apiAuth();
      return await this.peopleApi.createPerson(person);
    } catch (error) {
      console.log('--- people api createUser catch error: ', error);
      return null;
    }
  }

  async getUser(username: string) {
    try {
      await this.apiAuth();
      return await this.peopleApi.getPerson(username);
    } catch (error) {
      console.log('--- people api getUser catch error: ', error);
      return null;
    }
  }

  async updateUser(username: string, userDetails?: PersonModel) {
    try {
      await this.apiAuth();
      return this.peopleApi.updatePerson(username, userDetails);
    } catch (error) {
      console.log('--- people api updateUser catch error: ', error);
      return null;
    }
  }

  async disableUser(username: string) {
    try {
      return await this.updateUser(username, { enabled: false });
    } catch (error) {
      console.log('--- people api disableUser catch error: ', error);
      return null;
    }
  }

  async changePassword(username: string, newPassword: string) {
    try {
      return await this.updateUser(username, { password: newPassword });
    } catch (error) {
      console.log('--- people api changePassword catch error: ', error);
      return null;
    }
  }
}
