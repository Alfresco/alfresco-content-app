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

import {
  AppExtensionService,
  AppHookService,
  AppSettingsService,
  ContentApiService,
  InfoDrawerComponent,
  ToolbarComponent,
  ToolbarMenuItemComponent
} from '@alfresco/aca-shared';
import {
  AppStore,
  ClosePreviewAction,
  getAppSelection,
  isInfoDrawerOpened,
  RefreshPreviewAction,
  SetCurrentNodeVersionAction,
  SetSelectedNodesAction,
  ViewerActionTypes,
  ViewNodeAction
} from '@alfresco/aca-shared/store';
import { ContentActionRef, SelectionState } from '@alfresco/adf-extensions';
import { Node, VersionEntry, VersionsApi } from '@alfresco/js-api';
import { Component, HostListener, inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, PRIMARY_OUTLET, Router } from '@angular/router';
import { AlfrescoApiService, ViewerOpenWithComponent, ViewerSidebarComponent, ViewerToolbarActionsComponent } from '@alfresco/adf-core';
import { Store } from '@ngrx/store';
import { from, Observable, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Actions, ofType } from '@ngrx/effects';
import { AlfrescoViewerComponent, DocumentListService, NodesApiService, UploadService } from '@alfresco/adf-content-services';
import { CommonModule } from '@angular/common';
import { ViewerService } from '../../services/viewer.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    InfoDrawerComponent,
    ToolbarMenuItemComponent,
    ToolbarComponent,
    AlfrescoViewerComponent,
    ViewerToolbarActionsComponent,
    ViewerOpenWithComponent,
    ViewerSidebarComponent
  ],
  selector: 'aca-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-viewer' }
})
export class AcaViewerComponent implements OnInit, OnDestroy {
  settings = inject(AppSettingsService);

  private documentListService = inject(DocumentListService);

  private _versionsApi: VersionsApi;
  get versionsApi(): VersionsApi {
    this._versionsApi = this._versionsApi ?? new VersionsApi(this.apiService.getInstance());
    return this._versionsApi;
  }

  onDestroy$ = new Subject<boolean>();

  fileName: string;
  folderId: string = null;
  infoDrawerOpened$: Observable<boolean>;
  navigateMultiple = true;
  navigateSource: string = null;
  navigationSources = ['favorites', 'libraries', 'personal-files', 'recent-files', 'shared'];
  nextNodeId: string;
  node: Node;
  nodeId: string = null;
  openWith: ContentActionRef[] = [];
  previousNodeId: string;
  selection: SelectionState;
  showRightSide = false;
  toolbarActions: ContentActionRef[] = [];
  versionId: string = null;

  private navigationPath: string;
  private previewLocation: string;
  private containersSkipNavigation = ['adf-viewer__sidebar', 'cdk-overlay-container', 'adf-image-viewer'];

  constructor(
    private actions$: Actions,
    private apiService: AlfrescoApiService,
    private appHookService: AppHookService,
    private contentApi: ContentApiService,
    private extensions: AppExtensionService,
    private nodesApiService: NodesApiService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppStore>,
    private uploadService: UploadService,
    private viewerService: ViewerService
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
        void this.versionsApi.getVersion(nodeId, this.versionId).then((version: VersionEntry) => {
          if (version) {
            this.store.dispatch(new SetCurrentNodeVersionAction(version));
          }
        });
      }
      if (nodeId) {
        void this.displayNode(nodeId);
      }
    });

    this.route.queryParams.subscribe((params) => {
      this.navigationPath = params.path || params.location;
    });

    if (this.route.snapshot.data?.navigateSource) {
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
        this.nodesApiService.nodeUpdated.next(action.node);
        void this.displayNode(action.node.id);
      });

    this.appHookService.nodesDeleted.pipe(takeUntil(this.onDestroy$)).subscribe(() => this.navigateToFileLocation());

    this.uploadService.fileUploadDeleted.pipe(takeUntil(this.onDestroy$)).subscribe(() => this.navigateToFileLocation());

    this.uploadService.fileUploadComplete.pipe(debounceTime(300), takeUntil(this.onDestroy$)).subscribe((file) => {
      this.nodesApiService.nodeUpdated.next(file.data.entry);
      void this.displayNode(file.data.entry.id);
    });

    this.previewLocation = this.router.url.substring(0, this.router.url.indexOf('/', 1)).replace(/\//g, '');
  }

  onViewerVisibilityChanged() {
    this.documentListService.reload();
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

        if (this.node?.isFile) {
          this.nodeId = this.node.id;
          this.fileName = this.node.name + this.node?.properties?.['cm:versionLabel'];
          if (this.navigateMultiple) {
            const nearest = await this.viewerService.getNearestNodes(this.node.id, this.node.parentId, this.navigateSource);
            this.previousNodeId = nearest.left;
            this.nextNodeId = nearest.right;
          }
          return;
        }
        this.navigateToFileLocation();
      } catch (error) {
        const statusCode = JSON.parse(error.message).error.statusCode;

        if (statusCode !== 401) {
          await this.router.navigate([this.previewLocation, { outlets: { viewer: null } }]).then(() => {
            void this.router.navigate([this.previewLocation, nodeId]);
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

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    const key = event.key;

    if (key === 'ArrowRight' || key === 'ArrowLeft') {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }

  private navigateToFileLocation() {
    const location = this.getFileLocation();
    void this.router.navigateByUrl(location);
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
