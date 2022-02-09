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

import { FileUploadEvent, ShowHeaderMode, UploadService } from '@alfresco/adf-core';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MinimalNodeEntity, MinimalNodeEntryEntity, PathElement, PathElementEntity } from '@alfresco/js-api';
import { ContentManagementService } from '../../services/content-management.service';
import { NodeActionsService } from '../../services/node-actions.service';
import { PageComponent } from '../page.component';
import { AppExtensionService, ContentApiService } from '@alfresco/aca-shared';
import { SetCurrentFolderAction, isAdmin, AppStore, UploadFileVersionAction } from '@alfresco/aca-shared/store';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { FilterSearch, ShareDataRow } from '@alfresco/adf-content-services';
import { DocumentListPresetRef } from '@alfresco/adf-extensions';

@Component({
  templateUrl: './files.component.html'
})
export class FilesComponent extends PageComponent implements OnInit, OnDestroy {
  isValidPath = true;
  isSmallScreen = false;
  isAdmin = false;
  selectedNode: MinimalNodeEntity;
  queryParams = null;

  private nodePath: PathElement[];

  columns: DocumentListPresetRef[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private contentApi: ContentApiService,
    store: Store<AppStore>,
    private nodeActionsService: NodeActionsService,
    private uploadService: UploadService,
    content: ContentManagementService,
    extensions: AppExtensionService,
    private breakpointObserver: BreakpointObserver
  ) {
    super(store, extensions, content);
  }

  ngOnInit() {
    super.ngOnInit();

    const { route, nodeActionsService, uploadService } = this;
    const { data } = route.snapshot;

    this.title = data.title;

    route.queryParamMap.subscribe((queryMap: Params) => {
      this.queryParams = queryMap.params;
    });

    route.params.subscribe(({ folderId }: Params) => {
      const nodeId = folderId || data.defaultNodeId;

      this.contentApi.getNode(nodeId).subscribe(
        (node) => {
          this.isValidPath = true;

          if (node.entry && node.entry.isFolder) {
            this.updateCurrentNode(node.entry);
          } else {
            this.router.navigate(['/personal-files', node.entry.parentId], {
              replaceUrl: true
            });
          }
        },
        () => (this.isValidPath = false)
      );
    });

    this.subscriptions = this.subscriptions.concat([
      nodeActionsService.contentCopied.subscribe((nodes) => this.onContentCopied(nodes)),
      uploadService.fileUploadComplete.pipe(debounceTime(300)).subscribe((file) => this.onFileUploadedEvent(file)),
      uploadService.fileUploadDeleted.pipe(debounceTime(300)).subscribe((file) => this.onFileUploadedEvent(file)),

      this.breakpointObserver.observe([Breakpoints.HandsetPortrait, Breakpoints.HandsetLandscape]).subscribe((result) => {
        this.isSmallScreen = result.matches;
      })
    ]);

    this.store
      .select(isAdmin)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((value) => {
        this.isAdmin = value;
      });

    this.columns = this.extensions.documentListPresets.files || [];
  }

  ngOnDestroy() {
    this.store.dispatch(new SetCurrentFolderAction(null));
    super.ngOnDestroy();
  }

  navigate(nodeId: string = null) {
    const currentNodeId = this.route.snapshot.paramMap.get('folderId');
    const urlWithoutParams = decodeURIComponent(this.router.url).split('?')[0];
    const urlToNavigate: string[] = this.getUrlToNavigate(urlWithoutParams, currentNodeId, nodeId);
    this.router.navigate(urlToNavigate);
  }

  private getUrlToNavigate(currentURL: string, currentNodeId: string, nextNodeId: string): string[] {
    return currentNodeId ? this.getNextNodeUrlToNavigate(currentURL, currentNodeId, nextNodeId) : this.appendNextNodeIdToUrl(currentURL, nextNodeId);
  }

  private getNextNodeUrlToNavigate(currentURL: string, currentNodeId: string, nextNodeId: string): string[] {
    const urlToNavigate: string[] =
      nextNodeId && !this.isRootNode(nextNodeId)
        ? this.replaceCurrentNodeIdWithNextNodeId(currentURL, currentNodeId, nextNodeId)
        : this.removeNodeIdFromUrl(currentURL, currentNodeId);
    urlToNavigate.shift();
    return urlToNavigate;
  }

  private replaceCurrentNodeIdWithNextNodeId(currentURL: string, currentNodeId: string, nextNodeId: string): string[] {
    const nextNodeUrlToNavigate = currentURL.split('/');
    const index = nextNodeUrlToNavigate.indexOf(currentNodeId);
    if (index > 0) {
      nextNodeUrlToNavigate[index] = nextNodeId;
    }
    return nextNodeUrlToNavigate;
  }

  private removeNodeIdFromUrl(currentURL: string, currentNodeId: string): string[] {
    const rootUrl: string[] = currentURL.replace(currentNodeId, '').split('/');
    rootUrl.pop();
    return rootUrl;
  }

  private appendNextNodeIdToUrl(currentURL: string, nodeId: string): string[] {
    const navigateToNodeUrl = currentURL.split('/');
    if (nodeId && !this.isRootNode(nodeId)) {
      navigateToNodeUrl.push(nodeId);
    }
    navigateToNodeUrl.shift();
    return navigateToNodeUrl;
  }

  onUploadNewVersion(ev: CustomEvent) {
    this.store.dispatch(new UploadFileVersionAction(ev));
  }

  navigateTo(node: MinimalNodeEntity) {
    if (node && node.entry) {
      this.selectedNode = node;
      const { isFolder } = node.entry;

      if (isFolder) {
        let id: string;

        if (node.entry.nodeType === 'app:folderlink') {
          id = node.entry.properties['cm:destination'];
        } else {
          id = node.entry.id;
        }

        this.documentList.resetNewFolderPagination();
        this.navigate(id);
        return;
      }

      this.showPreview(node, { location: this.router.url });
    }
  }

