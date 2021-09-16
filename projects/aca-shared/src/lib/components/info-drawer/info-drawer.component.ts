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

import { Component, HostListener, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { MinimalNodeEntity, MinimalNodeEntryEntity, SiteEntry } from '@alfresco/js-api';
import { ContentActionRef, SidebarTabRef } from '@alfresco/adf-extensions';
import { Store } from '@ngrx/store';
import { SetInfoDrawerStateAction, ToggleInfoDrawerAction, infoDrawerPreview } from '@alfresco/aca-shared/store';
import { AppExtensionService } from '../../services/app.extension.service';
import { ContentApiService } from '../../services/content-api.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ThemePalette } from '@angular/material/core';
@Component({
  selector: 'aca-info-drawer',
  templateUrl: './info-drawer.component.html'
})
export class InfoDrawerComponent implements OnChanges, OnInit, OnDestroy {
  @Input()
  nodeId: string;

  @Input()
  node: MinimalNodeEntity;

  isLoading = false;
  displayNode: MinimalNodeEntryEntity | SiteEntry;
  tabs: Array<SidebarTabRef> = [];
  actions: Array<ContentActionRef> = [];
  onDestroy$ = new Subject<boolean>();
  preventFromClosing = false;

  @HostListener('keydown.escape')
  onEscapeKeyboardEvent(): void {
    this.close();
  }

  constructor(private store: Store<any>, private contentApi: ContentApiService, private extensions: AppExtensionService) {}

  ngOnInit() {
    this.tabs = this.extensions.getSidebarTabs();
    this.extensions
      .getAllowedSidebarActions()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((actions) => {
        this.actions = actions;
      });

    this.store
      .select(infoDrawerPreview)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((isInfoDrawerPreviewOpened) => {
        this.preventFromClosing = isInfoDrawerPreviewOpened;
      });
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
    if (!this.preventFromClosing) {
      this.store.dispatch(new SetInfoDrawerStateAction(false));
    }
  }

  ngOnChanges() {
    if (this.node) {
      if (this.node['isLibrary']) {
        return this.setDisplayNode(this.node);
      }

      const entry: any = this.node.entry;

      const id = entry.nodeId || entry.id;
      return this.loadNodeInfo(id);
    }
  }

  trackByActionId(_: number, action: ContentActionRef) {
    return action.id;
  }

  getEntryColor(entry: any): ThemePalette {
    return entry?.color;
  }

  private close() {
    this.store.dispatch(new ToggleInfoDrawerAction());
  }

  private loadNodeInfo(nodeId: string) {
    if (nodeId) {
      this.isLoading = true;

      this.contentApi.getNodeInfo(nodeId).subscribe(
        (entity) => {
          this.setDisplayNode(entity);
          this.isLoading = false;
        },
        () => (this.isLoading = false)
      );
    }
  }

  private setDisplayNode(node: any) {
    this.displayNode = node;
  }
}
