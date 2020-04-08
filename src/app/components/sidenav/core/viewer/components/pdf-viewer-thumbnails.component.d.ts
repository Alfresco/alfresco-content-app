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
import { OnInit, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
export declare class PdfThumbListComponent
  implements OnInit, AfterViewInit, OnDestroy {
  private element;
  pdfViewer: any;
  virtualHeight: number;
  translateY: number;
  renderItems: any[];
  width: number;
  currentHeight: number;
  private items;
  private margin;
  private itemHeight;
  template: any;
  onResize(): void;
  constructor(element: ElementRef);
  ngOnInit(): void;
  ngAfterViewInit(): void;
  ngOnDestroy(): void;
  trackByFn(_: number, item: any): number;
  isSelected(pageNum: number): boolean;
  goTo(pageNum: number): void;
  scrollInto(item: any): void;
  getPages(): any;
  private setHeight;
  private calculateHeight;
  private calculateItems;
  private getContainerSetup;
  private onPageChange;
}
