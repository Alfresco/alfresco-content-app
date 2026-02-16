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

import { Injectable } from '@angular/core';
import { SearchQueryBuilderService } from '@alfresco/adf-content-services';
import { SearchOptionIds, SearchOptionModel } from '@alfresco/aca-shared/store';
import { isOperator } from '../../utils/aca-search-utils';

@Injectable({ providedIn: 'root' })
export class SearchFilterService {
  searchInMode: 'content' | 'libraries' = 'content';
  filesChecked = true;
  foldersChecked = true;

  searchOptions: SearchOptionModel[] = [
    {
      id: SearchOptionIds.Files,
      key: 'SEARCH.INPUT.FILES',
      value: false,
      shouldDisable: () => this.isLibrariesChecked()
    },
    {
      id: SearchOptionIds.Folders,
      key: 'SEARCH.INPUT.FOLDERS',
      value: false,
      shouldDisable: () => this.isLibrariesChecked()
    },
    {
      id: SearchOptionIds.Libraries,
      key: 'SEARCH.INPUT.LIBRARIES',
      value: false,
      shouldDisable: () => this.isContentChecked()
    }
  ];

  constructor(private readonly queryBuilder: SearchQueryBuilderService) {}

  isFilesChecked(): boolean {
    return this.getOptionValue(SearchOptionIds.Files);
  }

  isFoldersChecked(): boolean {
    return this.getOptionValue(SearchOptionIds.Folders);
  }

  isLibrariesChecked(): boolean {
    return this.getOptionValue(SearchOptionIds.Libraries);
  }

  isContentChecked(): boolean {
    return this.isFilesChecked() || this.isFoldersChecked();
  }

  getSearchInLabel(): string {
    if (this.searchInMode === SearchOptionIds.Libraries) {
      return 'SEARCH.INPUT.LIBRARIES';
    }
    if (this.filesChecked && this.foldersChecked) {
      return 'SEARCH.INPUT.FILES_AND_FOLDERS';
    }
    if (this.filesChecked) {
      return 'SEARCH.INPUT.FILES';
    }
    if (this.foldersChecked) {
      return 'SEARCH.INPUT.FOLDERS';
    }
    return 'SEARCH.INPUT.FILES_AND_FOLDERS';
  }

  validateSearchTerm(term: string): string | null {
    if (!term) {
      return 'SEARCH.INPUT.REQUIRED';
    }
    if (/^\s+$/.test(term)) {
      return 'SEARCH.INPUT.WHITESPACE';
    }

    const words = term.trim().split(/\s+/);
    if (isOperator(words[0]) || isOperator(words[words.length - 1])) {
      return 'SEARCH.INPUT.OPERATORS';
    }

    if (/^[+\-|!(){}[\]^"~*?:\\/]/.test(term) || /[+\-|!(){}[\]^"~*?:\\/]$/.test(term)) {
      return 'SEARCH.INPUT.OPERATORS';
    }
    if (this.searchInMode === SearchOptionIds.Libraries && term.length < 2) {
      return 'SEARCH.INPUT.MIN_LENGTH';
    }
    return null;
  }
  syncSearchOptionsFromState() {
    const filesOption = this.searchOptions.find((opt) => opt.id === SearchOptionIds.Files);
    const foldersOption = this.searchOptions.find((opt) => opt.id === SearchOptionIds.Folders);
    const librariesOption = this.searchOptions.find((opt) => opt.id === SearchOptionIds.Libraries);

    if (this.searchInMode === SearchOptionIds.Libraries) {
      filesOption.value = false;
      foldersOption.value = false;
      librariesOption.value = true;
    } else {
      filesOption.value = this.filesChecked && !this.foldersChecked;
      foldersOption.value = this.foldersChecked && !this.filesChecked;
      librariesOption.value = false;
    }
  }

  applyContentFilters() {
    this.syncSearchOptionsFromState();

    if (this.isLibrariesChecked()) {
      this.removeContentFilters();
      return;
    }

    if (this.isFoldersChecked() && !this.isFilesChecked()) {
      this.setContentFilter(SearchOptionIds.Folders);
    } else if (this.isFilesChecked() && !this.isFoldersChecked()) {
      this.setContentFilter(SearchOptionIds.Files);
    } else {
      this.removeContentFilters();
    }
  }

  removeContentFilters() {
    this.queryBuilder.removeFilterQuery(`+TYPE:'cm:${SearchOptionIds.Files}'`);
    this.queryBuilder.removeFilterQuery(`+TYPE:'cm:${SearchOptionIds.Folders}'`);
  }

  initForLibrariesRoute() {
    this.searchInMode = SearchOptionIds.Libraries;
    this.filesChecked = false;
    this.foldersChecked = false;
  }

  private getOptionValue(optionId: string): boolean {
    const item = this.searchOptions.find((opt) => opt.id === optionId);
    return !!item && item.value;
  }

  private setContentFilter(option: SearchOptionIds.Folders | SearchOptionIds.Files) {
    const oppositeOption = option === SearchOptionIds.Folders ? SearchOptionIds.Files : SearchOptionIds.Folders;
    this.queryBuilder.addFilterQuery(`+TYPE:'cm:${option}'`);
    this.queryBuilder.removeFilterQuery(`+TYPE:'cm:${oppositeOption}'`);
  }
}
