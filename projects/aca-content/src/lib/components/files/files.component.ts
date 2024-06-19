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

import { DataTableModule, PaginationComponent, ShowHeaderMode } from '@alfresco/adf-core';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { NodeEntry, Node, PathElement } from '@alfresco/js-api';
import { NodeActionsService } from '../../services/node-actions.service';
import {
  ContentApiService,
  ContextActionsDirective,
  GenericErrorComponent,
  InfoDrawerComponent,
  PageComponent,
  PageLayoutComponent,
  PaginationDirective,
  ToolbarComponent
} from '@alfresco/aca-shared';
import { SetCurrentFolderAction, isAdmin, UploadFileVersionAction, showLoaderSelector } from '@alfresco/aca-shared/store';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { BreadcrumbModule, DocumentListModule, FileUploadEvent, FilterSearch, ShareDataRow, UploadModule } from '@alfresco/adf-content-services';
import { DocumentListPresetRef, DynamicColumnComponent } from '@alfresco/adf-extensions';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DocumentListDirective } from '../../directives/document-list.directive';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SearchAIService } from '../../services/search-ai.service';
import { MatIconModule } from '@angular/material/icon';
import { SearchAiInputComponent } from '../ai/search-ai/search-ai-input/search-ai-input.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { SearchInputContainerComponent } from '../ai/search-ai/search-input-container/search-input-container.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    BreadcrumbModule,
    GenericErrorComponent,
    UploadModule,
    DocumentListModule,
    DocumentListDirective,
    ContextActionsDirective,
    DataTableModule,
    PaginationComponent,
    MatProgressSpinnerModule,
    InfoDrawerComponent,
    PaginationDirective,
    PageLayoutComponent,
    ToolbarComponent,
    MatIconModule,
    SearchAiInputComponent,
    MatButtonModule,
    MatDividerModule,
    SearchInputContainerComponent,
    DynamicColumnComponent
  ],
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss'],
  encapsulation: ViewEncapsulation.None,
  selector: 'aca-files'
})
export class FilesComponent extends PageComponent implements OnInit, OnDestroy {
  isValidPath = true;
  isAdmin = false;
  selectedNode: NodeEntry;
  queryParams = null;
  showLoader$ = this.store.select(showLoaderSelector);
  private nodePath: PathElement[];

  columns: DocumentListPresetRef[] = [];
  isFilterHeaderActive = false;
  showAISearchInput = false;

  constructor(
    private contentApi: ContentApiService,
    private nodeActionsService: NodeActionsService,
    private route: ActivatedRoute,
    private searchAIService: SearchAIService
  ) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();

    const { data } = this.route.snapshot;

    this.title = data.title;

    this.route.queryParamMap.pipe(takeUntil(this.onDestroy$)).subscribe((queryMap: Params) => {
      this.queryParams = queryMap.params;
    });
    this.route.params.pipe(takeUntil(this.onDestroy$)).subscribe(({ folderId }: Params) => {
      const nodeId = folderId || data.defaultNodeId;

      this.contentApi
        .getNode(nodeId)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe(
          (node) => {
            this.isValidPath = true;

            if (node?.entry?.isFolder) {
              void this.updateCurrentNode(node.entry);
            } else {
              void this.router.navigate(['/personal-files', node.entry.parentId], {
                replaceUrl: true
              });
            }
          },
          () => (this.isValidPath = false)
        );
    });

    this.subscriptions = this.subscriptions.concat([
      this.nodeActionsService.contentCopied.subscribe((nodes) => this.onContentCopied(nodes)),
      this.searchAIService.toggleAISearchInput$.subscribe((showAISearchInput) => (this.showAISearchInput = showAISearchInput)),
      this.uploadService.fileUploadComplete.pipe(debounceTime(300)).subscribe((file) => this.onFileUploadedEvent(file)),
      this.uploadService.fileUploadDeleted.pipe(debounceTime(300)).subscribe((file) => this.onFileUploadedEvent(file))
    ]);

    this.store
      .select(isAdmin)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((value) => {
        this.isAdmin = value;
      });

    this.extensions.filesDocumentListPreset$.pipe(takeUntil(this.onDestroy$)).subscribe((preset) => {
      this.columns = preset;
    });

