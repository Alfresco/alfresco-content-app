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
import { Component, Input, ViewEncapsulation } from '@angular/core';
import {
  AppConfigService,
  AppConfigValues
} from '../../app-config/app-config.service';
export class AboutGithubLinkComponent {
  /**
   * @param {?} appConfig
   */
  constructor(appConfig) {
    this.appConfig = appConfig;
    /**
     * Commit corresponding to the version of ADF to be used.
     */
    this.url = 'https://github.com/Alfresco/alfresco-ng2-components/commits/';
    this.ecmHost = '';
    this.bpmHost = '';
  }
  /**
   * @return {?}
   */
  ngOnInit() {
    this.ecmHost = this.appConfig.get(AppConfigValues.ECMHOST);
    this.bpmHost = this.appConfig.get(AppConfigValues.BPMHOST);
    this.application = this.appConfig.get('application.name');
  }
}
AboutGithubLinkComponent.decorators = [
  {
    type: Component,
    args: [
      {
        selector: 'adf-about-github-link',
        template:
          '<div class="adf-github-link-container">\n    <h1 data-automation-id="adf-github-app-title">{{ application }}</h1>\n\n    <div>\n        <h3 data-automation-id="adf-github-source-code-title">{{ \'ABOUT.SOURCE_CODE.TITLE\' | translate }}</h3>\n        <mat-card>\n            <p *ngIf="version" data-automation-id="adf-github-version">{{ \'ABOUT.VERSION\' | translate }}: {{ version }}</p>\n\n            <div *ngIf="url">\n                <small>{{ \'ABOUT.SOURCE_CODE.DESCRIPTION\' | translate }}</small>\n                <div data-automation-id="adf-github-url">\n                    <a [href]="url" target="_blank">{{url}}</a>\n                </div>\n            </div>\n        </mat-card>\n    </div>\n\n    <h3 data-automation-id="adf-about-setting-title">{{ \'ABOUT.SERVER_SETTINGS.TITLE\' | translate }}</h3>\n    <small>{{ \'ABOUT.SERVER_SETTINGS.DESCRIPTION\' | translate }}</small>\n    <mat-card>\n        <p data-automation-id="adf-process-service-host">\n            {{ \'ABOUT.SERVER_SETTINGS.PROCESS_SERVICE_HOST\' | translate: {value: bpmHost} }}\n        </p>\n        <p data-automation-id="adf-content-service-host">\n            {{ \'ABOUT.SERVER_SETTINGS.CONTENT_SERVICE_HOST\' | translate: {value: ecmHost} }}\n        </p>\n    </mat-card>\n</div>\n',
        encapsulation: ViewEncapsulation.None
      }
    ]
  }
];
/** @nocollapse */
AboutGithubLinkComponent.ctorParameters = () => [{ type: AppConfigService }];
AboutGithubLinkComponent.propDecorators = {
  url: [{ type: Input }],
  version: [{ type: Input }]
};
if (false) {
  /**
   * Commit corresponding to the version of ADF to be used.
   * @type {?}
   */
  AboutGithubLinkComponent.prototype.url;
  /**
   * Current version of the app running
   * @type {?}
   */
  AboutGithubLinkComponent.prototype.version;
  /** @type {?} */
  AboutGithubLinkComponent.prototype.ecmHost;
  /** @type {?} */
  AboutGithubLinkComponent.prototype.bpmHost;
  /** @type {?} */
  AboutGithubLinkComponent.prototype.application;
  /**
   * @type {?}
   * @private
   */
  AboutGithubLinkComponent.prototype.appConfig;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWJvdXQtZ2l0aHViLWxpbmsuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGFsZnJlc2NvL2FkZi1jb3JlLyIsInNvdXJjZXMiOlsiYWJvdXQvYWJvdXQtZ2l0aHViLWxpbmsvYWJvdXQtZ2l0aHViLWxpbmsuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFVLGlCQUFpQixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzVFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxlQUFlLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQU94RixNQUFNLE9BQU8sd0JBQXdCOzs7O0lBYWpDLFlBQW9CLFNBQTJCO1FBQTNCLGNBQVMsR0FBVCxTQUFTLENBQWtCOzs7O1FBVC9DLFFBQUcsR0FBRyw4REFBOEQsQ0FBQztRQUtyRSxZQUFPLEdBQUcsRUFBRSxDQUFDO1FBQ2IsWUFBTyxHQUFHLEVBQUUsQ0FBQztJQUdxQyxDQUFDOzs7O0lBRW5ELFFBQVE7UUFDSixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFTLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNuRSxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFTLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNuRSxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFTLGtCQUFrQixDQUFDLENBQUM7SUFDdEUsQ0FBQzs7O1lBeEJKLFNBQVMsU0FBQztnQkFDUCxRQUFRLEVBQUUsdUJBQXVCO2dCQUNqQywrd0NBQWlEO2dCQUNqRCxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTthQUN4Qzs7OztZQU5RLGdCQUFnQjs7O2tCQVVwQixLQUFLO3NCQUlMLEtBQUs7Ozs7Ozs7SUFKTix1Q0FDcUU7Ozs7O0lBR3JFLDJDQUF5Qjs7SUFFekIsMkNBQWE7O0lBQ2IsMkNBQWE7O0lBQ2IsK0NBQW9COzs7OztJQUVSLDZDQUFtQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEFsZnJlc2NvIFNvZnR3YXJlLCBMdGQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIE9uSW5pdCwgVmlld0VuY2Fwc3VsYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFwcENvbmZpZ1NlcnZpY2UsIEFwcENvbmZpZ1ZhbHVlcyB9IGZyb20gJy4uLy4uL2FwcC1jb25maWcvYXBwLWNvbmZpZy5zZXJ2aWNlJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdhZGYtYWJvdXQtZ2l0aHViLWxpbmsnLFxuICAgIHRlbXBsYXRlVXJsOiAnLi9hYm91dC1naXRodWItbGluay5jb21wb25lbnQuaHRtbCcsXG4gICAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZVxufSlcbmV4cG9ydCBjbGFzcyBBYm91dEdpdGh1YkxpbmtDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gICAgLyoqIENvbW1pdCBjb3JyZXNwb25kaW5nIHRvIHRoZSB2ZXJzaW9uIG9mIEFERiB0byBiZSB1c2VkLiAqL1xuICAgIEBJbnB1dCgpXG4gICAgdXJsID0gJ2h0dHBzOi8vZ2l0aHViLmNvbS9BbGZyZXNjby9hbGZyZXNjby1uZzItY29tcG9uZW50cy9jb21taXRzLyc7XG5cbiAgICAvKiogQ3VycmVudCB2ZXJzaW9uIG9mIHRoZSBhcHAgcnVubmluZyAqL1xuICAgIEBJbnB1dCgpIHZlcnNpb246IHN0cmluZztcblxuICAgIGVjbUhvc3QgPSAnJztcbiAgICBicG1Ib3N0ID0gJyc7XG4gICAgYXBwbGljYXRpb246IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgYXBwQ29uZmlnOiBBcHBDb25maWdTZXJ2aWNlKSB7fVxuXG4gICAgbmdPbkluaXQoKSB7XG4gICAgICAgIHRoaXMuZWNtSG9zdCA9IHRoaXMuYXBwQ29uZmlnLmdldDxzdHJpbmc+KEFwcENvbmZpZ1ZhbHVlcy5FQ01IT1NUKTtcbiAgICAgICAgdGhpcy5icG1Ib3N0ID0gdGhpcy5hcHBDb25maWcuZ2V0PHN0cmluZz4oQXBwQ29uZmlnVmFsdWVzLkJQTUhPU1QpO1xuICAgICAgICB0aGlzLmFwcGxpY2F0aW9uID0gdGhpcy5hcHBDb25maWcuZ2V0PHN0cmluZz4oJ2FwcGxpY2F0aW9uLm5hbWUnKTtcbiAgICB9XG59XG4iXX0=
