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
import { MatDialog } from '@angular/material';
import { AlfrescoApiService } from '../services/alfresco-api.service';
import { NodeEntry } from '@alfresco/js-api';
import { DownloadService } from '../services/download.service';
/**
 * Directive selectors without adf- prefix will be deprecated on 3.0.0
 */
export declare class NodeDownloadDirective {
  private apiService;
  private downloadService;
  private dialog;
  /** Nodes to download. */
  nodes: NodeEntry | NodeEntry[];
  onClick(): void;
  constructor(
    apiService: AlfrescoApiService,
    downloadService: DownloadService,
    dialog: MatDialog
  );
  /**
   * Downloads multiple selected nodes.
   * Packs result into a .ZIP archive if there is more than one node selected.
   * @param selection Multiple selected nodes to download
   */
  downloadNodes(selection: NodeEntry | Array<NodeEntry>): void;
  /**
   * Downloads a single node.
   * Packs result into a .ZIP archive is the node is a Folder.
   * @param node Node to download
   */
  downloadNode(node: NodeEntry): void;
  private isSelectionValid;
  private downloadFile;
  private downloadZip;
}
