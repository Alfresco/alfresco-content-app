/*!
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { DestroyRef, Directive, inject, OnInit } from '@angular/core';
import { DocumentListComponent } from '@alfresco/adf-content-services';
import { PaginationModel } from '@alfresco/adf-core';
import { PaginationStateService } from '@alfresco/aca-shared';
import { NodePaging } from '@alfresco/js-api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Directive({
  standalone: true,
  selector: '[acaPaginationMemory]'
})
export class PaginationMemoryDirective implements OnInit {
  private readonly documentList = inject(DocumentListComponent);
  private readonly paginationState = inject(PaginationStateService);
  private readonly destroyRef = inject(DestroyRef);

  private handledFolderId: string | null = null;

  ngOnInit(): void {
    this.documentList.ready.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((nodePaging) => this.onReady(nodePaging));
    this.documentList.pagination.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((pagination) => this.onPaginationChanged(pagination));
  }

  private get key(): string {
    return this.documentList.currentFolderId;
  }

  private onReady(nodePaging: NodePaging): void {
    const key = this.key;

    if (!key || this.documentList.isDataProvidedExternally) {
      return;
    }

    this.paginationState.prepareContext();

    if (key === this.handledFolderId) {
      return;
    }
    this.handledFolderId = key;

    const current = nodePaging?.list?.pagination;
    const loadedSkipCount = current?.skipCount ?? 0;
    const loadedMaxItems = current?.maxItems ?? 0;
    const totalItems = current?.totalItems;

    const stored = this.paginationState.getPaginationState(key);
    const canRestore = !!stored && stored.skipCount > 0 && (totalItems == null || stored.skipCount < totalItems);

    const targetSkipCount = canRestore ? stored.skipCount : 0;
    const targetMaxItems = (canRestore ? stored.maxItems : loadedMaxItems) ?? loadedMaxItems;

    if (targetSkipCount !== loadedSkipCount || (canRestore && targetMaxItems !== loadedMaxItems)) {
      this.updatePagination(targetMaxItems, targetSkipCount);
    }

    if (stored && !canRestore) {
      this.paginationState.resetPaginationState(key);
    }
  }

  private updatePagination(maxItems: number, skipCount: number): void {
    this.documentList.updatePagination({ maxItems, skipCount });
  }

  private onPaginationChanged(pagination: PaginationModel): void {
    const key = this.key;

    if (!key || key !== this.handledFolderId) {
      return;
    }

    this.paginationState.setPaginationState(key, { skipCount: pagination?.skipCount ?? 0, maxItems: pagination?.maxItems ?? 0 });
  }
}
