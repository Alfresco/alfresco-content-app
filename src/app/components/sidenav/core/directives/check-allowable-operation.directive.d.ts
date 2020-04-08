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
import {
  ChangeDetectorRef,
  ElementRef,
  OnChanges,
  Renderer2,
  SimpleChanges
} from '@angular/core';
import { NodeEntry } from '@alfresco/js-api';
import { ContentService } from './../services/content.service';
export interface NodeAllowableOperationSubject {
  disabled: boolean;
}
export declare class CheckAllowableOperationDirective implements OnChanges {
  private elementRef;
  private renderer;
  private contentService;
  private changeDetector;
  private parentComponent?;
  /** Node permission to check (create, delete, update, updatePermissions,
   * !create, !delete, !update, !updatePermissions).
   */
  permission: string;
  /** Nodes to check permission for. */
  nodes: NodeEntry[];
  constructor(
    elementRef: ElementRef,
    renderer: Renderer2,
    contentService: ContentService,
    changeDetector: ChangeDetectorRef,
    parentComponent?: NodeAllowableOperationSubject
  );
  ngOnChanges(changes: SimpleChanges): void;
  /**
   * Updates disabled state for the decorated element
   *
   * @memberof CheckAllowableOperationDirective
   */
  updateElement(): boolean;
  private enable;
  private disable;
  /**
   * Enables decorated element
   *
   * @memberof CheckAllowableOperationDirective
   */
  enableElement(): void;
  /**
   * Disables decorated element
   *
   * @memberof CheckAllowableOperationDirective
   */
  disableElement(): void;
  /**
   * Checks whether all nodes have a particular permission
   *
   * @param  nodes Node collection to check
   * @param  permission Permission to check for each node
   * @memberof CheckAllowableOperationDirective
   */
  hasAllowableOperations(nodes: NodeEntry[], permission: string): boolean;
}
