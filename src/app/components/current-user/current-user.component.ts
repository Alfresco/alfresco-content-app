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

import { Component, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  selectUser,
  appLanguagePicker
} from '../../store/selectors/app.selectors';
import { ProfileState } from '@alfresco/adf-extensions';
import { AppStore, SetSelectedNodesAction } from '@alfresco/aca-shared/store';
import { AppService } from '../../services/app.service';

@Component({
  selector: 'aca-current-user',
  templateUrl: './current-user.component.html',
  encapsulation: ViewEncapsulation.None,
  host: { class: 'aca-current-user' }
})
export class CurrentUserComponent {
  profile$: Observable<ProfileState>;
  languagePicker$: Observable<boolean>;

  get showLogout(): boolean {
    return !this.appService.withCredentials;
  }

  constructor(private store: Store<AppStore>, private appService: AppService) {
    this.profile$ = this.store.select(selectUser);
    this.languagePicker$ = store.select(appLanguagePicker);
  }

  onLogoutEvent() {
    this.store.dispatch(new SetSelectedNodesAction([]));
  }
}
