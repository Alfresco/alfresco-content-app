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

import { AppExtensionService, AppHookService, ContentApiService } from '@alfresco/aca-shared';
import {
  AppStore,
  ClosePreviewAction,
  getAppSelection,
  isInfoDrawerOpened,
  RefreshPreviewAction,
  ReloadDocumentListAction,
  SetCurrentNodeVersionAction,
  SetSelectedNodesAction,
  ViewerActionTypes,
  ViewNodeAction
} from '@alfresco/aca-shared/store';
import { ContentActionRef, SelectionState } from '@alfresco/adf-extensions';
import { MinimalNodeEntryEntity, SearchRequest, VersionEntry, VersionsApi } from '@alfresco/js-api';
import { Component, HostListener, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, PRIMARY_OUTLET, Router } from '@angular/router';
import { AlfrescoApiService, ObjectUtils, UploadService, UserPreferencesService } from '@alfresco/adf-core';
import { Store } from '@ngrx/store';
import { from, Observable, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Actions, ofType } from '@ngrx/effects';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-viewer' }
})
export class AppViewerComponent implements OnInit, OnDestroy {
  _versionsApi: VersionsApi;
  get versionsApi(): VersionsApi {
    this._versionsApi = this._versionsApi ?? new VersionsApi(this.apiService.getInstance());
    return this._versionsApi;
  }

  onDestroy$ = new Subject<boolean>();

  fileName: string;
  folderId: string = null;
  nodeId: string = null;
  versionId: string = null;
  node: MinimalNodeEntryEntity;
  selection: SelectionState;
  infoDrawerOpened$: Observable<boolean>;

  showRightSide = false;
  openWith: ContentActionRef[] = [];
  toolbarActions: ContentActionRef[] = [];

  navigateSource: string = null;
  previousNodeId: string;
  nextNodeId: string;
  navigateMultiple = true;
  routesSkipNavigation = ['shared', 'recent-files', 'favorites'];
  navigationSources = ['favorites', 'libraries', 'personal-files', 'recent-files', 'shared'];
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

  private navigationPath: string;
  private previewLocation: string;
  private containersSkipNavigation = ['adf-viewer__sidebar', 'cdk-overlay-container', 'adf-image-viewer'];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<AppStore>,
    private extensions: AppExtensionService,
    private contentApi: ContentApiService,
    private actions$: Actions,
    private preferences: UserPreferencesService,
    private apiService: AlfrescoApiService,
    private uploadService: UploadService,
    private appHookService: AppHookService
  ) {}

  ngOnInit() {
    this.infoDrawerOpened$ = this.store.select(isInfoDrawerOpened);

    from(this.infoDrawerOpened$)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((val) => {
        this.showRightSide = val;
      });

    this.store
      .select(getAppSelection)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((selection) => {
        this.selection = selection;
      });

    this.extensions
      .getViewerToolbarActions()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((actions) => {
        this.toolbarActions = actions;
      });

    this.extensions
      .getOpenWithActions()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((actions) => {
        this.openWith = actions;
      });

    this.route.params.subscribe((params) => {
      this.folderId = params.folderId;
      const { nodeId } = params;
      this.versionId = params.versionId;
      if (this.versionId) {
        this.versionsApi.getVersion(nodeId, this.versionId).then((version: VersionEntry) => {
          if (version) {
            this.store.dispatch(new SetCurrentNodeVersionAction(version));
          }
        });
      }
      if (nodeId) {
        this.displayNode(nodeId);
      }
    });

    this.route.queryParams.subscribe((params) => {
      this.navigationPath = params.path || params.location;
    });

    if (this.route.snapshot.data && this.route.snapshot.data.navigateSource) {
      const source = this.route.snapshot.data.navigateSource.toLowerCase();
      if (this.navigationSources.includes(source)) {
        this.navigateSource = this.route.snapshot.data.navigateSource;
      }
    }

    this.actions$.pipe(ofType<ClosePreviewAction>(ViewerActionTypes.ClosePreview), takeUntil(this.onDestroy$)).subscribe(() => {
      this.store.dispatch(new SetCurrentNodeVersionAction(null));
      this.navigateToFileLocation();
    });

    this.actions$
      .pipe(ofType<RefreshPreviewAction>(ViewerActionTypes.RefreshPreview), takeUntil(this.onDestroy$))
      .subscribe((action: RefreshPreviewAction) => {
        this.displayNode(action?.payload?.entry?.id);
      });

    this.appHookService.nodesDeleted.pipe(takeUntil(this.onDestroy$)).subscribe(() => this.navigateToFileLocation());

    this.uploadService.fileUploadDeleted.pipe(takeUntil(this.onDestroy$)).subscribe(() => this.navigateToFileLocation());

    this.uploadService.fileUploadComplete.pipe(debounceTime(300), takeUntil(this.onDestroy$)).subscribe((file) => {
      this.apiService.nodeUpdated.next(file.data.entry);
      this.displayNode(file.data.entry.id);
    });

    this.previewLocation = this.router.url.substr(0, this.router.url.indexOf('/', 1)).replace(/\//g, '');
  }

  onViewerVisibilityChanged() {
    this.store.dispatch(new ReloadDocumentListAction());
    this.navigateToFileLocation();
  }

  ngOnDestroy() {
    this.store.dispatch(new SetCurrentNodeVersionAction(null));
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  trackByActionId(_: number, obj: ContentActionRef): string {
    return obj.id;
  }

  async displayNode(nodeId: string) {
    if (nodeId) {
      try {
        this.node = await this.contentApi.getNodeInfo(nodeId).toPromise();
        this.store.dispatch(new SetSelectedNodesAction([{ entry: this.node }]));
        this.navigateMultiple = this.extensions.canShowViewerNavigation({ entry: this.node });
        if (!this.navigateMultiple) {
          this.nodeId = this.node.id;
          this.fileName = this.node.name + this.node?.properties?.['cm:versionLabel'];
          return;
        }

        if (this.node && this.node.isFile) {
          const nearest = await this.getNearestNodes(this.node.id, this.node.parentId);
          this.nodeId = this.node.id;
          this.previousNodeId = nearest.left;
          this.nextNodeId = nearest.right;
          this.fileName = this.node.name + this.node?.properties?.['cm:versionLabel'];
          return;
        }
      } catch (error) {
        const statusCode = JSON.parse(error.message).error.statusCode;

        if (statusCode !== 401) {
          this.router.navigate([this.previewLocation, { outlets: { viewer: null } }]).then(() => {
            this.router.navigate([this.previewLocation, nodeId]);
          });
        }
      }
    }
  }

  onNavigateBefore(event: MouseEvent | KeyboardEvent): void {
    if (event.type !== 'click' && this.shouldNavigate(event.target as HTMLElement)) {
      return;
    }

    const location = this.getFileLocation();
    this.store.dispatch(new ViewNodeAction(this.previousNodeId, { location }));
  }

  onNavigateNext(event: MouseEvent | KeyboardEvent): void {
    if (event.type !== 'click' && this.shouldNavigate(event.target as HTMLElement)) {
      return;
    }

    const location = this.getFileLocation();
    this.store.dispatch(new ViewNodeAction(this.nextNodeId, { location }));
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

  private navigateToFileLocation() {
    const location = this.getFileLocation();
    this.router.navigateByUrl(location);
  }

  private getFileLocation(): string {
    return this.navigationPath || this.router.parseUrl(this.router.url).root.children[PRIMARY_OUTLET].toString();
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
