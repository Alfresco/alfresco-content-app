/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
  ContentChild,
  TemplateRef,
  HostListener,
  ElementRef,
  ViewEncapsulation
} from '@angular/core';
export class PdfThumbListComponent {
  /**
   * @param {?} element
   */
  constructor(element) {
    this.element = element;
    this.virtualHeight = 0;
    this.translateY = 0;
    this.renderItems = [];
    this.width = 91;
    this.currentHeight = 0;
    this.items = [];
    this.margin = 15;
    this.itemHeight = 114 + this.margin;
    this.calculateItems = this.calculateItems.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
  }
  /**
   * @return {?}
   */
  onResize() {
    this.calculateItems();
  }
  /**
   * @return {?}
   */
  ngOnInit() {
    /* cspell:disable-next-line */
    this.pdfViewer.eventBus.on('pagechange', this.onPageChange);
    this.element.nativeElement.addEventListener(
      'scroll',
      this.calculateItems,
      true
    );
    this.setHeight(this.pdfViewer.currentPageNumber);
    this.items = this.getPages();
    this.calculateItems();
  }
  /**
   * @return {?}
   */
  ngAfterViewInit() {
    setTimeout(
      /**
       * @return {?}
       */
      () => this.scrollInto(this.pdfViewer.currentPageNumber),
      0
    );
  }
  /**
   * @return {?}
   */
  ngOnDestroy() {
    this.element.nativeElement.removeEventListener(
      'scroll',
      this.calculateItems,
      true
    );
    /* cspell:disable-next-line */
    this.pdfViewer.eventBus.off('pagechange', this.onPageChange);
  }
  /**
   * @param {?} _
   * @param {?} item
   * @return {?}
   */
  trackByFn(_, item) {
    return item.id;
  }
  /**
   * @param {?} pageNum
   * @return {?}
   */
  isSelected(pageNum) {
    return this.pdfViewer.currentPageNumber === pageNum;
  }
  /**
   * @param {?} pageNum
   * @return {?}
   */
  goTo(pageNum) {
    this.pdfViewer.currentPageNumber = pageNum;
  }
  /**
   * @param {?} item
   * @return {?}
   */
  scrollInto(item) {
    if (this.items.length) {
      /** @type {?} */
      const index = this.items.findIndex(
        /**
         * @param {?} element
         * @return {?}
         */
        (element => element.id === item)
      );
      if (index < 0 || index >= this.items.length) {
        return;
      }
      this.element.nativeElement.scrollTop = index * this.itemHeight;
      this.calculateItems();
    }
  }
  /**
   * @return {?}
   */
  getPages() {
    return this.pdfViewer._pages.map(
      /**
       * @param {?} page
       * @return {?}
       */
      page => ({
        id: page.id,
        /**
         * @return {?}
         */
        getWidth: () => {
          return this.width;
        },
        /**
         * @return {?}
         */
        getHeight: () => {
          return this.currentHeight;
        },
        /**
         * @return {?}
         */
        getPage: () => this.pdfViewer.pdfDocument.getPage(page.id)
      })
    );
  }
  /**
   * @private
   * @param {?} id
   * @return {?}
   */
  setHeight(id) {
    /** @type {?} */
    const height = this.pdfViewer.pdfDocument.getPage(id).then(
      /**
       * @param {?} page
       * @return {?}
       */
      (page => this.calculateHeight(page))
    );
    return height;
  }
  /**
   * @private
   * @param {?} page
   * @return {?}
   */
  calculateHeight(page) {
    /** @type {?} */
    const viewport = page.getViewport(1);
    /** @type {?} */
    const pageRatio = viewport.width / viewport.height;
    /** @type {?} */
    const height = Math.floor(this.width / pageRatio);
    this.currentHeight = height;
    this.itemHeight = height + this.margin;
  }
  /**
   * @private
   * @return {?}
   */
  calculateItems() {
    const { element, viewPort, itemsInView } = this.getContainerSetup();
    /** @type {?} */
    const indexByScrollTop =
      ((element.scrollTop / viewPort) * this.items.length) / itemsInView;
    /** @type {?} */
    const start = Math.floor(indexByScrollTop);
    /** @type {?} */
    const end = Math.ceil(indexByScrollTop) + (itemsInView);
    this.translateY = this.itemHeight * Math.ceil(start);
    this.virtualHeight = this.itemHeight * this.items.length - this.translateY;
    this.renderItems = this.items.slice(start, end);
  }
  /**
   * @private
   * @return {?}
   */
  getContainerSetup() {
    /** @type {?} */
    const element = this.element.nativeElement;
    /** @type {?} */
    const elementRec = element.getBoundingClientRect();
    /** @type {?} */
    const itemsInView = Math.ceil(elementRec.height / this.itemHeight);
    /** @type {?} */
    const viewPort = (this.itemHeight * this.items.length) / itemsInView;
    return {
      element,
      viewPort,
      itemsInView
    };
  }
  /**
   * @private
   * @param {?} event
   * @return {?}
   */
  onPageChange(event) {
    /** @type {?} */
    const index = this.renderItems.findIndex(
      /**
       * @param {?} element
       * @return {?}
       */
      (element => element.id === event.pageNumber)
    );
    if (index < 0) {
      this.scrollInto(event.pageNumber);
    }
    if (index >= this.renderItems.length - 1) {
      this.element.nativeElement.scrollTop += this.itemHeight;
    }
  }
}
PdfThumbListComponent.decorators = [
  {
    type: Component,
    args: [
      {
        selector: 'adf-pdf-thumbnails',
        template:
          '<div class="adf-pdf-thumbnails__content"\n    data-automation-id=\'adf-thumbnails-content\'\n    [style.height.px]="virtualHeight"\n    [style.transform]="\'translate(-50%, \' + translateY + \'px)\'">\n    <adf-pdf-thumb *ngFor="let page of renderItems; trackBy: trackByFn"\n        class="adf-pdf-thumbnails__thumb"\n        [ngClass]="{\'adf-pdf-thumbnails__thumb--selected\' : isSelected(page.id)}"\n        [page]="page"\n        (click)="goTo(page.id)">\n    </adf-pdf-thumb>\n</div>\n',
        host: { class: 'adf-pdf-thumbnails' },
        encapsulation: ViewEncapsulation.None,
        styles: ['']
      }
    ]
  }
];
/** @nocollapse */
PdfThumbListComponent.ctorParameters = () => [{ type: ElementRef }];
PdfThumbListComponent.propDecorators = {
  pdfViewer: [{ type: Input }],
  template: [{ type: ContentChild, args: [TemplateRef] }],
  onResize: [{ type: HostListener, args: ['window:resize'] }]
};
if (false) {
  /** @type {?} */
  PdfThumbListComponent.prototype.pdfViewer;
  /** @type {?} */
  PdfThumbListComponent.prototype.virtualHeight;
  /** @type {?} */
  PdfThumbListComponent.prototype.translateY;
  /** @type {?} */
  PdfThumbListComponent.prototype.renderItems;
  /** @type {?} */
  PdfThumbListComponent.prototype.width;
  /** @type {?} */
  PdfThumbListComponent.prototype.currentHeight;
  /**
   * @type {?}
   * @private
   */
  PdfThumbListComponent.prototype.items;
  /**
   * @type {?}
   * @private
   */
  PdfThumbListComponent.prototype.margin;
  /**
   * @type {?}
   * @private
   */
  PdfThumbListComponent.prototype.itemHeight;
  /** @type {?} */
  PdfThumbListComponent.prototype.template;
  /**
   * @type {?}
   * @private
   */
  PdfThumbListComponent.prototype.element;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGRmLXZpZXdlci10aHVtYm5haWxzLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hZGYtY29yZS8iLCJzb3VyY2VzIjpbInZpZXdlci9jb21wb25lbnRzL3BkZi12aWV3ZXItdGh1bWJuYWlscy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsT0FBTyxFQUNILFNBQVMsRUFBRSxLQUFLLEVBQUUsWUFBWSxFQUFFLFdBQVcsRUFBRSxZQUFZLEVBQzFDLFVBQVUsRUFBYSxpQkFBaUIsRUFDMUQsTUFBTSxlQUFlLENBQUM7QUFTdkIsTUFBTSxPQUFPLHFCQUFxQjs7OztJQXFCOUIsWUFBb0IsT0FBbUI7UUFBbkIsWUFBTyxHQUFQLE9BQU8sQ0FBWTtRQWxCdkMsa0JBQWEsR0FBVyxDQUFDLENBQUM7UUFDMUIsZUFBVSxHQUFXLENBQUMsQ0FBQztRQUN2QixnQkFBVyxHQUFHLEVBQUUsQ0FBQztRQUNqQixVQUFLLEdBQVcsRUFBRSxDQUFDO1FBQ25CLGtCQUFhLEdBQVcsQ0FBQyxDQUFDO1FBRWxCLFVBQUssR0FBRyxFQUFFLENBQUM7UUFDWCxXQUFNLEdBQVcsRUFBRSxDQUFDO1FBQ3BCLGVBQVUsR0FBVyxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQVczQyxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3JELElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDckQsQ0FBQzs7OztJQVBELFFBQVE7UUFDSixJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDMUIsQ0FBQzs7OztJQU9ELFFBQVE7UUFDSiw4QkFBOEI7UUFDOUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLFlBQVksRUFB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Qjs7SUFFeEIsOENBQTBCOztJQUMxQiwyQ0FBdUI7O0lBQ3ZCLDRDQUFpQjs7SUFDakIsc0NBQW1COztJQUNuQiw4Q0FBMEI7Ozs7O0lBRTFCLHNDQUFtQjs7Ozs7SUFDbkIsdUNBQTRCOzs7OztJQUM1QiwyQ0FBK0M7O0lBRS9DLHlDQUNjOzs7OztJQU9GLHdDQUEyQiIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEFsZnJlc2NvIFNvZnR3YXJlLCBMdGQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7XG4gICAgQ29tcG9uZW50LCBJbnB1dCwgQ29udGVudENoaWxkLCBUZW1wbGF0ZVJlZiwgSG9zdExpc3RlbmVyLCBPbkluaXQsXG4gICAgQWZ0ZXJWaWV3SW5pdCwgRWxlbWVudFJlZiwgT25EZXN0cm95LCBWaWV3RW5jYXBzdWxhdGlvblxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdhZGYtcGRmLXRodW1ibmFpbHMnLFxuICAgIHRlbXBsYXRlVXJsOiAnLi9wZGYtdmlld2VyLXRodW1ibmFpbHMuY29tcG9uZW50Lmh0bWwnLFxuICAgIHN0eWxlVXJsczogWycuL3BkZi12aWV3ZXItdGh1bWJuYWlscy5jb21wb25lbnQuc2NzcyddLFxuICAgIGhvc3Q6IHsgJ2NsYXNzJzogJ2FkZi1wZGYtdGh1bWJuYWlscycgfSxcbiAgICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lXG59KVxuZXhwb3J0IGNsYXNzIFBkZlRodW1iTGlzdENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95IHtcbiAgICBASW5wdXQoKSBwZGZWaWV3ZXI6IGFueTtcblxuICAgIHZpcnR1YWxIZWlnaHQ6IG51bWJlciA9IDA7XG4gICAgdHJhbnNsYXRlWTogbnVtYmVyID0gMDtcbiAgICByZW5kZXJJdGVtcyA9IFtdO1xuICAgIHdpZHRoOiBudW1iZXIgPSA5MTtcbiAgICBjdXJyZW50SGVpZ2h0OiBudW1iZXIgPSAwO1xuXG4gICAgcHJpdmF0ZSBpdGVtcyA9IFtdO1xuICAgIHByaXZhdGUgbWFyZ2luOiBudW1iZXIgPSAxNTtcbiAgICBwcml2YXRlIGl0ZW1IZWlnaHQ6IG51bWJlciA9IDExNCArIHRoaXMubWFyZ2luO1xuXG4gICAgQENvbnRlbnRDaGlsZChUZW1wbGF0ZVJlZilcbiAgICB0ZW1wbGF0ZTogYW55O1xuXG4gICAgQEhvc3RMaXN0ZW5lcignd2luZG93OnJlc2l6ZScpXG4gICAgb25SZXNpemUoKSB7XG4gICAgICAgIHRoaXMuY2FsY3VsYXRlSXRlbXMoKTtcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVsZW1lbnQ6IEVsZW1lbnRSZWYpIHtcbiAgICAgICAgdGhpcy5jYWxjdWxhdGVJdGVtcyA9IHRoaXMuY2FsY3VsYXRlSXRlbXMuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5vblBhZ2VDaGFuZ2UgPSB0aGlzLm9uUGFnZUNoYW5nZS5iaW5kKHRoaXMpO1xuICAgIH1cblxuICAgIG5nT25Jbml0KCkge1xuICAgICAgICAvKiBjc3BlbGw6ZGlzYWJsZS1uZXh0LWxpbmUgKi9cbiAgICAgICAgdGhpcy5wZGZWaWV3ZXIuZXZlbnRCdXMub24oJ3BhZ2VjaGFuZ2UnLCB0aGlzLm9uUGFnZUNoYW5nZSk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHRoaXMuY2FsY3VsYXRlSXRlbXMsIHRydWUpO1xuXG4gICAgICAgIHRoaXMuc2V0SGVpZ2h0KHRoaXMucGRmVmlld2VyLmN1cnJlbnRQYWdlTnVtYmVyKTtcbiAgICAgICAgdGhpcy5pdGVtcyA9IHRoaXMuZ2V0UGFnZXMoKTtcbiAgICAgICAgdGhpcy5jYWxjdWxhdGVJdGVtcygpO1xuXG4gICAgfVxuXG4gICAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMuc2Nyb2xsSW50byh0aGlzLnBkZlZpZXdlci5jdXJyZW50UGFnZU51bWJlciksIDApO1xuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCkge1xuICAgICAgICB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdzY3JvbGwnLCB0aGlzLmNhbGN1bGF0ZUl0ZW1zLCB0cnVlKTtcbiAgICAgICAgLyogY3NwZWxsOmRpc2FibGUtbmV4dC1saW5lICovXG4gICAgICAgIHRoaXMucGRmVmlld2VyLmV2ZW50QnVzLm9mZigncGFnZWNoYW5nZScsIHRoaXMub25QYWdlQ2hhbmdlKTtcbiAgICB9XG5cbiAgICB0cmFja0J5Rm4oXzogbnVtYmVyLCBpdGVtOiBhbnkpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gaXRlbS5pZDtcbiAgICB9XG5cbiAgICBpc1NlbGVjdGVkKHBhZ2VOdW06IG51bWJlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5wZGZWaWV3ZXIuY3VycmVudFBhZ2VOdW1iZXIgPT09IHBhZ2VOdW07XG4gICAgfVxuXG4gICAgZ29UbyhwYWdlTnVtOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5wZGZWaWV3ZXIuY3VycmVudFBhZ2VOdW1iZXIgPSBwYWdlTnVtO1xuICAgIH1cblxuICAgIHNjcm9sbEludG8oaXRlbTogYW55KSB7XG4gICAgICAgIGlmICh0aGlzLml0ZW1zLmxlbmd0aCkge1xuICAgICAgICAgICAgY29uc3QgaW5kZXg6IG51bWJlciA9IHRoaXMuaXRlbXMuZmluZEluZGV4KChlbGVtZW50KSA9PiBlbGVtZW50LmlkID09PSBpdGVtKTtcblxuICAgICAgICAgICAgaWYgKGluZGV4IDwgMCB8fCBpbmRleCA+PSB0aGlzLml0ZW1zLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuc2Nyb2xsVG9wID0gaW5kZXggKiB0aGlzLml0ZW1IZWlnaHQ7XG5cbiAgICAgICAgICAgIHRoaXMuY2FsY3VsYXRlSXRlbXMoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldFBhZ2VzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wZGZWaWV3ZXIuX3BhZ2VzLm1hcCgocGFnZSkgPT4gKHtcbiAgICAgICAgICAgIGlkOiBwYWdlLmlkLFxuICAgICAgICAgICAgZ2V0V2lkdGg6ICgpID0+IHsgcmV0dXJuIHRoaXMud2lkdGg7IH0sXG4gICAgICAgICAgICBnZXRIZWlnaHQ6ICgpID0+IHsgcmV0dXJuIHRoaXMuY3VycmVudEhlaWdodDsgfSxcbiAgICAgICAgICAgIGdldFBhZ2U6ICgpID0+IHRoaXMucGRmVmlld2VyLnBkZkRvY3VtZW50LmdldFBhZ2UocGFnZS5pZClcbiAgICAgICAgfSkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2V0SGVpZ2h0KGlkKTogbnVtYmVyIHtcbiAgICAgICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5wZGZWaWV3ZXIucGRmRG9jdW1lbnQuZ2V0UGFnZShpZCkudGhlbigocGFnZSkgPT4gdGhpcy5jYWxjdWxhdGVIZWlnaHQocGFnZSkpO1xuICAgICAgICByZXR1cm4gaGVpZ2h0O1xuICAgIH1cblxuICAgIHByaXZhdGUgY2FsY3VsYXRlSGVpZ2h0KHBhZ2UpIHtcbiAgICAgICAgY29uc3Qgdmlld3BvcnQgPSBwYWdlLmdldFZpZXdwb3J0KDEpO1xuICAgICAgICBjb25zdCBwYWdlUmF0aW8gPSB2aWV3cG9ydC53aWR0aCAvIHZpZXdwb3J0LmhlaWdodDtcbiAgICAgICAgY29uc3QgaGVpZ2h0ID0gTWF0aC5mbG9vcih0aGlzLndpZHRoIC8gcGFnZVJhdGlvKTtcblxuICAgICAgICB0aGlzLmN1cnJlbnRIZWlnaHQgPSBoZWlnaHQ7XG4gICAgICAgIHRoaXMuaXRlbUhlaWdodCA9IGhlaWdodCArIHRoaXMubWFyZ2luO1xuICAgIH1cblxuICAgIHByaXZhdGUgY2FsY3VsYXRlSXRlbXMoKSB7XG4gICAgICAgIGNvbnN0IHsgZWxlbWVudCwgdmlld1BvcnQsIGl0ZW1zSW5WaWV3IH0gPSB0aGlzLmdldENvbnRhaW5lclNldHVwKCk7XG5cbiAgICAgICAgY29uc3QgaW5kZXhCeVNjcm9sbFRvcCA9IGVsZW1lbnQuc2Nyb2xsVG9wIC8gdmlld1BvcnQgKiB0aGlzLml0ZW1zLmxlbmd0aCAvIGl0ZW1zSW5WaWV3O1xuXG4gICAgICAgIGNvbnN0IHN0YXJ0ID0gTWF0aC5mbG9vcihpbmRleEJ5U2Nyb2xsVG9wKTtcblxuICAgICAgICBjb25zdCBlbmQgPSBNYXRoLmNlaWwoaW5kZXhCeVNjcm9sbFRvcCkgKyAoaXRlbXNJblZpZXcpO1xuXG4gICAgICAgIHRoaXMudHJhbnNsYXRlWSA9IHRoaXMuaXRlbUhlaWdodCAqIE1hdGguY2VpbChzdGFydCk7XG4gICAgICAgIHRoaXMudmlydHVhbEhlaWdodCA9IHRoaXMuaXRlbUhlaWdodCAqIHRoaXMuaXRlbXMubGVuZ3RoICAtIHRoaXMudHJhbnNsYXRlWTtcbiAgICAgICAgdGhpcy5yZW5kZXJJdGVtcyA9IHRoaXMuaXRlbXMuc2xpY2Uoc3RhcnQsIGVuZCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRDb250YWluZXJTZXR1cCgpIHtcbiAgICAgICAgY29uc3QgZWxlbWVudCA9IHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50O1xuICAgICAgICBjb25zdCBlbGVtZW50UmVjID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgY29uc3QgaXRlbXNJblZpZXcgPSBNYXRoLmNlaWwoZWxlbWVudFJlYy5oZWlnaHQgLyB0aGlzLml0ZW1IZWlnaHQpO1xuICAgICAgICBjb25zdCB2aWV3UG9ydCA9ICh0aGlzLml0ZW1IZWlnaHQgKiB0aGlzLml0ZW1zLmxlbmd0aCkgLyBpdGVtc0luVmlldztcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZWxlbWVudCxcbiAgICAgICAgICAgIHZpZXdQb3J0LFxuICAgICAgICAgICAgaXRlbXNJblZpZXdcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBwcml2YXRlIG9uUGFnZUNoYW5nZShldmVudCkge1xuICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMucmVuZGVySXRlbXMuZmluZEluZGV4KChlbGVtZW50KSA9PiBlbGVtZW50LmlkID09PSBldmVudC5wYWdlTnVtYmVyKTtcblxuICAgICAgICBpZiAoaW5kZXggPCAwKSB7XG4gICAgICAgICAgICB0aGlzLnNjcm9sbEludG8oZXZlbnQucGFnZU51bWJlcik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaW5kZXggPj0gdGhpcy5yZW5kZXJJdGVtcy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudC5zY3JvbGxUb3AgKz0gdGhpcy5pdGVtSGVpZ2h0O1xuICAgICAgICB9XG4gICAgfVxufVxuIl19
