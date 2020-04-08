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
import { EventEmitter, QueryList, TemplateRef } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material';
export declare class InfoDrawerTabComponent {
  /** The title of the tab (string or translation key). */
  label: string;
  /** Icon to render for the tab. */
  icon: string;
  content: TemplateRef<any>;
}
export declare class InfoDrawerComponent {
  /** The title of the info drawer (string or translation key). */
  title: string | null;
  /** The selected index tab. */
  selectedIndex: number;
  /** Emitted when the currently active tab changes. */
  currentTab: EventEmitter<number>;
  contentBlocks: QueryList<InfoDrawerTabComponent>;
  showTabLayout(): boolean;
  onTabChange(event: MatTabChangeEvent): void;
}
