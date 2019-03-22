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

import {
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
  ChangeDetectorRef,
  OnDestroy
} from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { EDIT_OFFLINE } from '../../../store/actions';
import { NodeEntry } from '@alfresco/js-api';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { isLocked } from '../../../utils/node.utils';

@Component({
  selector: 'aca-custom-name-column',
  template: `
    <div
      class="aca-custom-name-column"
      [ngClass]="{
        'aca-name-column-container': isFile() && isFileWriteLocked()
      }"
    >
      <adf-name-column [context]="context"></adf-name-column>

      <ng-container *ngIf="isFile() && isFileWriteLocked()">
        <aca-locked-by [context]="context"></aca-locked-by>
      </ng-container>
    </div>
  `,
  styleUrls: ['name-column.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CustomNameColumnComponent implements OnInit, OnDestroy {
  node: NodeEntry;

  @Input()
  context: any;

  private onDestroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private cd: ChangeDetectorRef, private actions$: Actions) {}

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  ngOnInit() {
    this.node = this.context.row.node;

    this.actions$
      .pipe(
        ofType<any>(EDIT_OFFLINE),
        filter(val => {
          return this.node.entry.id === val.payload.entry.id;
        }),
        takeUntil(this.onDestroy$)
      )
      .subscribe(() => {
        this.cd.detectChanges();
      });
  }

  isFile() {
    return this.node && this.node.entry && this.node.entry.isFile;
  }

  isFileWriteLocked() {
    return isLocked(this.node);
  }
}
