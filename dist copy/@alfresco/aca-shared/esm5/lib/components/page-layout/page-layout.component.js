/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2020 Alfresco Software Limited
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail.  Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */
import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';
var PageLayoutComponent = /** @class */ (function() {
  function PageLayoutComponent() {
    this.hasError = false;
  }
  PageLayoutComponent.decorators = [
    {
      type: Component,
      args: [
        {
          selector: 'aca-page-layout',
          template:
            '<ng-content select="aca-page-layout-header"></ng-content>\n<ng-content select="aca-page-layout-error" *ngIf="hasError"></ng-content>\n<ng-content select="aca-page-layout-content" *ngIf="!hasError"></ng-content>\n',
          encapsulation: ViewEncapsulation.None,
          host: { class: 'aca-page-layout' },
          changeDetection: ChangeDetectionStrategy.OnPush,
          styles: [
            '.aca-page-layout{display:flex;flex-direction:column;flex:1;height:100%;overflow:hidden;min-height:0}.aca-page-layout .aca-page-layout-header{display:flex;align-items:center;flex:0 0 65px;flex-basis:48px;background:#fafafa;border-bottom:1px solid var(--theme-border-color,rgba(0,0,0,.07));padding:0 24px}.aca-page-layout .aca-page-layout-content,.aca-page-layout .aca-page-layout-error{display:flex;flex-direction:row;flex:1;height:100%;overflow:hidden}.aca-page-layout .main-content{display:flex;flex-direction:column;flex:1;height:100%;overflow:hidden;min-height:0}.aca-page-layout .scrollable,.aca-page-layout .scrollable .main-content{overflow:auto!important}.aca-page-layout .sidebar{display:block;height:100%;overflow-y:scroll;max-width:350px;width:350px}[dir=rtl] .aca-page-layout .main-content{border-left:1px solid var(--theme-border-color,rgba(0,0,0,.07))}[dir=ltr] .aca-page-layout .main-content{border-right:1px solid var(--theme-border-color,rgba(0,0,0,.07))}'
          ]
        }
      ]
    }
  ];
  PageLayoutComponent.propDecorators = {
    hasError: [{ type: Input }]
  };
  return PageLayoutComponent;
})();
export { PageLayoutComponent };
if (false) {
  /** @type {?} */
  PageLayoutComponent.prototype.hasError;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnZS1sYXlvdXQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGFsZnJlc2NvL2FjYS1zaGFyZWQvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9wYWdlLWxheW91dC9wYWdlLWxheW91dC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQSxPQUFPLEVBQ0wsU0FBUyxFQUNULGlCQUFpQixFQUNqQix1QkFBdUIsRUFDdkIsS0FBSyxFQUNOLE1BQU0sZUFBZSxDQUFDO0FBRXZCO0lBQUE7UUFVRSxhQUFRLEdBQUcsS0FBSyxDQUFDO0lBQ25CLENBQUM7O2dCQVhBLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsaUJBQWlCO29CQUMzQiwwT0FBeUM7b0JBRXpDLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO29CQUNyQyxJQUFJLEVBQUUsRUFBRSxLQUFLLEVBQUUsaUJBQWlCLEVBQUU7b0JBQ2xDLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNOztpQkFDaEQ7OzsyQkFFRSxLQUFLOztJQUVSLDBCQUFDO0NBQUEsQUFYRCxJQVdDO1NBSFksbUJBQW1COzs7SUFDOUIsdUNBQ2lCIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBAbGljZW5zZVxuICogQWxmcmVzY28gRXhhbXBsZSBDb250ZW50IEFwcGxpY2F0aW9uXG4gKlxuICogQ29weXJpZ2h0IChDKSAyMDA1IC0gMjAyMCBBbGZyZXNjbyBTb2Z0d2FyZSBMaW1pdGVkXG4gKlxuICogVGhpcyBmaWxlIGlzIHBhcnQgb2YgdGhlIEFsZnJlc2NvIEV4YW1wbGUgQ29udGVudCBBcHBsaWNhdGlvbi5cbiAqIElmIHRoZSBzb2Z0d2FyZSB3YXMgcHVyY2hhc2VkIHVuZGVyIGEgcGFpZCBBbGZyZXNjbyBsaWNlbnNlLCB0aGUgdGVybXMgb2ZcbiAqIHRoZSBwYWlkIGxpY2Vuc2UgYWdyZWVtZW50IHdpbGwgcHJldmFpbC4gIE90aGVyd2lzZSwgdGhlIHNvZnR3YXJlIGlzXG4gKiBwcm92aWRlZCB1bmRlciB0aGUgZm9sbG93aW5nIG9wZW4gc291cmNlIGxpY2Vuc2UgdGVybXM6XG4gKlxuICogVGhlIEFsZnJlc2NvIEV4YW1wbGUgQ29udGVudCBBcHBsaWNhdGlvbiBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gKiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbiAqIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4gKiAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuICpcbiAqIFRoZSBBbGZyZXNjbyBFeGFtcGxlIENvbnRlbnQgQXBwbGljYXRpb24gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAqIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gKiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4gKiBHTlUgTGVzc2VyIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgTGVzc2VyIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggQWxmcmVzY28uIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqL1xuXG5pbXBvcnQge1xuICBDb21wb25lbnQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgSW5wdXRcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FjYS1wYWdlLWxheW91dCcsXG4gIHRlbXBsYXRlVXJsOiAncGFnZS1sYXlvdXQuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9wYWdlLWxheW91dC5jb21wb25lbnQuc2NzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBob3N0OiB7IGNsYXNzOiAnYWNhLXBhZ2UtbGF5b3V0JyB9LFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxufSlcbmV4cG9ydCBjbGFzcyBQYWdlTGF5b3V0Q29tcG9uZW50IHtcbiAgQElucHV0KClcbiAgaGFzRXJyb3IgPSBmYWxzZTtcbn1cbiJdfQ==