  handleNodeClick(event: Event) {
    this.navigateTo((event as CustomEvent).detail?.node);
  }

  onBreadcrumbNavigate(route: PathElementEntity) {
    this.documentList.resetNewFolderPagination();

    // todo: review this approach once 5.2.3 is out
    if (this.nodePath && this.nodePath.length > 2) {
      if (this.nodePath[1].name === 'Sites' && this.nodePath[2].id === route.id) {
        return this.navigate(this.nodePath[3].id);
      }
    }
    this.navigate(route.id);
  }

  onFileUploadedEvent(event: FileUploadEvent) {
    const node: MinimalNodeEntity = event.file.data;

    // check root and child nodes
    if (node && node.entry && node.entry.parentId === this.getParentNodeId()) {
      this.reload(this.selectedNode);
      return;
    }

    // check the child nodes to show dropped folder
    if (event && event.file.options.parentId === this.getParentNodeId()) {
      this.displayFolderParent(event.file.options.path, 0);
      return;
    }

    if (event && event.file.options.parentId) {
      if (this.nodePath) {
        const correspondingNodePath = this.nodePath.find((pathItem) => pathItem.id === event.file.options.parentId);

        // check if the current folder has the 'trigger-upload-folder' as one of its parents
        if (correspondingNodePath) {
          const correspondingIndex = this.nodePath.length - this.nodePath.indexOf(correspondingNodePath);
          this.displayFolderParent(event.file.options.path, correspondingIndex);
        }
      }
    }
  }

  displayFolderParent(filePath = '', index: number) {
    const parentName = filePath.split('/')[index];
    const currentFoldersDisplayed = (this.documentList.data.getRows() as ShareDataRow[]) || [];

    const alreadyDisplayedParentFolder = currentFoldersDisplayed.find((row) => row.node.entry.isFolder && row.node.entry.name === parentName);

    if (alreadyDisplayedParentFolder) {
      return;
    }
    this.reload(this.selectedNode);
  }

  onContentCopied(nodes: MinimalNodeEntity[]) {
    const newNode = nodes.find((node) => node && node.entry && node.entry.parentId === this.getParentNodeId());
    if (newNode) {
      this.reload(this.selectedNode);
    }
  }

  // todo: review this approach once 5.2.3 is out
  private async updateCurrentNode(node: MinimalNodeEntryEntity) {
    this.nodePath = null;

    if (node && node.path && node.path.elements) {
      const elements = node.path.elements;

      this.nodePath = elements.map((pathElement) => Object.assign({}, pathElement));

      if (elements.length > 1) {
        if (elements[1].name === 'User Homes') {
          if (!this.isAdmin) {
            elements.splice(0, 2);
          }
        } else if (elements[1].name === 'Sites') {
          await this.normalizeSitePath(node);
        }
      }
    }

    this.node = node;
    this.store.dispatch(new SetCurrentFolderAction(node));
  }

  // todo: review this approach once 5.2.3 is out
  private async normalizeSitePath(node: MinimalNodeEntryEntity) {
    const elements = node.path.elements;

    // remove 'Sites'
    elements.splice(1, 1);

    if (this.isSiteContainer(node)) {
      // rename 'documentLibrary' entry to the target site display name
      // clicking on the breadcrumb entry loads the site content
      const parentNode = await this.contentApi.getNodeInfo(node.parentId).toPromise();
      node.name = parentNode.properties['cm:title'] || parentNode.name;

      // remove the site entry
      elements.splice(1, 1);
    } else {
      // remove 'documentLibrary' in the middle of the path
      const docLib = elements.findIndex((el) => el.name === 'documentLibrary');
      if (docLib > -1) {
        const siteFragment = elements[docLib - 1];
        const siteNode = await this.contentApi.getNodeInfo(siteFragment.id).toPromise();

        // apply Site Name to the parent fragment
        siteFragment.name = siteNode.properties['cm:title'] || siteNode.name;
        elements.splice(docLib, 1);
      }
    }
  }

  isSiteContainer(node: MinimalNodeEntryEntity): boolean {
    if (node && node.aspectNames && node.aspectNames.length > 0) {
      return node.aspectNames.indexOf('st:siteContainer') >= 0;
    }
    return false;
  }

  isRootNode(nodeId: string): boolean {
    if (this.node && this.node.path && this.node.path.elements && this.node.path.elements.length > 0) {
      return this.node.path.elements[0].id === nodeId;
    }
    return false;
  }

  onFilterSelected(activeFilters: FilterSearch[]) {
    if (activeFilters.length) {
      this.showHeader = ShowHeaderMode.Always;
      this.navigateToFilter(activeFilters);
    } else {
      this.router.navigate(['.'], { relativeTo: this.route });
      this.showHeader = ShowHeaderMode.Data;
      this.onAllFilterCleared();
    }
  }

  navigateToFilter(activeFilters: FilterSearch[]) {
    const objectFromMap = {};
    activeFilters.forEach((filter: FilterSearch) => {
      let paramValue;
      if (filter.value && filter.value.from && filter.value.to) {
        paramValue = `${filter.value.from}||${filter.value.to}`;
      } else {
        paramValue = filter.value;
      }
      objectFromMap[filter.key] = paramValue;
    });

    this.router.navigate([], { relativeTo: this.route, queryParams: objectFromMap });
  }

  isFilterHeaderActive(): boolean {
    return this.showHeader === ShowHeaderMode.Always;
  }

  onError() {
    this.isValidPath = false;
  }
}
