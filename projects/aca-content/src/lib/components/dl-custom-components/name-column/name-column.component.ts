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

import { NameColumnComponent, NodeNameTooltipPipe, NodesApiService } from '@alfresco/adf-content-services';
import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { NodeActionTypes } from '@alfresco/aca-shared/store';
import { LockedByComponent, isLocked } from '@alfresco/aca-shared';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IconComponent } from '@alfresco/adf-core';
import { DynamicExtensionComponent } from '@alfresco/adf-extensions';
import { DatatableCellBadgesComponent } from '../datatable-cell-badges/datatable-cell-badges.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    LockedByComponent,
    IconComponent,
    NodeNameTooltipPipe,
    DynamicExtensionComponent,
    DatatableCellBadgesComponent
  ],
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

  isFile: boolean;
  isFileWriteLocked: boolean;

  constructor(element: ElementRef, private cd: ChangeDetectorRef, private actions$: Actions, private nodesService: NodesApiService) {
    super(element, nodesService);
  }

  ngOnInit() {
    this.updateValue();
    this.isFile = this.node?.entry && !this.node.entry.isFolder;
    this.isFileWriteLocked = isLocked(this.node);

    this.nodesService.nodeUpdated.pipe(takeUntil(this.onDestroy$$)).subscribe((node: any) => {
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

        this.isFile = this.node?.entry && !this.node.entry.isFolder;
        this.isFileWriteLocked = isLocked(this.node);
      }
    });

    this.actions$
      .pipe(
        ofType<any>(NodeActionTypes.EditOffline),
        filter((val) => this.node.entry.id === val.payload.entry.id),
        takeUntil(this.onDestroy$$)
      )
      .subscribe(() => {
        this.isFileWriteLocked = isLocked(this.node);
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
}
