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

import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { SetCurrentFolderAction, AppStore } from '@alfresco/aca-shared/store';
import { ContentActionRef } from '@alfresco/adf-extensions';
import { Subject } from 'rxjs';

@Component({
  selector: 'aca-header-actions',
  templateUrl: './header-actions.component.html',
  styleUrls: ['./header-actions.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderActionsComponent implements OnDestroy {
  private onDestroy$ = new Subject<boolean>();

  constructor(private store: Store<AppStore>) {}

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
    this.store.dispatch(new SetCurrentFolderAction(null));
  }

  trackByActionId(_: number, action: ContentActionRef) {
    return action.id;
  }
}
