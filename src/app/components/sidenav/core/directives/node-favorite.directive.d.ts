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
import { EventEmitter, OnChanges } from '@angular/core';
import { NodeEntry } from '@alfresco/js-api';
import { AlfrescoApiService } from '../services/alfresco-api.service';
export declare class NodeFavoriteDirective implements OnChanges {
  private alfrescoApiService;
  favorites: any[];
  /** Array of nodes to toggle as favorites. */
  selection: NodeEntry[];
  /** Emitted when the favorite setting is complete. */
  toggle: EventEmitter<any>;
  /** Emitted when the favorite setting fails. */
  error: EventEmitter<any>;
  onClick(): void;
  constructor(alfrescoApiService: AlfrescoApiService);
  ngOnChanges(changes: any): void;
  toggleFavorite(): void;
  markFavoritesNodes(selection: NodeEntry[]): void;
  hasFavorites(): boolean;
  private getProcessBatch;
  private getFavorite;
  private createFavoriteBody;
  private getNodeType;
  private diff;
  private reduce;
}
