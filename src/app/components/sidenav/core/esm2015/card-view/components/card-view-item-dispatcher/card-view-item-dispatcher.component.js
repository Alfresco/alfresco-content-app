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
  ComponentFactoryResolver,
  Input,
  ViewChild
} from '@angular/core';
import { CardItemTypeService } from '../../services/card-item-types.service';
import { CardViewContentProxyDirective } from '../../directives/card-view-content-proxy.directive';
export class CardViewItemDispatcherComponent {
  /**
   * @param {?} cardItemTypeService
   * @param {?} resolver
   */
  constructor(cardItemTypeService, resolver) {
    this.cardItemTypeService = cardItemTypeService;
    this.resolver = resolver;
    this.displayEmpty = true;
    this.displayNoneOption = true;
    this.displayClearAction = true;
    this.loaded = false;
    this.componentReference = null;
    /** @type {?} */
    const dynamicLifeCycleMethods = [
      'ngOnInit',
      'ngDoCheck',
      'ngAfterContentInit',
      'ngAfterContentChecked',
      'ngAfterViewInit',
      'ngAfterViewChecked',
      'ngOnDestroy'
    ];
    dynamicLifeCycleMethods.forEach(
      /**
       * @param {?} method
       * @return {?}
       */
      method => {
        this[method] = this.proxy.bind(this, method);
      }
    );
  }
  /**
   * @param {?} changes
   * @return {?}
   */
  ngOnChanges(changes) {
    if (!this.loaded) {
      this.loadComponent();
      this.loaded = true;
    }
    Object.keys(changes)
      .map(
        /**
         * @param {?} changeName
         * @return {?}
         */
        changeName => [changeName, changes[changeName]]
      )
      .forEach(
        /**
         * @param {?} __0
         * @return {?}
         */
        ([inputParamName, simpleChange]) => {
          this.componentReference.instance[inputParamName] =
            simpleChange.currentValue;
        }
      );
    this.proxy('ngOnChanges', changes);
  }
  /**
   * @private
   * @return {?}
   */
  loadComponent() {
    /** @type {?} */
    const factoryClass = this.cardItemTypeService.resolveComponentType(
      this.property
    );
    /** @type {?} */
    const factory = this.resolver.resolveComponentFactory(factoryClass);
    this.componentReference = this.content.viewContainerRef.createComponent(
      factory
    );
    this.componentReference.instance.editable = this.editable;
    this.componentReference.instance.property = this.property;
    this.componentReference.instance.displayEmpty = this.displayEmpty;
    this.componentReference.instance.displayNoneOption = this.displayNoneOption;
    this.componentReference.instance.displayClearAction = this.displayClearAction;
  }
  /**
   * @private
   * @param {?} methodName
   * @param {...?} args
   * @return {?}
   */
  proxy(methodName, ...args) {
    if (this.componentReference.instance[methodName]) {
      this.componentReference.instance[methodName].apply(
        this.componentReference.instance,
        args
      );
    }
  }
}
CardViewItemDispatcherComponent.decorators = [
  {
    type: Component,
    args: [
      {
        selector: 'adf-card-view-item-dispatcher',
        template: '<ng-template adf-card-view-content-proxy></ng-template>'
      }
    ]
  }
];
/** @nocollapse */
CardViewItemDispatcherComponent.ctorParameters = () => [
  { type: CardItemTypeService },
  { type: ComponentFactoryResolver }
];
CardViewItemDispatcherComponent.propDecorators = {
  property: [{ type: Input }],
  editable: [{ type: Input }],
  displayEmpty: [{ type: Input }],
  displayNoneOption: [{ type: Input }],
  displayClearAction: [{ type: Input }],
  content: [{ type: ViewChild, args: [CardViewContentProxyDirective] }]
};
if (false) {
  /** @type {?} */
  CardViewItemDispatcherComponent.prototype.property;
  /** @type {?} */
  CardViewItemDispatcherComponent.prototype.editable;
  /** @type {?} */
  CardViewItemDispatcherComponent.prototype.displayEmpty;
  /** @type {?} */
  CardViewItemDispatcherComponent.prototype.displayNoneOption;
  /** @type {?} */
  CardViewItemDispatcherComponent.prototype.displayClearAction;
  /**
   * @type {?}
   * @private
   */
  CardViewItemDispatcherComponent.prototype.content;
  /**
   * @type {?}
   * @private
   */
  CardViewItemDispatcherComponent.prototype.loaded;
  /**
   * @type {?}
   * @private
   */
  CardViewItemDispatcherComponent.prototype.componentReference;
  /** @type {?} */
  CardViewItemDispatcherComponent.prototype.ngOnInit;
  /** @type {?} */
  CardViewItemDispatcherComponent.prototype.ngDoCheck;
  /**
   * @type {?}
   * @private
   */
  CardViewItemDispatcherComponent.prototype.cardItemTypeService;
  /**
   * @type {?}
   * @private
   */
  CardViewItemDispatcherComponent.prototype.resolver;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FyZC12aWV3LWl0ZW0tZGlzcGF0Y2hlci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWxmcmVzY28vYWRmLWNvcmUvIiwic291cmNlcyI6WyJjYXJkLXZpZXcvY29tcG9uZW50cy9jYXJkLXZpZXctaXRlbS1kaXNwYXRjaGVyL2NhcmQtdmlldy1pdGVtLWRpc3BhdGNoZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLE9BQU8sRUFDSCxTQUFTLEVBQ1Qsd0JBQXdCLEVBQ3hCLEtBQUssRUFJTCxTQUFTLEVBQ1osTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sd0NBQXdDLENBQUM7QUFDN0UsT0FBTyxFQUFFLDZCQUE2QixFQUFFLE1BQU0sb0RBQW9ELENBQUM7QUFNbkcsTUFBTSxPQUFPLCtCQUErQjs7Ozs7SUF5QnhDLFlBQW9CLG1CQUF3QyxFQUN4QyxRQUFrQztRQURsQyx3QkFBbUIsR0FBbkIsbUJBQW1CLENBQXFCO1FBQ3hDLGFBQVEsR0FBUixRQUFRLENBQTBCO1FBbEJ0RCxpQkFBWSxHQUFZLElBQUksQ0FBQztRQUc3QixzQkFBaUIsR0FBWSxJQUFJLENBQUM7UUFHbEMsdUJBQWtCLEdBQVksSUFBSSxDQUFDO1FBSzNCLFdBQU0sR0FBWSxLQUFLLENBQUM7UUFDeEIsdUJBQWtCLEdBQVEsSUFBSSxDQUFDOztjQU83Qix1QkFBdUIsR0FBRztZQUM1QixVQUFVO1lBQ1YsV0FBVztZQUNYLG9CQUFvQjtZQUNwQix1QkFBdUI7WUFDdkIsaUJBQWlCO1lBQ2pCLG9CQUFvQjtZQUNwQixhQUFhO1NBQ2hCO1FBRUQsdUJBQXVCLENBQUMsT0FBTzs7OztRQUFDLENBQUMsTUFBTSxFQUFFLEVBQUU7WUFDdkMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNqRCxDQUFDLEVBQUMsQ0FBQztJQUNQLENBQUM7Ozs7O0lBRUQsV0FBVyxDQUFDLE9BQXNCO1FBQzlCLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ2QsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQ3JCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1NBQ3RCO1FBRUQsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7YUFDZixHQUFHOzs7O1FBQUMsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFDO2FBQ3RELE9BQU87Ozs7UUFBQyxDQUFDLENBQUMsY0FBYyxFQUFFLFlBQVksQ0FBeUIsRUFBRSxFQUFFO1lBQ2hFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLEdBQUcsWUFBWSxDQUFDLFlBQVksQ0FBQztRQUNqRixDQUFDLEVBQUMsQ0FBQztRQUVQLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7Ozs7O0lBRU8sYUFBYTs7Y0FDWCxZQUFZLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7O2NBRTNFLE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLHVCQUF1QixDQUFDLFlBQVksQ0FBQztRQUNuRSxJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFakYsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUMxRCxJQUFJLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQzFELElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUM7UUFDbEUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUM7UUFDNUUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUM7SUFDbEYsQ0FBQzs7Ozs7OztJQUVPLEtBQUssQ0FBQyxVQUFVLEVBQUUsR0FBRyxJQUFJO1FBQzdCLElBQUksSUFBSSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsRUFBRTtZQUM5QyxJQUFJLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQzlGO0lBQ0wsQ0FBQzs7O1lBOUVKLFNBQVMsU0FBQztnQkFDUCxRQUFRLEVBQUUsK0JBQStCO2dCQUN6QyxRQUFRLEVBQUUseURBQXlEO2FBQ3RFOzs7O1lBTlEsbUJBQW1CO1lBUnhCLHdCQUF3Qjs7O3VCQWdCdkIsS0FBSzt1QkFHTCxLQUFLOzJCQUdMLEtBQUs7Z0NBR0wsS0FBSztpQ0FHTCxLQUFLO3NCQUdMLFNBQVMsU0FBQyw2QkFBNkI7Ozs7SUFmeEMsbURBQ3VCOztJQUV2QixtREFDa0I7O0lBRWxCLHVEQUM2Qjs7SUFFN0IsNERBQ2tDOztJQUVsQyw2REFDbUM7Ozs7O0lBRW5DLGtEQUMrQzs7Ozs7SUFFL0MsaURBQWdDOzs7OztJQUNoQyw2REFBdUM7O0lBRXZDLG1EQUFnQjs7SUFDaEIsb0RBQWlCOzs7OztJQUVMLDhEQUFnRDs7Ozs7SUFDaEQsbURBQTBDIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgQWxmcmVzY28gU29mdHdhcmUsIEx0ZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHtcbiAgICBDb21wb25lbnQsXG4gICAgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxuICAgIElucHV0LFxuICAgIE9uQ2hhbmdlcyxcbiAgICBTaW1wbGVDaGFuZ2UsXG4gICAgU2ltcGxlQ2hhbmdlcyxcbiAgICBWaWV3Q2hpbGRcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDYXJkVmlld0l0ZW0gfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL2NhcmQtdmlldy1pdGVtLmludGVyZmFjZSc7XG5pbXBvcnQgeyBDYXJkSXRlbVR5cGVTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvY2FyZC1pdGVtLXR5cGVzLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2FyZFZpZXdDb250ZW50UHJveHlEaXJlY3RpdmUgfSBmcm9tICcuLi8uLi9kaXJlY3RpdmVzL2NhcmQtdmlldy1jb250ZW50LXByb3h5LmRpcmVjdGl2ZSc7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnYWRmLWNhcmQtdmlldy1pdGVtLWRpc3BhdGNoZXInLFxuICAgIHRlbXBsYXRlOiAnPG5nLXRlbXBsYXRlIGFkZi1jYXJkLXZpZXctY29udGVudC1wcm94eT48L25nLXRlbXBsYXRlPidcbn0pXG5leHBvcnQgY2xhc3MgQ2FyZFZpZXdJdGVtRGlzcGF0Y2hlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uQ2hhbmdlcyB7XG4gICAgQElucHV0KClcbiAgICBwcm9wZXJ0eTogQ2FyZFZpZXdJdGVtO1xuXG4gICAgQElucHV0KClcbiAgICBlZGl0YWJsZTogYm9vbGVhbjtcblxuICAgIEBJbnB1dCgpXG4gICAgZGlzcGxheUVtcHR5OiBib29sZWFuID0gdHJ1ZTtcblxuICAgIEBJbnB1dCgpXG4gICAgZGlzcGxheU5vbmVPcHRpb246IGJvb2xlYW4gPSB0cnVlO1xuXG4gICAgQElucHV0KClcbiAgICBkaXNwbGF5Q2xlYXJBY3Rpb246IGJvb2xlYW4gPSB0cnVlO1xuXG4gICAgQFZpZXdDaGlsZChDYXJkVmlld0NvbnRlbnRQcm94eURpcmVjdGl2ZSlcbiAgICBwcml2YXRlIGNvbnRlbnQ6IENhcmRWaWV3Q29udGVudFByb3h5RGlyZWN0aXZlO1xuXG4gICAgcHJpdmF0ZSBsb2FkZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwcml2YXRlIGNvbXBvbmVudFJlZmVyZW5jZTogYW55ID0gbnVsbDtcblxuICAgIHB1YmxpYyBuZ09uSW5pdDtcbiAgICBwdWJsaWMgbmdEb0NoZWNrO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBjYXJkSXRlbVR5cGVTZXJ2aWNlOiBDYXJkSXRlbVR5cGVTZXJ2aWNlLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgcmVzb2x2ZXI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcikge1xuICAgICAgICBjb25zdCBkeW5hbWljTGlmZUN5Y2xlTWV0aG9kcyA9IFtcbiAgICAgICAgICAgICduZ09uSW5pdCcsXG4gICAgICAgICAgICAnbmdEb0NoZWNrJyxcbiAgICAgICAgICAgICduZ0FmdGVyQ29udGVudEluaXQnLFxuICAgICAgICAgICAgJ25nQWZ0ZXJDb250ZW50Q2hlY2tlZCcsXG4gICAgICAgICAgICAnbmdBZnRlclZpZXdJbml0JyxcbiAgICAgICAgICAgICduZ0FmdGVyVmlld0NoZWNrZWQnLFxuICAgICAgICAgICAgJ25nT25EZXN0cm95J1xuICAgICAgICBdO1xuXG4gICAgICAgIGR5bmFtaWNMaWZlQ3ljbGVNZXRob2RzLmZvckVhY2goKG1ldGhvZCkgPT4ge1xuICAgICAgICAgICAgdGhpc1ttZXRob2RdID0gdGhpcy5wcm94eS5iaW5kKHRoaXMsIG1ldGhvZCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICAgICAgaWYgKCF0aGlzLmxvYWRlZCkge1xuICAgICAgICAgICAgdGhpcy5sb2FkQ29tcG9uZW50KCk7XG4gICAgICAgICAgICB0aGlzLmxvYWRlZCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBPYmplY3Qua2V5cyhjaGFuZ2VzKVxuICAgICAgICAgICAgLm1hcCgoY2hhbmdlTmFtZSkgPT4gW2NoYW5nZU5hbWUsIGNoYW5nZXNbY2hhbmdlTmFtZV1dKVxuICAgICAgICAgICAgLmZvckVhY2goKFtpbnB1dFBhcmFtTmFtZSwgc2ltcGxlQ2hhbmdlXTogW3N0cmluZywgU2ltcGxlQ2hhbmdlXSkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuY29tcG9uZW50UmVmZXJlbmNlLmluc3RhbmNlW2lucHV0UGFyYW1OYW1lXSA9IHNpbXBsZUNoYW5nZS5jdXJyZW50VmFsdWU7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnByb3h5KCduZ09uQ2hhbmdlcycsIGNoYW5nZXMpO1xuICAgIH1cblxuICAgIHByaXZhdGUgbG9hZENvbXBvbmVudCgpIHtcbiAgICAgICAgY29uc3QgZmFjdG9yeUNsYXNzID0gdGhpcy5jYXJkSXRlbVR5cGVTZXJ2aWNlLnJlc29sdmVDb21wb25lbnRUeXBlKHRoaXMucHJvcGVydHkpO1xuXG4gICAgICAgIGNvbnN0IGZhY3RvcnkgPSB0aGlzLnJlc29sdmVyLnJlc29sdmVDb21wb25lbnRGYWN0b3J5KGZhY3RvcnlDbGFzcyk7XG4gICAgICAgIHRoaXMuY29tcG9uZW50UmVmZXJlbmNlID0gdGhpcy5jb250ZW50LnZpZXdDb250YWluZXJSZWYuY3JlYXRlQ29tcG9uZW50KGZhY3RvcnkpO1xuXG4gICAgICAgIHRoaXMuY29tcG9uZW50UmVmZXJlbmNlLmluc3RhbmNlLmVkaXRhYmxlID0gdGhpcy5lZGl0YWJsZTtcbiAgICAgICAgdGhpcy5jb21wb25lbnRSZWZlcmVuY2UuaW5zdGFuY2UucHJvcGVydHkgPSB0aGlzLnByb3BlcnR5O1xuICAgICAgICB0aGlzLmNvbXBvbmVudFJlZmVyZW5jZS5pbnN0YW5jZS5kaXNwbGF5RW1wdHkgPSB0aGlzLmRpc3BsYXlFbXB0eTtcbiAgICAgICAgdGhpcy5jb21wb25lbnRSZWZlcmVuY2UuaW5zdGFuY2UuZGlzcGxheU5vbmVPcHRpb24gPSB0aGlzLmRpc3BsYXlOb25lT3B0aW9uO1xuICAgICAgICB0aGlzLmNvbXBvbmVudFJlZmVyZW5jZS5pbnN0YW5jZS5kaXNwbGF5Q2xlYXJBY3Rpb24gPSB0aGlzLmRpc3BsYXlDbGVhckFjdGlvbjtcbiAgICB9XG5cbiAgICBwcml2YXRlIHByb3h5KG1ldGhvZE5hbWUsIC4uLmFyZ3MpIHtcbiAgICAgICAgaWYgKHRoaXMuY29tcG9uZW50UmVmZXJlbmNlLmluc3RhbmNlW21ldGhvZE5hbWVdKSB7XG4gICAgICAgICAgICB0aGlzLmNvbXBvbmVudFJlZmVyZW5jZS5pbnN0YW5jZVttZXRob2ROYW1lXS5hcHBseSh0aGlzLmNvbXBvbmVudFJlZmVyZW5jZS5pbnN0YW5jZSwgYXJncyk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=
