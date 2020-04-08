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
import { FileModel, FileUploadStatus } from '../models/file.model';
export declare class FileUploadEvent {
  readonly file: FileModel;
  readonly status: FileUploadStatus;
  readonly error: any;
  constructor(file: FileModel, status?: FileUploadStatus, error?: any);
}
export declare class FileUploadCompleteEvent extends FileUploadEvent {
  totalComplete: number;
  data?: any;
  totalAborted: number;
  constructor(
    file: FileModel,
    totalComplete?: number,
    data?: any,
    totalAborted?: number
  );
}
export declare class FileUploadDeleteEvent extends FileUploadEvent {
  totalComplete: number;
  constructor(file: FileModel, totalComplete?: number);
}
export declare class FileUploadErrorEvent extends FileUploadEvent {
  error: any;
  totalError: number;
  constructor(file: FileModel, error: any, totalError?: number);
}
