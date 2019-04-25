/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { NameColumnComponent } from '@alfresco/adf-content-services';
import { AlfrescoApiService } from '@alfresco/adf-core';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { NodeActionTypes } from '@alfresco/aca-shared/store';
import { isLocked } from '../../../utils/node.utils';

@Component({
  selector: 'aca-custom-name-column',
  templateUrl: './name-column.component.html',
  styleUrls: ['name-column.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    class: ' adf-datatable-content-cell adf-datatable-link adf-name-column'
  }
})
export class CustomNameColumnComponent extends NameColumnComponent
  implements OnInit, OnDestroy {
  private onDestroy$ = new Subject<boolean>();

  constructor(
    element: ElementRef,
    private cd: ChangeDetectorRef,
    private actions$: Actions,
    private apiService: AlfrescoApiService
  ) {
    super(element, apiService);
  }

  ngOnInit() {
    this.updateValue();

    this.apiService.nodeUpdated
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((node: any) => {
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
        filter(val => {
          return this.node.entry.id === val.payload.entry.id;
        }),
        takeUntil(this.onDestroy$)
      )
      .subscribe(() => {
        this.cd.detectChanges();
      });
  }

  ngOnDestroy() {
    super.ngOnDestroy();

    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  isFile(): boolean {
    return this.node && this.node.entry && this.node.entry.isFile;
  }

  isFileWriteLocked(): boolean {
    return isLocked(this.node);
  }
}
