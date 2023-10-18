/*!
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component, Input, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { Node } from '@alfresco/js-api';
import { NodePermissionService, isLocked, AppExtensionService } from '@alfresco/aca-shared';
import { AppStore, EditOfflineAction, infoDrawerMetadataAspect, NodeActionTypes } from '@alfresco/aca-shared/store';
import { AppConfigService, NotificationService } from '@alfresco/adf-core';
import { Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { ContentMetadataModule, ContentMetadataService, ContentMetadataCustomPanel } from '@alfresco/adf-content-services';
import { filter, map, takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { Actions, ofType } from '@ngrx/effects';

@Component({
  standalone: true,
  imports: [CommonModule, ContentMetadataModule],
  selector: 'app-metadata-tab',
  template: `
    <adf-content-metadata-card
      [readOnly]="!canUpdateNode"
      [preset]="'custom'"
      [node]="node"
      [displayAspect]="displayAspect$ | async"
      [customPanels]="customPanels | async"
      [(editable)]="editable"
    >
    </adf-content-metadata-card>
  `,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-metadata-tab' }
})
export class MetadataTabComponent implements OnInit, OnDestroy {
  protected onDestroy$ = new Subject<boolean>();

  @Input()
  node: Node;

  displayAspect$: Observable<string>;
  canUpdateNode = false;
  editable = false;
  customPanels: Observable<ContentMetadataCustomPanel[]>;

  constructor(
    private permission: NodePermissionService,
    protected extensions: AppExtensionService,
    private appConfig: AppConfigService,
    private store: Store<AppStore>,
    private notificationService: NotificationService,
    private contentMetadataService: ContentMetadataService,
    private actions$: Actions
  ) {
    if (this.extensions.contentMetadata) {
      this.appConfig.config['content-metadata'].presets = this.extensions.contentMetadata.presets;
    }
    this.displayAspect$ = this.store.select(infoDrawerMetadataAspect);
  }

  ngOnInit() {
    this.contentMetadataService.error.pipe(takeUntil(this.onDestroy$)).subscribe((err: { message: string }) => {
      this.notificationService.showError(err.message);
    });
    this.checkIfNodeIsUpdatable(this.node);
    this.actions$
      .pipe(
        ofType<EditOfflineAction>(NodeActionTypes.EditOffline),
        filter((updatedNode) => this.node.id === updatedNode.payload.entry.id),
        takeUntil(this.onDestroy$)
      )
      .subscribe((updatedNode) => {
        this.checkIfNodeIsUpdatable(updatedNode?.payload.entry);
        if (!this.canUpdateNode) {
          this.editable = false;
        }
      });
    this.customPanels = this.extensions.getCustomMetadataPanels({ entry: this.node }).pipe(
      map((panels) => {
        return panels.map((panel) => {
          return { panelTitle: panel.title, component: panel.component };
        });
      }),
      takeUntil(this.onDestroy$)
    );
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  private checkIfNodeIsUpdatable(node: Node) {
    this.canUpdateNode = node && !isLocked({ entry: node }) ? this.permission.check(node, ['update']) : false;
  }
}
