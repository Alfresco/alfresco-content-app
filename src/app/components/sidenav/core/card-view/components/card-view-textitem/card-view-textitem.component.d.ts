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
import { OnChanges } from '@angular/core';
import { CardViewTextItemModel } from '../../models/card-view-textitem.model';
import { CardViewUpdateService } from '../../services/card-view-update.service';
import { AppConfigService } from '../../../app-config/app-config.service';
export declare class CardViewTextItemComponent implements OnChanges {
  private cardViewUpdateService;
  private appConfig;
  static DEFAULT_SEPARATOR: string;
  property: CardViewTextItemModel;
  editable: boolean;
  displayEmpty: boolean;
  private editorInput;
  inEdit: boolean;
  editedValue: string;
  errorMessages: string[];
  valueSeparator: string;
  constructor(
    cardViewUpdateService: CardViewUpdateService,
    appConfig: AppConfigService
  );
  ngOnChanges(): void;
  showProperty(): boolean;
  showClickableIcon(): boolean;
  isEditable(): boolean;
  isClickable(): boolean;
  hasIcon(): boolean;
  hasErrors(): boolean;
  setEditMode(editStatus: boolean): void;
  reset(event: MouseEvent | KeyboardEvent): void;
  private resetErrorMessages;
  update(event: MouseEvent | KeyboardEvent): void;
  prepareValueForUpload(
    property: CardViewTextItemModel,
    value: string
  ): string | string[];
  onTextAreaInputChange(): void;
  clicked(): void;
}
