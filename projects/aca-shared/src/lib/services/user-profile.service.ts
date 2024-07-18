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
 * from Hyland Software. If not, see <http://www.gnu.org/licenses/>.
 */

import { inject, Injectable } from '@angular/core';
import { ProfileState } from '@alfresco/adf-extensions';
import { GroupService } from '@alfresco/adf-content-services';
import { BehaviorSubject } from 'rxjs';
import { AlfrescoApiService } from '@alfresco/adf-core';
import { PeopleApi } from '@alfresco/js-api';

@Injectable({ providedIn: 'root' })
export class UserProfileService {
  private api = inject(AlfrescoApiService);
  private groupService = inject(GroupService);

  private get peopleApi(): PeopleApi {
    return new PeopleApi(this.api.getInstance());
  }

  private userProfile = new BehaviorSubject<ProfileState>(null);
  userProfile$ = this.userProfile.asObservable();

  /**
   * Load user profile.
   */
  async loadUserProfile(): Promise<ProfileState> {
    const groupsEntries = await this.groupService.listAllGroupMembershipsForPerson('-me-', { maxItems: 250 });

    const groups = [];
    if (groupsEntries) {
      groups.push(...groupsEntries.map((obj) => obj.entry));
    }

    const { entry: user } = await this.peopleApi.getPerson('-me-');

    const id = user.id;
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    const userName = `${firstName} ${lastName}`;
    const initials = [firstName[0], lastName[0]].join('');
    const email = user.email;

    const capabilities = user.capabilities;
    const isAdmin = capabilities ? capabilities.isAdmin : true;

    const profile: ProfileState = {
      firstName,
      lastName,
      userName,
      initials,
      isAdmin,
      id,
      groups,
      email
    };

    this.userProfile.next(profile);
    return profile;
  }
}
