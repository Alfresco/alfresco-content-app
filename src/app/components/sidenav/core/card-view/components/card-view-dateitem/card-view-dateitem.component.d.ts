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
import { OnInit, OnDestroy } from '@angular/core';
import { DateAdapter } from '@angular/material';
import { MatDatetimepicker } from '@mat-datetimepicker/core';
import { Moment } from 'moment';
import { CardViewDateItemModel } from '../../models/card-view-dateitem.model';
import { CardViewUpdateService } from '../../services/card-view-update.service';
import { UserPreferencesService } from '../../../services/user-preferences.service';
import { AppConfigService } from '../../../app-config/app-config.service';
export declare class CardViewDateItemComponent implements OnInit, OnDestroy {
  private cardViewUpdateService;
  private dateAdapter;
  private userPreferencesService;
  private appConfig;
  property: CardViewDateItemModel;
  editable: boolean;
  displayEmpty: boolean;
  displayClearAction: boolean;
  datepicker: MatDatetimepicker<any>;
  valueDate: Moment;
  dateFormat: string;
  private onDestroy$;
  constructor(
    cardViewUpdateService: CardViewUpdateService,
    dateAdapter: DateAdapter<Moment>,
    userPreferencesService: UserPreferencesService,
    appConfig: AppConfigService
  );
  ngOnInit(): void;
  ngOnDestroy(): void;
  showProperty(): boolean;
  showClearAction(): boolean;
  isEditable(): boolean;
  showDatePicker(): void;
  onDateChanged(newDateValue: any): void;
  onDateClear(): void;
}
