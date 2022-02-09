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

import { NameColumnComponent } from '@alfresco/adf-content-services';
import { AlfrescoApiService } from '@alfresco/adf-core';
import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { NodeActionTypes } from '@alfresco/aca-shared/store';
import { isLocked } from '@alfresco/aca-shared';

@Component({
  selector: 'aca-custom-name-column',
  templateUrl: './name-column.component.html',
  styleUrls: ['./name-column.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'adf-datatable-content-cell adf-datatable-link adf-name-column aca-custom-name-column'
  }
})
export class CustomNameColumnComponent extends NameColumnComponent implements OnInit, OnDestroy {
  private onDestroy$$ = new Subject<boolean>();

  constructor(element: ElementRef, private cd: ChangeDetectorRef, private actions$: Actions, private apiService: AlfrescoApiService) {
    super(element, apiService);
  }

  ngOnInit() {
    this.updateValue();

    this.apiService.nodeUpdated.pipe(takeUntil(this.onDestroy$$)).subscribe((node: any) => {
      const row = this.context.row;
      if (row) {
        const { entry } = row.node;
        const currentId = entry.nodeId || entry.id;
        const updatedId = node.nodeId || node.id;

        if (currentId === updatedId) {
          entry.name = node.name;
          row.node = { entry };
          this.updateValue();
        }
      }
    });

    this.actions$
      .pipe(
        ofType<any>(NodeActionTypes.EditOffline),
        filter((val) => this.node.entry.id === val.payload.entry.id),
        takeUntil(this.onDestroy$$)
      )
      .subscribe(() => {
        this.cd.detectChanges();
      });
  }

  onLinkClick(event: Event) {
    event.stopPropagation();
    this.onClick();
  }

  ngOnDestroy() {
    super.ngOnDestroy();

    this.onDestroy$$.next(true);
    this.onDestroy$$.complete();
  }

  get isFile(): boolean {
    return this.node && this.node.entry && !this.node.entry.isFolder;
  }

  get isFileWriteLocked(): boolean {
    return isLocked(this.node);
  }
}
