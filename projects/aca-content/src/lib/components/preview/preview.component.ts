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

import { Component, OnInit, OnDestroy, ViewEncapsulation, HostListener } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router, UrlTree, UrlSegmentGroup, UrlSegment, PRIMARY_OUTLET } from '@angular/router';
import { debounceTime, map, takeUntil } from 'rxjs/operators';
import { UserPreferencesService, ObjectUtils, UploadService, AlfrescoApiService } from '@alfresco/adf-core';
import { Store } from '@ngrx/store';
import { AppStore, ClosePreviewAction, ViewerActionTypes, SetSelectedNodesAction } from '@alfresco/aca-shared/store';
import { PageComponent } from '../page.component';
import { AppExtensionService, AppHookService, ContentApiService } from '@alfresco/aca-shared';
import { ContentManagementService } from '../../services/content-management.service';
import { ContentActionRef, ViewerExtensionRef } from '@alfresco/adf-extensions';
import { SearchRequest } from '@alfresco/js-api';
import { from } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-preview' }
})
export class PreviewComponent extends PageComponent implements OnInit, OnDestroy {
  previewLocation: string = null;
  routesSkipNavigation = ['shared', 'recent-files', 'favorites'];
  navigateSource: string = null;
  navigationSources = ['favorites', 'libraries', 'personal-files', 'recent-files', 'shared'];
  folderId: string = null;
  nodeId: string = null;
  previousNodeId: string;
  nextNodeId: string;
  navigateMultiple = false;
  openWith: Array<ContentActionRef> = [];
  contentExtensions: Array<ViewerExtensionRef> = [];
  showRightSide = false;
  navigateBackAsClose = false;
  simplestMode = false;

  recentFileFilters = [
    'TYPE:"content"',
    '-PNAME:"0/wiki"',
    '-TYPE:"app:filelink"',
    '-TYPE:"fm:post"',
    '-TYPE:"cm:thumbnail"',
    '-TYPE:"cm:failedThumbnail"',
    '-TYPE:"cm:rating"',
    '-TYPE:"dl:dataList"',
    '-TYPE:"dl:todoList"',
    '-TYPE:"dl:issue"',
    '-TYPE:"dl:contact"',
    '-TYPE:"dl:eventAgenda"',
    '-TYPE:"dl:event"',
    '-TYPE:"dl:task"',
    '-TYPE:"dl:simpletask"',
    '-TYPE:"dl:meetingAgenda"',
    '-TYPE:"dl:location"',
    '-TYPE:"fm:topic"',
    '-TYPE:"fm:post"',
    '-TYPE:"ia:calendarEvent"',
    '-TYPE:"lnk:link"'
  ];

  private containersSkipNavigation = ['adf-viewer__sidebar', 'cdk-overlay-container', 'adf-image-viewer'];

