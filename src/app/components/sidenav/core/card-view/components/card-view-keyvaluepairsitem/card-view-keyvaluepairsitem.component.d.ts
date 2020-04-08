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
import { CardViewUpdateService } from '../../services/card-view-update.service';
import { CardViewKeyValuePairsItemModel } from '../../models/card-view.models';
import { CardViewKeyValuePairsItemType } from '../../interfaces/card-view.interfaces';
import { MatTableDataSource } from '@angular/material';
export declare class CardViewKeyValuePairsItemComponent implements OnChanges {
  private cardViewUpdateService;
  property: CardViewKeyValuePairsItemModel;
  editable: boolean;
  values: CardViewKeyValuePairsItemType[];
  matTableValues: MatTableDataSource<CardViewKeyValuePairsItemType>;
  constructor(cardViewUpdateService: CardViewUpdateService);
  ngOnChanges(): void;
  isEditable(): boolean;
  add(): void;
  remove(index: number): void;
  onBlur(value: any): void;
  save(remove?: boolean): void;
}
