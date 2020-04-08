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
  ComponentFactoryResolver,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { CardViewItem } from '../../interfaces/card-view-item.interface';
import { CardItemTypeService } from '../../services/card-item-types.service';
export declare class CardViewItemDispatcherComponent implements OnChanges {
  private cardItemTypeService;
  private resolver;
  property: CardViewItem;
  editable: boolean;
  displayEmpty: boolean;
  displayNoneOption: boolean;
  displayClearAction: boolean;
  private content;
  private loaded;
  private componentReference;
  ngOnInit: any;
  ngDoCheck: any;
  constructor(
    cardItemTypeService: CardItemTypeService,
    resolver: ComponentFactoryResolver
  );
  ngOnChanges(changes: SimpleChanges): void;
  private loadComponent;
  private proxy;
}
