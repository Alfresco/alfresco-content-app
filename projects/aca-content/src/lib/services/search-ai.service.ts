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

import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { AlfrescoApiService } from '@alfresco/adf-core';
import { AiSearchResultModel } from './ai-search-result.model';
import { SelectionState } from '@alfresco/adf-extensions';
import { SearchAiInputState } from './search-ai-input-state';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class SearchAiService {
  private readonly textFileMimeTypes = [
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.oasis.opendocument.text',
    'application/rtf',
    'text/plain',
    'application/pdf'
  ];

  toggleSearchAiInput = new BehaviorSubject<SearchAiInputState>({
    active: false
  });
  toggleSearchAiInput$ = this.toggleSearchAiInput.asObservable();

  constructor(private apiService: AlfrescoApiService, private translateService: TranslateService) {}

  updateSearchAiInputState(state: SearchAiInputState) {
    this.toggleSearchAiInput.next(state);
  }

  setSearchClientBasePath(basePath: string) {
    this.apiService.getInstance().searchClient.basePath = basePath;
  }

  executeAISearch(searchTerm: string, restrictionQuery?: string): Observable<AiSearchResultModel> {
    const body = {
      include: ['path'],
      query: {
        language: 'afts',
        userQuery: searchTerm,
        ...(restrictionQuery && restrictionQuery !== '' && { query: `ANCESTOR:'workspace://SpacesStore/${restrictionQuery}'` })
      }
    };
    const requestParams = [{}, {}, {}, {}, body, ['application/json'], ['application/json']];
    return from(this.apiService.getInstance().searchClient.callApi('/aisearch/search', 'POST', ...requestParams));
  }

  checkSearchAvailability(selectedNodesState: SelectionState): string {
    const messages: string[] = [];
    if (selectedNodesState.count === 0) {
      messages.push('KNOWLEDGE_RETRIEVAL.SEARCH.WARNINGS.NO_FILES_SELECTED');
    }
    if (selectedNodesState.count > 100) {
      messages.push('KNOWLEDGE_RETRIEVAL.SEARCH.WARNINGS.TOO_MANY_FILES_SELECTED');
    }
    if (selectedNodesState.nodes.some((node) => !node.entry.isFolder && !this.textFileMimeTypes.includes(node.entry.content.mimeType))) {
      messages.push('KNOWLEDGE_RETRIEVAL.SEARCH.WARNINGS.NON_TEXT_FILE_SELECTED');
    }
    if (selectedNodesState.nodes.some((node) => node.entry.isFolder)) {
      messages.push('KNOWLEDGE_RETRIEVAL.SEARCH.WARNINGS.FOLDER_SELECTED');
    }
    return messages.map((message) => this.translateService.instant(message)).join(' ');
  }
}
