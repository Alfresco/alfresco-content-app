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

import { Component, OnInit, OnDestroy, ViewEncapsulation, HostListener } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { UrlTree, UrlSegmentGroup, UrlSegment, PRIMARY_OUTLET, ActivatedRoute } from '@angular/router';
import { debounceTime, map, takeUntil } from 'rxjs/operators';
import { ViewerModule } from '@alfresco/adf-core';
import { ClosePreviewAction, ViewerActionTypes, SetSelectedNodesAction } from '@alfresco/aca-shared/store';
import {
  PageComponent,
  AppHookService,
  ContentApiService,
  InfoDrawerComponent,
  ToolbarMenuItemComponent,
  ToolbarComponent
} from '@alfresco/aca-shared';
import { ContentActionRef } from '@alfresco/adf-extensions';
import { from } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';
import { AlfrescoViewerModule, NodesApiService } from '@alfresco/adf-content-services';
import { ViewerService } from '../../services/viewer.service';

@Component({
  standalone: true,
  imports: [CommonModule, ViewerModule, AlfrescoViewerModule, InfoDrawerComponent, ToolbarMenuItemComponent, ToolbarComponent],
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-preview' }
})
export class PreviewComponent extends PageComponent implements OnInit, OnDestroy {
  folderId: string = null;
  navigateBackAsClose = false;
  navigateMultiple = false;
  navigateSource: string = null;
  navigationSources = ['favorites', 'libraries', 'personal-files', 'recent-files', 'shared'];
  nextNodeId: string;
  nodeId: string = null;
  openWith: Array<ContentActionRef> = [];
  previewLocation: string = null;
  previousNodeId: string;
  routesSkipNavigation = ['favorites', 'recent-files', 'shared'];
  showRightSide = false;
  simplestMode = false;

  private containersSkipNavigation = ['adf-viewer__sidebar', 'cdk-overlay-container', 'adf-image-viewer'];

  constructor(
    private actions$: Actions,
    private appHookService: AppHookService,
    private contentApi: ContentApiService,
    private location: Location,
    private nodesApiService: NodesApiService,
    private route: ActivatedRoute,
    private viewerService: ViewerService
  ) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();

    from(this.infoDrawerOpened$)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((val) => {
        this.showRightSide = val;
      });

    this.previewLocation = this.router.url.substr(0, this.router.url.indexOf('/', 1)).replace(/\//g, '');

    const routeData = this.route.snapshot.data;
    this.navigateBackAsClose = !!routeData.navigateBackAsClose;
    this.simplestMode = !!routeData.simplestMode;

    if (routeData.navigateMultiple) {
      this.navigateMultiple = true;
    }

    if (routeData.navigateSource) {
      const source = routeData.navigateSource.toLowerCase();
      if (this.navigationSources.includes(source)) {
        this.navigateSource = routeData.navigateSource;
      }
    }

    this.route.params.subscribe((params) => {
      this.folderId = params.folderId;
      const id = params.nodeId;
      if (id) {
        void this.displayNode(id);
      }
    });

    this.subscriptions = this.subscriptions.concat([
      this.appHookService.nodesDeleted.subscribe(() => this.navigateToFileLocation(true)),

      this.uploadService.fileUploadDeleted.subscribe(() => this.navigateToFileLocation(true)),

      this.uploadService.fileUploadComplete.pipe(debounceTime(300)).subscribe((file) => this.nodesApiService.nodeUpdated.next(file.data.entry)),

      this.actions$
        .pipe(
          ofType<ClosePreviewAction>(ViewerActionTypes.ClosePreview),
          map(() => this.navigateToFileLocation(true))
        )
        .subscribe(() => {})
    ]);

    this.extensions
      .getOpenWithActions()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((actions) => {
        this.openWith = actions;
      });
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  /**
   * Loads the particular node into the Viewer
   *
   * @param id Unique identifier for the Node to display
   */
  async displayNode(id: string) {
    if (id) {
      try {
        this.node = await this.contentApi.getNodeInfo(id).toPromise();
        this.store.dispatch(new SetSelectedNodesAction([{ entry: this.node }]));

        if (this.node?.isFile) {
          this.nodeId = this.node.id;
          if (this.navigateMultiple) {
            const nearest = await this.viewerService.getNearestNodes(this.node.id, this.node.parentId, this.navigateSource);
            this.previousNodeId = nearest.left;
            this.nextNodeId = nearest.right;
          }
          return;
        }
        await this.router.navigate([this.previewLocation, id]);
      } catch (err) {
        if (!err || err.status !== 401) {
          await this.router.navigate([this.previewLocation, id]);
        }
      }
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    const key = event.key;

    if (key === 'ArrowRight' || key === 'ArrowLeft') {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }

  /**
   * Handles the visibility change of the Viewer component.
   *
   * @param isVisible Indicator whether Viewer is visible or hidden.
   */
  onVisibilityChanged(isVisible: boolean): void {
    const shouldNavigate = !isVisible;
    this.navigateToFileLocation(shouldNavigate);
  }

  navigateToFileLocation(shouldNavigate: boolean) {
    if (shouldNavigate) {
      if (this.navigateBackAsClose) {
        this.location.back();
      } else {
        const shouldSkipNavigation = this.routesSkipNavigation.includes(this.previewLocation);
        const route = this.getNavigationCommands(this.previewLocation);

        if (!shouldSkipNavigation && this.folderId) {
          route.push(this.folderId);
        }
        void this.router.navigate(route);
      }
    }
  }

  /** Handles navigation to a previous document */
  onNavigateBefore(event: MouseEvent | KeyboardEvent): void {
    if (event.type !== 'click' && this.shouldNavigate(event.target as HTMLElement)) {
      return;
    }

    if (this.previousNodeId) {
      void this.router.navigate(this.getPreviewPath(this.folderId, this.previousNodeId));
    }
  }

  /** Handles navigation to a next document */
  onNavigateNext(event: MouseEvent | KeyboardEvent): void {
    if (event.type !== 'click' && this.shouldNavigate(event.target as HTMLElement)) {
      return;
    }

    if (this.nextNodeId) {
      void this.router.navigate(this.getPreviewPath(this.folderId, this.nextNodeId));
    }
  }

  /**
   * Generates a node preview route based on folder and node IDs.
   *
   * @param folderId Folder ID
   * @param nodeId Node ID
   */
  getPreviewPath(folderId: string, nodeId: string): any[] {
    const route = [this.previewLocation];

    if (folderId) {
      route.push(folderId);
    }

    if (nodeId) {
      route.push('preview', nodeId);
    }

    return route;
  }

  private getNavigationCommands(url: string): any[] {
    const urlTree: UrlTree = this.router.parseUrl(url);
    const urlSegmentGroup: UrlSegmentGroup = urlTree.root.children[PRIMARY_OUTLET];

    if (!urlSegmentGroup) {
      return [url];
    }

    const urlSegments: UrlSegment[] = urlSegmentGroup.segments;

    return urlSegments.reduce(function (acc, item) {
      acc.push(item.path, item.parameters);
      return acc;
    }, []);
  }

  private shouldNavigate(element: HTMLElement): boolean {
    let currentElement = element.parentElement;

    while (currentElement && !this.isChild(currentElement.classList)) {
      currentElement = currentElement.parentElement;
    }

    return !!currentElement;
  }

  private isChild(list: DOMTokenList): boolean {
    return Array.from(list).some((className: string) => this.containersSkipNavigation.includes(className));
  }
}
