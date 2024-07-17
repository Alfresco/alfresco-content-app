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

import { ContentActionRef } from '@alfresco/adf-extensions';
import { AppStore, getSearchItemsTotalCount } from '@alfresco/aca-shared/store';
import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';

@Component({
  standalone: true,
  selector: 'aca-bulk-actions-dropdown',
  templateUrl: './bulk-actions-dropdown.component.html',
  styleUrls: ['./bulk-actions-dropdown.component.scss'],
  imports: [CommonModule, TranslateModule, MatSelectModule, MatFormFieldModule, MatInputModule, MatIconModule],
  encapsulation: ViewEncapsulation.None
})
export class BulkActionsDropdownComponent {
  @Input() items: ContentActionRef[];

  totalItems$: Observable<number> = this.store.select(getSearchItemsTotalCount);

  constructor(private store: Store<AppStore>) {}
}
