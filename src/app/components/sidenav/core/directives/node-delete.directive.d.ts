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
import { ElementRef, EventEmitter, OnChanges } from '@angular/core';
import { NodeEntry, DeletedNodeEntity } from '@alfresco/js-api';
import { AlfrescoApiService } from '../services/alfresco-api.service';
import { TranslationService } from '../services/translation.service';
export declare class NodeDeleteDirective implements OnChanges {
  private alfrescoApiService;
  private translation;
  private elementRef;
  /** Array of nodes to delete. */
  selection: NodeEntry[] | DeletedNodeEntity[];
  /** If true then the nodes are deleted immediately rather than being put in the trash */
  permanent: boolean;
  /** Emitted when the nodes have been deleted. */
  delete: EventEmitter<any>;
  onClick(): void;
  constructor(
    alfrescoApiService: AlfrescoApiService,
    translation: TranslationService,
    elementRef: ElementRef
  );
  ngOnChanges(): void;
  private setDisableAttribute;
  private process;
  private getDeleteNodesBatch;
  private deleteNode;
  private processStatus;
  private getMessage;
}
