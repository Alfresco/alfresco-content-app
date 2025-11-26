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

import {
  AfterContentInit,
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Input,
  Output,
  ViewEncapsulation
} from '@angular/core';
import {
  AppConfigService,
  DataCellEvent,
  DATATABLE_DIRECTIVES,
  DataTableComponent,
  DataTableSchema,
  NotificationService,
  ShowHeaderMode,
  TEMPLATE_DIRECTIVES
} from '@alfresco/adf-core';
import { Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SavedSearchesListUiService } from '../saved-searches-list-ui.service';
import { savedSearchesListSchema } from '../smart-list/saved-searches-list-schema';
import { SavedSearch } from '@alfresco/adf-content-services';
import { Clipboard } from '@angular/cdk/clipboard';
import { Router } from '@angular/router';

@Component({
  selector: 'aca-saved-searches-ui-list',
  imports: [CommonModule, DATATABLE_DIRECTIVES, TEMPLATE_DIRECTIVES, DataTableComponent],
  templateUrl: './saved-searches-list.ui-component.html',
  styleUrls: ['./saved-searches-list.ui-component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'aca-saved-searches-ui-list' }
})
export class SavedSearchesListUiComponent extends DataTableSchema implements AfterContentInit {
  @Input()
  savedSearches: SavedSearch[] = [];

  @Output()
  savedSearchOrderChanged = new EventEmitter<{ previousIndex: number; currentIndex: number }>();

  readonly ShowHeaderMode = ShowHeaderMode;

  private readonly notificationService = inject(NotificationService);
  private readonly savedSearchesListUiService = inject(SavedSearchesListUiService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly contextMenuAction$ = new Subject<any>();
  private readonly editSavedSearchOptionKey = 'edit';
  private readonly deleteSavedSearchOptionKey = 'delete';
  private readonly copyToClipboardUrlOptionKey = 'copy';
  private readonly executeSearchOptionKey = 'execute';
  private readonly menuOptions = [
    {
      icon: 'copy',
      title: 'APP.BROWSE.SEARCH.SAVE_SEARCH.LIST.COPY_TO_CLIPBOARD',
      key: this.copyToClipboardUrlOptionKey
    },
    {
      icon: 'exit_to_app',
      title: 'APP.BROWSE.SEARCH.SAVE_SEARCH.LIST.EXECUTE_SEARCH',
      key: this.executeSearchOptionKey
    },
    {
      icon: 'edit',
      title: 'APP.BROWSE.SEARCH.SAVE_SEARCH.EDIT_DIALOG.CONTEXT_OPTION',
      key: this.editSavedSearchOptionKey
    },
    {
      icon: 'delete',
      title: 'APP.BROWSE.SEARCH.SAVE_SEARCH.DELETE_DIALOG.CONTEXT_OPTION',
      key: this.deleteSavedSearchOptionKey
    }
  ];

  constructor(
    protected appConfig: AppConfigService,
    private readonly clipboard: Clipboard,
    private readonly router: Router,
    private readonly hostElement: ElementRef<HTMLElement>
  ) {
    super(appConfig, '', savedSearchesListSchema);
  }

  ngAfterContentInit() {
    this.createDatatableSchema();
    this.contextMenuAction$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((action) => this.executeMenuOption(action.key, action.data));
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKeydown() {
    const contextMenu = document.querySelector<HTMLElement>('.adf-context-menu');
    if (contextMenu) {
      this.hostElement.nativeElement.querySelector<HTMLElement>('.adf-context-menu-source')?.focus();
    }
  }

  onShowRowActionsMenu(event: DataCellEvent): void {
    event.value.actions = this.menuOptions;
  }

  onSearchOrderChange(event: { previousIndex: number; currentIndex: number }): void {
    this.savedSearchOrderChanged.next(event);
  }

  executeMenuOption(optionKey: string, savedSearchData: SavedSearch): void {
    switch (optionKey) {
      case this.editSavedSearchOptionKey:
        this.openEditSavedSearchDialog(savedSearchData);
        break;
      case this.deleteSavedSearchOptionKey:
        this.openDeleteSavedSearchDialog(savedSearchData);
        break;
      case this.copyToClipboardUrlOptionKey:
        this.copyToClipboard(savedSearchData);
        break;
      case this.executeSearchOptionKey:
        this.executeSearch(savedSearchData);
        break;
    }
  }

  openEditSavedSearchDialog(savedSearch: SavedSearch): void {
    this.savedSearchesListUiService.openEditSavedSearch(savedSearch);
  }

  openDeleteSavedSearchDialog(savedSearch: SavedSearch): void {
    this.savedSearchesListUiService.confirmDeleteSavedSearch(savedSearch);
  }

  copyToClipboard(savedSearch: SavedSearch): void {
    this.clipboard.copy(this.getFullUrl(savedSearch.encodedUrl));
    this.notificationService.showInfo('APP.BROWSE.SEARCH.SAVE_SEARCH.LIST.COPY_TO_CLIPBOARD_SUCCESS');
  }

  executeSearch(savedSearch: SavedSearch): void {
    this.router.navigate(['/search'], {
      queryParams: { q: decodeURIComponent(savedSearch.encodedUrl) }
    });
  }

  fillContextMenu(event: DataCellEvent) {
    event.value.actions = this.menuOptions.map((option) => ({
      title: option.title,
      key: option.key,
      subject: this.contextMenuAction$,
      model: {
        visible: true,
        icon: option.icon
      },
      data: event.value.row.obj
    }));
  }

  private getFullUrl(path: string): string {
    const baseUrl = window.location.origin;
    return `${baseUrl}/#/search?q=${path}`;
  }
}
