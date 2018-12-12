/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2018 Alfresco Software Limited
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

import {
  Component,
  ViewEncapsulation,
  Output,
  EventEmitter,
  OnInit
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  selectHeaderColor,
  selectAppName,
  selectLogoPath
} from '../../store/selectors/app.selectors';
import { ContentActionRef } from '@alfresco/adf-extensions';
import { AppExtensionService } from '../../extensions/extension.service';
import { AppStore } from '../../store/states';

@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-header' }
})
export class AppHeaderComponent implements OnInit {
  @Output()
  toggleClicked = new EventEmitter();

  appName$: Observable<string>;
  headerColor$: Observable<string>;
  logo$: Observable<string>;

  actions: Array<ContentActionRef> = [];

  constructor(
    store: Store<AppStore>,
    private appExtensions: AppExtensionService
  ) {
    this.headerColor$ = store.select(selectHeaderColor);
    this.appName$ = store.select(selectAppName);
    this.logo$ = store.select(selectLogoPath);
  }

  ngOnInit() {
    this.actions = this.appExtensions.getHeaderActions();
  }

  trackByActionId(index: number, action: ContentActionRef) {
    return action.id;
  }
}
