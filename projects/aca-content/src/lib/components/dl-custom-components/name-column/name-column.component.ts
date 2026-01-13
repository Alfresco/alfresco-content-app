/*!
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { NameColumnComponent, NodesApiService } from '@alfresco/adf-content-services';
import { ChangeDetectorRef, Component, DestroyRef, ElementRef, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { filter } from 'rxjs/operators';
import { NodeActionTypes } from '@alfresco/aca-shared/store';
import { isLocked, LockedByComponent } from '@alfresco/aca-shared';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { DatatableCellBadgesComponent } from '../datatable-cell-badges/datatable-cell-badges.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  imports: [CommonModule, TranslatePipe, LockedByComponent, DatatableCellBadgesComponent],
  selector: 'aca-custom-name-column',
  templateUrl: './name-column.component.html',
  styleUrls: ['./name-column.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'adf-datatable-content-cell adf-datatable-link adf-name-column aca-custom-name-column'
  }
})
export class CustomNameColumnComponent extends NameColumnComponent implements OnInit {
  isFile: boolean;
  isFileWriteLocked: boolean;

  private readonly destroy = inject(DestroyRef);

  constructor(
    element: ElementRef,
    private readonly cd: ChangeDetectorRef,
    private readonly actions$: Actions,
    private readonly nodesService: NodesApiService
  ) {
    super(element, nodesService);
  }

  ngOnInit() {
    this.updateValue();
    this.isFile = this.node?.entry && !this.node.entry.isFolder;
    this.isFileWriteLocked = isLocked(this.node);

    this.nodesService.nodeUpdated.pipe(takeUntilDestroyed(this.destroy)).subscribe((node: any) => {
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
        takeUntilDestroyed(this.destroy)
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
}
