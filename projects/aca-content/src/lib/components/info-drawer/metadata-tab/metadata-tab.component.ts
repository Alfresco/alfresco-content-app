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

import { Component, Input, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { MinimalNodeEntryEntity } from '@alfresco/js-api';
import { NodePermissionService, isLocked, AppExtensionService } from '@alfresco/aca-shared';
import { AppStore, infoDrawerMetadataAspect } from '@alfresco/aca-shared/store';
import { AppConfigService, NotificationService } from '@alfresco/adf-core';
import { Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { ContentMetadataService } from '@alfresco/adf-content-services';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-metadata-tab',
  template: `
    <adf-content-metadata-card [readOnly]="!canUpdateNode" [preset]="'custom'" [node]="node" [displayAspect]="displayAspect$ | async">
    </adf-content-metadata-card>
  `,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-metadata-tab' }
})
export class MetadataTabComponent implements OnInit, OnDestroy {
  protected onDestroy$ = new Subject<boolean>();

  @Input()
  node: MinimalNodeEntryEntity;

  displayAspect$: Observable<string>;

  constructor(
    private permission: NodePermissionService,
    protected extensions: AppExtensionService,
    private appConfig: AppConfigService,
    private store: Store<AppStore>,
    private notificationService: NotificationService,
    private contentMetadataService: ContentMetadataService
  ) {
    if (this.extensions.contentMetadata) {
      this.appConfig.config['content-metadata'].presets = this.extensions.contentMetadata.presets;
    }
    this.displayAspect$ = this.store.select(infoDrawerMetadataAspect);
  }

  get canUpdateNode(): boolean {
    if (this.node && !isLocked({ entry: this.node })) {
      return this.permission.check(this.node, ['update']);
    }

    return false;
  }

  ngOnInit() {
    this.contentMetadataService.error.pipe(takeUntil(this.onDestroy$)).subscribe((err: { message: string }) => {
      this.notificationService.showError(err.message);
    });
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }
}
