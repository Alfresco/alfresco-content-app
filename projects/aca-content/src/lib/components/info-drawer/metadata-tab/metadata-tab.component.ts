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

import { Component, DestroyRef, inject, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Node } from '@alfresco/js-api';
import { AppExtensionService, isLocked, NodePermissionService } from '@alfresco/aca-shared';
import { AppStore, EditOfflineAction, infoDrawerMetadataAspect, NodeActionTypes } from '@alfresco/aca-shared/store';
import { AppConfigService, NotificationService } from '@alfresco/adf-core';
import { Observable } from 'rxjs';
import {
  CategoryService,
  ContentMetadataComponent,
  ContentMetadataCustomPanel,
  ContentMetadataService,
  TagService
} from '@alfresco/adf-content-services';
import { filter, map } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ExtensionService } from '@alfresco/adf-extensions';

@Component({
  imports: [ContentMetadataComponent, AsyncPipe],
  selector: 'app-metadata-tab',
  template: `
    <adf-content-metadata
      [readOnly]="readOnly"
      [preset]="'custom'"
      [node]="node"
      [customPanels]="customPanels | async"
      [displayCategories]="displayCategories"
      [displayTags]="displayTags"
      [displayAspect]="metadataAspect"
    />
  `,
  styleUrls: ['metadata-tab.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-metadata-tab' }
})
export class MetadataTabComponent implements OnInit {
  private _displayCategories = true;
  private _displayTags = true;

  @Input()
  node: Node;

  readOnly = false;
  customPanels: Observable<ContentMetadataCustomPanel[]>;
  metadataAspect: string;

  get displayCategories(): boolean {
    return this._displayCategories;
  }
  get displayTags(): boolean {
    return this._displayTags;
  }

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly permission: NodePermissionService,
    protected readonly extensions: AppExtensionService,
    private readonly appConfig: AppConfigService,
    private readonly notificationService: NotificationService,
    private readonly contentMetadataService: ContentMetadataService,
    private readonly actions$: Actions,
    private readonly tagService: TagService,
    private readonly categoryService: CategoryService,
    private readonly store: Store<AppStore>,
    private readonly extensionService: ExtensionService
  ) {
    if (this.extensions.contentMetadata) {
      this.appConfig.config['content-metadata'].presets = this.extensions.contentMetadata.presets;
    }
  }

  ngOnInit() {
    this._displayTags = this.tagService.areTagsEnabled();
    this._displayCategories = this.categoryService.areCategoriesEnabled();

    this.contentMetadataService.error.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((err: { message: string }) => {
      this.notificationService.showError(err.message);
    });
    this.checkIfNodeIsUpdatable(this.node);
    this.actions$
      .pipe(
        ofType<EditOfflineAction>(NodeActionTypes.EditOffline),
        filter((updatedNode) => this.node.id === updatedNode.payload.entry.id),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((updatedNode) => {
        this.checkIfNodeIsUpdatable(updatedNode?.payload.entry);
      });
    this.customPanels = this.extensions.getCustomMetadataPanels({ entry: this.node }).pipe(
      map((panels) => {
        return panels.map((panel) => {
          return { panelTitle: panel.title, component: panel.component };
        });
      }),
      takeUntilDestroyed(this.destroyRef)
    );
    this.store
      .select(infoDrawerMetadataAspect)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((metadataAspect) => (this.metadataAspect = metadataAspect));
  }

  private checkIfNodeIsUpdatable(node: Node) {
    this.readOnly = !(node &&
    !isLocked({ entry: node }) &&
    (this.extensionService.getFeature('sidebar')?.['rules']?.enabled ?? []).every((rule: string) =>
      this.extensionService.evaluateRule(rule, this.extensions)
    )
      ? this.permission.check(node, ['update'])
      : false);
  }
}
