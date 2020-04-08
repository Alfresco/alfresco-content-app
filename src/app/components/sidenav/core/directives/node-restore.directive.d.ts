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
import { EventEmitter } from '@angular/core';
import { DeletedNodeEntry, PathInfoEntity } from '@alfresco/js-api';
import { AlfrescoApiService } from '../services/alfresco-api.service';
import { TranslationService } from '../services/translation.service';
export declare class RestoreMessageModel {
  message: string;
  path: PathInfoEntity;
  action: string;
}
export declare class NodeRestoreDirective {
  private alfrescoApiService;
  private translation;
  private readonly restoreProcessStatus;
  /** Array of deleted nodes to restore. */
  selection: DeletedNodeEntry[];
  /** Emitted when restoration is complete. */
  restore: EventEmitter<RestoreMessageModel>;
  onClick(): void;
  constructor(
    alfrescoApiService: AlfrescoApiService,
    translation: TranslationService
  );
  private recover;
  private restoreNodesBatch;
  private getNodesWithPath;
  private getDeletedNodes;
  private restoreNode;
  private diff;
  private processStatus;
  private getRestoreMessage;
  private notification;
  private reset;
}
