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
import { NodeEntry, DownloadEntry, DownloadBodyCreate } from '@alfresco/js-api';
import { Observable } from 'rxjs';
import { LogService } from './log.service';
import { AlfrescoApiService } from './alfresco-api.service';
export declare class DownloadZipService {
  private apiService;
  private logService;
  constructor(apiService: AlfrescoApiService, logService: LogService);
  /**
   * Creates a new download.
   * @param payload Object containing the node IDs of the items to add to the ZIP file
   * @returns Status object for the download
   */
  createDownload(payload: DownloadBodyCreate): Observable<DownloadEntry>;
  /**
   * Gets a content URL for the given node.
   * @param nodeId Node to get URL for.
   * @param attachment Toggles whether to retrieve content as an attachment for download
   * @returns URL string
   */
  getContentUrl(nodeId: string, attachment?: boolean): string;
  /**
   * Gets a Node via its node ID.
   * @param nodeId ID of the target node
   * @returns Details of the node
   */
  getNode(nodeId: string): Observable<NodeEntry>;
  /**
   * Gets status information for a download node.
   * @param downloadId ID of the download node
   * @returns Status object for the download
   */
  getDownload(downloadId: string): Observable<DownloadEntry>;
  /**
   * Cancels a download.
   * @param downloadId ID of the target download node
   */
  cancelDownload(downloadId: string): void;
  private handleError;
}