    if (this.queryParams && Object.keys(this.queryParams).length > 0) {
      this.isFilterHeaderActive = true;
    }
  }

  ngOnDestroy() {
    this.store.dispatch(new SetCurrentFolderAction(null));
    super.ngOnDestroy();
  }

  navigate(nodeId: string = null) {
    const currentNodeId = this.route.snapshot.paramMap.get('folderId');
    const urlWithoutParams = decodeURIComponent(this.router.url).split('?')[0];
    const urlToNavigate: string[] = this.getUrlToNavigate(urlWithoutParams, currentNodeId, nodeId);
    void this.router.navigate(urlToNavigate);
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

  navigateTo(node: NodeEntry) {
    if (node?.entry) {
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

  onBreadcrumbNavigate(route: PathElement) {
    this.documentList.resetNewFolderPagination();

    // todo: review this approach once 5.2.3 is out
    if (this.nodePath && this.nodePath?.length > 2) {
      if (this.nodePath[1].name === 'Sites' && this.nodePath[2].id === route.id) {
        return this.navigate(this.nodePath[3].id);
      }
    }
    this.navigate(route.id);
  }

  onFileUploadedEvent(event: FileUploadEvent) {
    const node: NodeEntry = event.file.data;

    // check root and child nodes
    if (node?.entry?.parentId === this.getParentNodeId()) {
      this.reload(this.selectedNode);
      return;
    }

    // check the child nodes to show dropped folder
    if (event && event.file.options.parentId === this.getParentNodeId()) {
      this.displayFolderParent(0, event.file.options.path);
      return;
    }

    if (event?.file.options.parentId) {
      if (this.nodePath) {
        const correspondingNodePath = this.nodePath.find((pathItem) => pathItem.id === event.file.options.parentId);

        // check if the current folder has the 'trigger-upload-folder' as one of its parents
        if (correspondingNodePath) {
          const correspondingIndex = this.nodePath.length - this.nodePath.indexOf(correspondingNodePath);
          this.displayFolderParent(correspondingIndex, event.file.options.path);
        }
      }
    }
  }

  displayFolderParent(index: number, filePath = '') {
    const parentName = filePath.split('/').filter((el) => el)[index];
    const currentFoldersDisplayed = (this.documentList.data.getRows() as ShareDataRow[]) || [];

    const alreadyDisplayedParentFolder = currentFoldersDisplayed.find((row) => row.node.entry.isFolder && row.node.entry.name === parentName);

    if (alreadyDisplayedParentFolder) {
      return;
    }
    this.reload(this.selectedNode);
  }

  onContentCopied(nodes: NodeEntry[]) {
    const newNode = nodes.find((node) => node?.entry?.parentId === this.getParentNodeId());
    if (newNode) {
      this.reload(this.selectedNode);
    }
  }

  // todo: review this approach once 5.2.3 is out
  private async updateCurrentNode(node: Node) {
    this.nodePath = null;

    if (node?.path?.elements) {
      const elements = node.path.elements;

      this.nodePath = elements.map((pathElement) => {
        return { ...pathElement };
      });

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
  private async normalizeSitePath(node: Node) {
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

  isSiteContainer(node: Node): boolean {
    if (node?.aspectNames?.length > 0) {
      return node.aspectNames.indexOf('st:siteContainer') >= 0;
    }
    return false;
  }

  isRootNode(nodeId: string): boolean {
    if (this.node?.path?.elements?.length > 0) {
      return this.node.path.elements[0].id === nodeId;
    }
    return false;
  }

  onFilterSelected(activeFilters: FilterSearch[]) {
    if (activeFilters.length) {
      this.showHeader = ShowHeaderMode.Always;
      this.isFilterHeaderActive = true;
      this.navigateToFilter(activeFilters);
    } else {
      void this.router.navigate(['.'], { relativeTo: this.route });
      this.isFilterHeaderActive = false;
      this.showHeader = ShowHeaderMode.Data;
      this.onAllFilterCleared();
    }
  }

  navigateToFilter(activeFilters: FilterSearch[]) {
    const objectFromMap = {};
    activeFilters.forEach((filter: FilterSearch) => {
      let paramValue;
      if (filter?.value?.from && filter?.value?.to) {
        paramValue = `${filter.value.from}||${filter.value.to}`;
      } else {
        paramValue = filter.value;
      }
      objectFromMap[filter.key] = paramValue;
    });

    void this.router.navigate([], { relativeTo: this.route, queryParams: objectFromMap });
  }

  onError() {
    this.isValidPath = false;
  }
}