  constructor(
    private contentApi: ContentApiService,
    private preferences: UserPreferencesService,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: AlfrescoApiService,
    private uploadService: UploadService,
    private actions$: Actions,
    private location: Location,
    store: Store<AppStore>,
    extensions: AppExtensionService,
    content: ContentManagementService,
    private appHookService: AppHookService
  ) {
    super(store, extensions, content);
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
        this.displayNode(id);
      }
    });

    this.subscriptions = this.subscriptions.concat([
      this.appHookService.nodesDeleted.subscribe(() => this.navigateToFileLocation(true)),

      this.uploadService.fileUploadDeleted.subscribe(() => this.navigateToFileLocation(true)),

      this.uploadService.fileUploadComplete.pipe(debounceTime(300)).subscribe((file) => this.apiService.nodeUpdated.next(file.data.entry)),

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

        if (this.node && this.node.isFile) {
          const nearest = await this.getNearestNodes(this.node.id, this.node.parentId);

          this.previousNodeId = nearest.left;
          this.nextNodeId = nearest.right;
          this.nodeId = this.node.id;
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
    const key = event.keyCode;
    const rightArrow = 39;
    const leftArrow = 37;

    if (key === rightArrow || key === leftArrow) {
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
        this.router.navigate(route);
      }
    }
  }

  /** Handles navigation to a previous document */
  onNavigateBefore(event: MouseEvent | KeyboardEvent): void {
    if (event.type !== 'click' && this.shouldNavigate(event.target as HTMLElement)) {
      return;
    }

    if (this.previousNodeId) {
      this.router.navigate(this.getPreviewPath(this.folderId, this.previousNodeId));
    }
  }

  /** Handles navigation to a next document */
  onNavigateNext(event: MouseEvent | KeyboardEvent): void {
    if (event.type !== 'click' && this.shouldNavigate(event.target as HTMLElement)) {
      return;
    }

    if (this.nextNodeId) {
      this.router.navigate(this.getPreviewPath(this.folderId, this.nextNodeId));
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

  /**
   * Retrieves nearest node information for the given node and folder.
   *
   * @param nodeId Unique identifier of the document node
   * @param folderId Unique identifier of the containing folder node.
   */
  async getNearestNodes(nodeId: string, folderId: string): Promise<{ left: string; right: string }> {
    const empty = {
      left: null,
      right: null
    };

    if (nodeId && folderId) {
      try {
        const ids = await this.getFileIds(this.navigateSource, folderId);
        const idx = ids.indexOf(nodeId);

        if (idx >= 0) {
          return {
            left: ids[idx - 1] || null,
            right: ids[idx + 1] || null
          };
        } else {
          return empty;
        }
      } catch {
        return empty;
      }
    } else {
      return empty;
    }
  }

  /**
   * Retrieves a list of node identifiers for the folder and data source.
   *
   * @param source Data source name. Allowed values are: personal-files, libraries, favorites, shared, recent-files.
   * @param folderId Containing folder node identifier for 'personal-files' and 'libraries' sources.
   */
  async getFileIds(source: string, folderId?: string): Promise<string[]> {
    if ((source === 'personal-files' || source === 'libraries') && folderId) {
      const sortKey = this.preferences.get('personal-files.sorting.key') || 'modifiedAt';
      const sortDirection = this.preferences.get('personal-files.sorting.direction') || 'desc';
      const nodes = await this.contentApi
        .getNodeChildren(folderId, {
          // orderBy: `${sortKey} ${sortDirection}`,
          fields: ['id', this.getRootField(sortKey)],
          where: '(isFile=true)'
        })
        .toPromise();

      const entries = nodes.list.entries.map((obj) => obj.entry);
      this.sort(entries, sortKey, sortDirection);

      return entries.map((obj) => obj.id);
    }

    if (source === 'favorites') {
      const nodes = await this.contentApi
        .getFavorites('-me-', {
          where: '(EXISTS(target/file))',
          fields: ['target']
        })
        .toPromise();

      const sortKey = this.preferences.get('favorites.sorting.key') || 'modifiedAt';
      const sortDirection = this.preferences.get('favorites.sorting.direction') || 'desc';
      const files = nodes.list.entries.map((obj) => obj.entry.target.file);
      this.sort(files, sortKey, sortDirection);

      return files.map((f) => f.id);
    }

    if (source === 'shared') {
      const sortingKey = this.preferences.get('shared.sorting.key') || 'modifiedAt';
      const sortingDirection = this.preferences.get('shared.sorting.direction') || 'desc';

      const nodes = await this.contentApi
        .findSharedLinks({
          fields: ['nodeId', this.getRootField(sortingKey)]
        })
        .toPromise();

      const entries = nodes.list.entries.map((obj) => obj.entry);
      this.sort(entries, sortingKey, sortingDirection);

      return entries.map((obj) => obj.nodeId);
    }

    if (source === 'recent-files') {
      const person = await this.contentApi.getPerson('-me-').toPromise();
      const username = person.entry.id;
      const sortingKey = this.preferences.get('recent-files.sorting.key') || 'modifiedAt';
      const sortingDirection = this.preferences.get('recent-files.sorting.direction') || 'desc';

      const query: SearchRequest = {
        query: {
          query: '*',
          language: 'afts'
        },
        filterQueries: [
          { query: `cm:modified:[NOW/DAY-30DAYS TO NOW/DAY+1DAY]` },
          { query: `cm:modifier:${username} OR cm:creator:${username}` },
          {
            query: this.recentFileFilters.join(' AND ')
          }
        ],
        fields: ['id', this.getRootField(sortingKey)],
        include: ['path', 'properties', 'allowableOperations'],
        sort: [
          {
            type: 'FIELD',
            field: 'cm:modified',
            ascending: false
          }
        ]
      };
      const nodes = await this.contentApi.search(query).toPromise();

      const entries = nodes.list.entries.map((obj) => obj.entry);
      this.sort(entries, sortingKey, sortingDirection);

      return entries.map((obj) => obj.id);
    }

    return [];
  }

  private sort(items: any[], key: string, direction: string) {
    const options: Intl.CollatorOptions = {};

    if (key.includes('sizeInBytes') || key === 'name') {
      options.numeric = true;
    }

    items.sort((a: any, b: any) => {
      let left = ObjectUtils.getValue(a, key);
      if (left) {
        left = left instanceof Date ? left.valueOf().toString() : left.toString();
      } else {
        left = '';
      }

      let right = ObjectUtils.getValue(b, key);
      if (right) {
        right = right instanceof Date ? right.valueOf().toString() : right.toString();
      } else {
        right = '';
      }

      return direction === 'asc' ? left.localeCompare(right, undefined, options) : right.localeCompare(left, undefined, options);
    });
  }

  /**
   * Get the root field name from the property path.
   * Example: 'property1.some.child.property' => 'property1'
   *
   * @param path Property path
   */
  getRootField(path: string) {
    if (path) {
      return path.split('.')[0];
    }
    return path;
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
