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
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy,
  ViewEncapsulation
} from '@angular/core';

import { NodeEntry } from '@alfresco/js-api';

@Component({
  selector: 'aca-locked-by',
  template: `
    <mat-icon class="locked_by--icon">lock</mat-icon>
    <span class="locked_by--name">{{ writeLockedBy() }}</span>
  `,
  styleUrls: ['./locked-by.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'aca-locked-by'
  }
})
export class LockByComponent implements OnInit {
  @Input()
  context: any;

  node: NodeEntry;

  constructor() {}

  ngOnInit() {
    this.node = this.context.row.node;
  }

  writeLockedBy() {
    return (
      this.node &&
      this.node.entry.properties &&
      this.node.entry.properties['cm:lockOwner'] &&
      this.node.entry.properties['cm:lockOwner'].displayName
    );
  }
}
