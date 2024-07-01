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

  toggleAISearchInput = new BehaviorSubject<boolean>(false);
  toggleAISearchInput$ = this.toggleAISearchInput.asObservable();

  constructor(private apiService: AlfrescoApiService) {}

  updateAISearchInputState(isAISearchActive: boolean) {
    this.toggleAISearchInput.next(isAISearchActive);
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
    const errorMessages: string[] = [];
    if (selectedNodesState.count === 0) {
      errorMessages.push('Please select some file.');
    }
    if (selectedNodesState.count > 1) {
      errorMessages.push('Please select no more than 100 files.');
    }
    if (selectedNodesState.library) {
      errorMessages.push('Libraries are not compatible with AI Agents.');
    } else {
      if (selectedNodesState.nodes.some((node) => !node.entry.isFolder && !this.textFileMimeTypes.includes(node.entry.content.mimeType))) {
        errorMessages.push('Only text related files are compatible with AI Agents.');
      }
      if (selectedNodesState.nodes.some((node) => node.entry.isFolder)) {
        errorMessages.push('Folders are not compatible with AI Agents.');
      }
    }
    return errorMessages.join(' ');
  }
}
