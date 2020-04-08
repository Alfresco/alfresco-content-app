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
import { DomSanitizer } from '@angular/platform-browser';
import { MinimalNode, Node, NodeEntry } from '@alfresco/js-api';
import { Observable, Subject } from 'rxjs';
import { FolderCreatedEvent } from '../events/folder-created.event';
import { AlfrescoApiService } from './alfresco-api.service';
import { AuthenticationService } from './authentication.service';
import { LogService } from './log.service';
import { PermissionsEnum } from '../models/permissions.enum';
import { AllowableOperationsEnum } from '../models/allowable-operations.enum';
import { DownloadService } from './download.service';
import { ThumbnailService } from './thumbnail.service';
export declare class ContentService {
  authService: AuthenticationService;
  apiService: AlfrescoApiService;
  private logService;
  private sanitizer;
  private downloadService;
  private thumbnailService;
  folderCreated: Subject<FolderCreatedEvent>;
  folderCreate: Subject<MinimalNode>;
  folderEdit: Subject<MinimalNode>;
  constructor(
    authService: AuthenticationService,
    apiService: AlfrescoApiService,
    logService: LogService,
    sanitizer: DomSanitizer,
    downloadService: DownloadService,
    thumbnailService: ThumbnailService
  );
  /**
   * @deprecated in 3.2.0, use DownloadService instead.
   * Invokes content download for a Blob with a file name.
   * @param blob Content to download.
   * @param fileName Name of the resulting file.
   */
  downloadBlob(blob: Blob, fileName: string): void;
  /**
   * @deprecated in 3.2.0, use DownloadService instead.
   * Invokes content download for a data array with a file name.
   * @param data Data to download.
   * @param fileName Name of the resulting file.
   */
  downloadData(data: any, fileName: string): void;
  /**
   * @deprecated in 3.2.0, use DownloadService instead.
   * Invokes content download for a JSON object with a file name.
   * @param json JSON object to download.
   * @param fileName Name of the resulting file.
   */
  downloadJSON(json: any, fileName: string): void;
  /**
   * Creates a trusted object URL from the Blob.
   * WARNING: calling this method with untrusted user data exposes your application to XSS security risks!
   * @param  blob Data to wrap into object URL
   * @returns URL string
   */
  createTrustedUrl(blob: Blob): string;
  private readonly contentApi;
  /**
   * @deprecated in 3.2.0, use ThumbnailService instead.
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
   * Gets a content URL for the given node.
   * @param node Node or Node ID to get URL for.
   * @param attachment Toggles whether to retrieve content as an attachment for download
   * @param ticket Custom ticket to use for authentication
   * @returns URL string or `null`
   */
  getContentUrl(
    node: NodeEntry | string,
    attachment?: boolean,
    ticket?: string
  ): string;
  /**
   * Gets content for the given node.
   * @param nodeId ID of the target node
   * @returns Content data
   */
  getNodeContent(nodeId: string): Observable<any>;
  /**
   * Gets a Node via its node ID.
   * @param nodeId ID of the target node
   * @param opts Options supported by JS-API
   * @returns Details of the folder
   */
  getNode(nodeId: string, opts?: any): Observable<NodeEntry>;
  /**
   * Checks if the user has permission on that node
   * @param node Node to check permissions
   * @param permission Required permission type
   * @returns True if the user has the required permissions, false otherwise
   */
  hasPermissions(node: Node, permission: PermissionsEnum | string): boolean;
  /**
   * Checks if the user has permissions on that node
   * @param node Node to check allowableOperations
   * @param allowableOperation Create, delete, update, updatePermissions, !create, !delete, !update, !updatePermissions
   * @returns True if the user has the required permissions, false otherwise
   */
  hasAllowableOperations(
    node: Node,
    allowableOperation: AllowableOperationsEnum | string
  ): boolean;
  private handleError;
}
