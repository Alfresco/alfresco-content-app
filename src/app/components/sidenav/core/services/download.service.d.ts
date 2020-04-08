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
export declare class DownloadService {
  private readonly saveData;
  constructor();
  /**
   * Invokes content download for a Blob with a file name.
   * @param blob Content to download.
   * @param fileName Name of the resulting file.
   */
  downloadBlob(blob: Blob, fileName: string): void;
  /**
   * Invokes content download for a data array with a file name.
   * @param data Data to download.
   * @param fileName Name of the resulting file.
   */
  downloadData(data: any, fileName: string): void;
  /**
   * Invokes content download for a JSON object with a file name.
   * @param json JSON object to download.
   * @param fileName Name of the resulting file.
   */
  downloadJSON(json: any, fileName: string): void;
  /**
   * Invokes the download of the file by its URL address.
   * @param url Url address pointing to the file.
   * @param fileName Name of the file download.
   */
  downloadUrl(url: string, fileName: string): void;
}
