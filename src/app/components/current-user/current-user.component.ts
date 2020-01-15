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

import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ProfileState, ContentActionRef } from '@alfresco/adf-extensions';
import {
  AppStore,
  getUserProfile,
  getLanguagePickerState
} from '@alfresco/aca-shared/store';
import { AppExtensionService } from '../../extensions/extension.service';

@Component({
  selector: 'aca-current-user',
  templateUrl: './current-user.component.html',
  encapsulation: ViewEncapsulation.None,
  host: { class: 'aca-current-user' }
})
export class CurrentUserComponent implements OnInit {
  profile$: Observable<ProfileState>;
  languagePicker$: Observable<boolean>;
  actions: Array<ContentActionRef> = [];

  constructor(
    private store: Store<AppStore>,
    private extensions: AppExtensionService
  ) {}

  ngOnInit() {
    this.profile$ = this.store.select(getUserProfile);
    this.languagePicker$ = this.store.select(getLanguagePickerState);
    this.actions = this.extensions.getUserActions();
  }

  trackByActionId(_: number, action: ContentActionRef) {
    return action.id;
  }
}
