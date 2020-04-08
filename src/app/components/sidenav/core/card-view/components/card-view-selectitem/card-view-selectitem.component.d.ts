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
import { CardViewSelectItemModel } from '../../models/card-view-selectitem.model';
import { CardViewUpdateService } from '../../services/card-view-update.service';
import { Observable } from 'rxjs';
import { CardViewSelectItemOption } from '../../interfaces/card-view.interfaces';
import { MatSelectChange } from '@angular/material';
export declare class CardViewSelectItemComponent implements OnChanges {
  private cardViewUpdateService;
  property: CardViewSelectItemModel<string>;
  editable: boolean;
  options$: Observable<CardViewSelectItemOption<string>[]>;
  displayNoneOption: boolean;
  value: string;
  constructor(cardViewUpdateService: CardViewUpdateService);
  ngOnChanges(): void;
  isEditable(): boolean;
  getOptions(): Observable<CardViewSelectItemOption<string>[]>;
  onChange(event: MatSelectChange): void;
  showNoneOption(): boolean;
}
