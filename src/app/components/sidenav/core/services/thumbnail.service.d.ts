/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { AlfrescoApiService } from './alfresco-api.service';
import { NodeEntry } from '@alfresco/js-api';
export declare class ThumbnailService {
  protected apiService: AlfrescoApiService;
  DEFAULT_ICON: string;
  mimeTypeIcons: any;
  constructor(
    apiService: AlfrescoApiService,
    matIconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
  );
  /**
   * Gets a thumbnail URL for the given document node.
   * @param node Node or Node ID to get URL for.
   * @param attachment Toggles whether to retrieve content as an attachment for download
   * @param ticket Custom ticket to use for authentication
   * @returns URL string
   */
  getDocumentThumbnailUrl(
    node: NodeEntry | string,
    attachment?: boolean,
    ticket?: string
  ): string;
  /**
   * Gets a thumbnail URL for a MIME type.
   * @param mimeType MIME type for the thumbnail
   * @returns URL string
   */
  getMimeTypeIcon(mimeType: string): string;
  /**
   * Gets a "miscellaneous" thumbnail URL for types with no other icon defined.
   * @returns URL string
   */
  getDefaultMimeTypeIcon(): string;
}
