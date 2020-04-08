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
import { RenditionEntry } from '@alfresco/js-api';
import { AlfrescoApiService } from '../../services/alfresco-api.service';
import { LogService } from '../../services/log.service';
export declare class ViewUtilService {
  private apiService;
  private logService;
  static TARGET: string;
  /**
   * Content groups based on categorization of files that can be viewed in the web browser. This
   * implementation or grouping is tied to the definition the ng component: ViewerComponent
   */
  static ContentGroup: {
    IMAGE: string;
    MEDIA: string;
    PDF: string;
    TEXT: string;
  };
  /**
   * Based on ViewerComponent Implementation, this value is used to determine how many times we try
   * to get the rendition of a file for preview, or printing.
   */
  maxRetries: number;
  /**
   * Mime-type grouping based on the ViewerComponent.
   */
  private mimeTypes;
  constructor(apiService: AlfrescoApiService, logService: LogService);
  /**
   * This method takes a url to trigger the print dialog against, and the type of artifact that it
   * is.
   * This URL should be one that can be rendered in the browser, for example PDF, Image, or Text
   */
  printFile(url: string, type: string): void;
  /**
   * Launch the File Print dialog from anywhere other than the preview service, which resolves the
   * rendition of the object that can be printed from a web browser.
   * These are: images, PDF files, or PDF rendition of files.
   * We also force PDF rendition for TEXT type objects, otherwise the default URL is to download.
   * TODO there are different TEXT type objects, (HTML, plaintext, xml, etc. we should determine how these are handled)
   */
  printFileGeneric(objectId: string, mimeType: string): void;
  getRenditionUrl(
    nodeId: string,
    type: string,
    renditionExists: boolean
  ): string;
  private waitRendition;
  getViewerTypeByMimeType(mimeType: string): string;
  wait(ms: number): Promise<any>;
  getRendition(nodeId: string, renditionId: string): Promise<RenditionEntry>;
}
