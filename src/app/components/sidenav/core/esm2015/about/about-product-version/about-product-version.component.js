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
import { Component, ViewEncapsulation } from '@angular/core';
import { ObjectDataTableAdapter } from '../../datatable/data/object-datatable-adapter';
import { AuthenticationService } from '../../services/authentication.service';
import { DiscoveryApiService } from '../../services/discovery-api.service';
export class AboutProductVersionComponent {
  /**
   * @param {?} authService
   * @param {?} discovery
   */
  constructor(authService, discovery) {
    this.authService = authService;
    this.discovery = discovery;
    this.ecmVersion = null;
    this.bpmVersion = null;
  }
  /**
   * @return {?}
   */
  ngOnInit() {
    if (this.authService.isEcmLoggedIn()) {
      this.setECMInfo();
    }
    if (this.authService.isBpmLoggedIn()) {
      this.setBPMInfo();
    }
  }
  /**
   * @return {?}
   */
  setECMInfo() {
    this.discovery.getEcmProductInfo().subscribe(
      /**
       * @param {?} ecmVers
       * @return {?}
       */
      ecmVers => {
        this.ecmVersion = ecmVers;
        this.modules = new ObjectDataTableAdapter(this.ecmVersion.modules, [
          {
            type: 'text',
            key: 'id',
            title: 'ABOUT.TABLE_HEADERS.MODULES.ID',
            sortable: true
          },
          {
            type: 'text',
            key: 'title',
            title: 'ABOUT.TABLE_HEADERS.MODULES.TITLE',
            sortable: true
          },
          {
            type: 'text',
            key: 'version',
            title: 'ABOUT.TABLE_HEADERS.MODULES.DESCRIPTION',
            sortable: true
          },
          {
            type: 'text',
            key: 'installDate',
            title: 'ABOUT.TABLE_HEADERS.MODULES.INSTALL_DATE',
            sortable: true
          },
          {
            type: 'text',
            key: 'installState',
            title: 'ABOUT.TABLE_HEADERS.MODULES.INSTALL_STATE',
            sortable: true
          },
          {
            type: 'text',
            key: 'versionMin',
            title: 'ABOUT.TABLE_HEADERS.MODULES.VERSION_MIN',
            sortable: true
          },
          {
            type: 'text',
            key: 'versionMax',
            title: 'ABOUT.TABLE_HEADERS.MODULES.VERSION_MAX',
            sortable: true
          }
        ]);
        this.status = new ObjectDataTableAdapter(
          [this.ecmVersion.status],
          [
            {
              type: 'text',
              key: 'isReadOnly',
              title: 'ABOUT.TABLE_HEADERS.STATUS.READ_ONLY',
              sortable: true
            },
            {
              type: 'text',
              key: 'isAuditEnabled',
              title: 'ABOUT.TABLE_HEADERS.STATUS.AUDIT_ENABLED',
              sortable: true
            },
            {
              type: 'text',
              key: 'isQuickShareEnabled',
              title: 'ABOUT.TABLE_HEADERS.STATUS.QUICK_SHARE_ENABLED',
              sortable: true
            },
            {
              type: 'text',
              key: 'isThumbnailGenerationEnabled',
              title: 'ABOUT.TABLE_HEADERS.STATUS.THUMBNAIL_ENABLED',
              sortable: true
            }
          ]
        );
        this.license = new ObjectDataTableAdapter(
          [this.ecmVersion.license],
          [
            {
              type: 'text',
              key: 'issuedAt',
              title: 'ABOUT.TABLE_HEADERS.LICENSE.ISSUES_AT',
              sortable: true
            },
            {
              type: 'text',
              key: 'expiresAt',
              title: 'ABOUT.TABLE_HEADERS.LICENSE.EXPIRES_AT',
              sortable: true
            },
            {
              type: 'text',
              key: 'remainingDays',
              title: 'ABOUT.TABLE_HEADERS.LICENSE.REMAINING_DAYS',
              sortable: true
            },
            {
              type: 'text',
              key: 'holder',
              title: 'ABOUT.TABLE_HEADERS.LICENSE.HOLDER',
              sortable: true
            },
            {
              type: 'text',
              key: 'mode',
              title: 'ABOUT.TABLE_HEADERS.LICENSE.MODE',
              sortable: true
            },
            {
              type: 'text',
              key: 'isClusterEnabled',
              title: 'ABOUT.TABLE_HEADERS.LICENSE.CLUSTER_ENABLED',
              sortable: true
            },
            {
              type: 'text',
              key: 'isCryptodocEnabled',
              title: 'ABOUT.TABLE_HEADERS.LICENSE.CRYPTODOC_ENABLED',
              sortable: true
            }
          ]
        );
      }
    );
  }
  /**
   * @return {?}
   */
  setBPMInfo() {
    this.discovery.getBpmProductInfo().subscribe(
      /**
       * @param {?} bpmVersion
       * @return {?}
       */
      bpmVersion => {
        this.bpmVersion = bpmVersion;
      }
    );
  }
}
AboutProductVersionComponent.decorators = [
  {
    type: Component,
    args: [
      {
        selector: 'adf-about-product-version',
        template:
          '<div class="adf-about-product-version-container" *ngIf="bpmVersion || ecmVersion">\n    <h3 data-automation-id="adf-about-product-version-title">{{ \'ABOUT.VERSIONS.TITLE\' | translate }}</h3>\n        <mat-card>\n            <div *ngIf="bpmVersion" data-automation-id="adf-about-bpm-service">\n                <h3>{{ \'ABOUT.VERSIONS.PROCESS_SERVICE\' | translate }}</h3>\n                <p data-automation-id="adf-about-bpm-edition">\n                    {{ \'ABOUT.VERSIONS.LABELS.EDITION\' | translate }}: {{ bpmVersion.edition }}\n                </p>\n                <p data-automation-id="adf-about-bpm-version">\n                    {{ \'ABOUT.VERSIONS.LABELS.VERSION\' | translate }}: {{ bpmVersion.majorVersion }}.{{\n                    bpmVersion.minorVersion }}.{{ bpmVersion.revisionVersion }}\n                </p>\n            </div>\n            <div *ngIf="ecmVersion" data-automation-id="adf-about-ecm-service">\n                <h3>{{ \'ABOUT.VERSIONS.CONTENT_SERVICE\' | translate }}</h3>\n                <p data-automation-id="adf-about-ecm-edition">\n                    {{ \'ABOUT.VERSIONS.LABELS.EDITION\' | translate }}: {{ ecmVersion.edition }}\n                </p>\n                <p data-automation-id="adf-about-ecm-version">\n                    {{ \'ABOUT.VERSIONS.LABELS.VERSION\' | translate }}: {{ ecmVersion.version.display }}\n                </p>\n            </div>\n        </mat-card>\n    <div *ngIf="ecmVersion" data-automation-id="adf-about-ecm">\n        <h3 data-automation-id="adf-about-ecm-license-title">{{ \'ABOUT.VERSIONS.LABELS.LICENSE\' | translate }}</h3>\n        <adf-datatable [data]="license"></adf-datatable>\n        <h3 data-automation-id="adf-about-ecm-status-title"> {{ \'ABOUT.VERSIONS.LABELS.STATUS\' | translate }}</h3>\n        <adf-datatable [data]="status"></adf-datatable>\n        <h3 data-automation-id="adf-about-ecm-modules-title">{{ \'ABOUT.VERSIONS.LABELS.MODULES\' | translate }}</h3>\n        <adf-datatable [data]="modules"></adf-datatable>\n    </div>\n</div>\n\n\n\n',
        encapsulation: ViewEncapsulation.None
      }
    ]
  }
];
/** @nocollapse */
AboutProductVersionComponent.ctorParameters = () => [
  { type: AuthenticationService },
  { type: DiscoveryApiService }
];
if (false) {
  /** @type {?} */
  AboutProductVersionComponent.prototype.ecmVersion;
  /** @type {?} */
  AboutProductVersionComponent.prototype.bpmVersion;
  /** @type {?} */
  AboutProductVersionComponent.prototype.status;
  /** @type {?} */
  AboutProductVersionComponent.prototype.license;
  /** @type {?} */
  AboutProductVersionComponent.prototype.modules;
  /**
   * @type {?}
   * @private
   */
  AboutProductVersionComponent.prototype.authService;
  /**
   * @type {?}
   * @private
   */
  AboutProductVersionComponent.prototype.discovery;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWJvdXQtcHJvZHVjdC12ZXJzaW9uLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hZGYtY29yZS8iLCJzb3VyY2VzIjpbImFib3V0L2Fib3V0LXByb2R1Y3QtdmVyc2lvbi9hYm91dC1wcm9kdWN0LXZlcnNpb24uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLE9BQU8sRUFBRSxTQUFTLEVBQVUsaUJBQWlCLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFckUsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sK0NBQStDLENBQUM7QUFDdkYsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sdUNBQXVDLENBQUM7QUFDOUUsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFPM0UsTUFBTSxPQUFPLDRCQUE0Qjs7Ozs7SUFTckMsWUFBb0IsV0FBa0MsRUFDbEMsU0FBOEI7UUFEOUIsZ0JBQVcsR0FBWCxXQUFXLENBQXVCO1FBQ2xDLGNBQVMsR0FBVCxTQUFTLENBQXFCO1FBUmxELGVBQVUsR0FBMkIsSUFBSSxDQUFDO1FBQzFDLGVBQVUsR0FBMkIsSUFBSSxDQUFDO0lBT1csQ0FBQzs7OztJQUV0RCxRQUFRO1FBQ0osSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsRUFBRSxFQUFFO1lBQ2xDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztTQUNyQjtRQUVELElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLEVBQUUsRUFBRTtZQUNsQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7U0FDckI7SUFDTCxDQUFDOzs7O0lBRUQsVUFBVTtRQUNOLElBQUksQ0FBQyxTQUFTLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxTQUFTOzs7O1FBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRTtZQUNyRCxJQUFJLENBQUMsVUFBVSxHQUFHLE9BQU8sQ0FBQztZQUUxQixJ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a0MsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO2dCQUN4RjtvQkFDSSxJQUFJLEVBQUUsTUFBTTtvQkFDWixHQUFHLEVBQUUsa0JBQWtCO29CQUN2QixLQUFLLEVBQUUsNkNBQTZDO29CQUNwRCxRQUFRLEVBQUUsSUFBSTtpQkFDakI7Z0JBQ0Q7b0JBQ0ksSUFBSSxFQUFFLE1BQU07b0JBQ1osR0FBRyxFQUFFLG9CQUFvQjtvQkFDekIsS0FBSyxFQUFFLCtDQUErQztvQkFDdEQsUUFBUSxFQUFFLElBQUk7aUJBQ2pCO2FBQ0osQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxFQUFDLENBQUM7SUFDUCxDQUFDOzs7O0lBRUQsVUFBVTtRQUNOLElBQUksQ0FBQyxTQUFTLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxTQUFTOzs7O1FBQUMsQ0FBQyxVQUFVLEVBQUUsRUFBRTtZQUN4RCxJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztRQUNqQyxDQUFDLEVBQUMsQ0FBQztJQUNQLENBQUM7OztZQWxISixTQUFTLFNBQUM7Z0JBQ1AsUUFBUSxFQUFFLDJCQUEyQjtnQkFDckMsa2lFQUFxRDtnQkFDckQsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7YUFDeEM7Ozs7WUFQUSxxQkFBcUI7WUFDckIsbUJBQW1COzs7O0lBU3hCLGtEQUEwQzs7SUFDMUMsa0RBQTBDOztJQUUxQyw4Q0FBK0I7O0lBQy9CLCtDQUFnQzs7SUFDaEMsK0NBQWdDOzs7OztJQUVwQixtREFBMEM7Ozs7O0lBQzFDLGlEQUFzQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEFsZnJlc2NvIFNvZnR3YXJlLCBMdGQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBWaWV3RW5jYXBzdWxhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQnBtUHJvZHVjdFZlcnNpb25Nb2RlbCwgRWNtUHJvZHVjdFZlcnNpb25Nb2RlbCB9IGZyb20gJy4uLy4uL21vZGVscy9wcm9kdWN0LXZlcnNpb24ubW9kZWwnO1xuaW1wb3J0IHsgT2JqZWN0RGF0YVRhYmxlQWRhcHRlciB9IGZyb20gJy4uLy4uL2RhdGF0YWJsZS9kYXRhL29iamVjdC1kYXRhdGFibGUtYWRhcHRlcic7XG5pbXBvcnQgeyBBdXRoZW50aWNhdGlvblNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9hdXRoZW50aWNhdGlvbi5zZXJ2aWNlJztcbmltcG9ydCB7IERpc2NvdmVyeUFwaVNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kaXNjb3ZlcnktYXBpLnNlcnZpY2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ2FkZi1hYm91dC1wcm9kdWN0LXZlcnNpb24nLFxuICAgIHRlbXBsYXRlVXJsOiAnLi9hYm91dC1wcm9kdWN0LXZlcnNpb24uY29tcG9uZW50Lmh0bWwnLFxuICAgIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmVcbn0pXG5leHBvcnQgY2xhc3MgQWJvdXRQcm9kdWN0VmVyc2lvbkNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgICBlY21WZXJzaW9uOiBFY21Qcm9kdWN0VmVyc2lvbk1vZGVsID0gbnVsbDtcbiAgICBicG1WZXJzaW9uOiBCcG1Qcm9kdWN0VmVyc2lvbk1vZGVsID0gbnVsbDtcblxuICAgIHN0YXR1czogT2JqZWN0RGF0YVRhYmxlQWRhcHRlcjtcbiAgICBsaWNlbnNlOiBPYmplY3REYXRhVGFibGVBZGFwdGVyO1xuICAgIG1vZHVsZXM6IE9iamVjdERhdGFUYWJsZUFkYXB0ZXI7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGF1dGhTZXJ2aWNlOiBBdXRoZW50aWNhdGlvblNlcnZpY2UsXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSBkaXNjb3Zlcnk6IERpc2NvdmVyeUFwaVNlcnZpY2UpIHt9XG5cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgaWYgKHRoaXMuYXV0aFNlcnZpY2UuaXNFY21Mb2dnZWRJbigpKSB7XG4gICAgICAgICAgICB0aGlzLnNldEVDTUluZm8oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmF1dGhTZXJ2aWNlLmlzQnBtTG9nZ2VkSW4oKSkge1xuICAgICAgICAgICAgdGhpcy5zZXRCUE1JbmZvKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRFQ01JbmZvKCkge1xuICAgICAgICB0aGlzLmRpc2NvdmVyeS5nZXRFY21Qcm9kdWN0SW5mbygpLnN1YnNjcmliZSgoZWNtVmVycykgPT4ge1xuICAgICAgICAgICAgdGhpcy5lY21WZXJzaW9uID0gZWNtVmVycztcblxuICAgICAgICAgICAgdGhpcy5tb2R1bGVzID0gbmV3IE9iamVjdERhdGFUYWJsZUFkYXB0ZXIodGhpcy5lY21WZXJzaW9uLm1vZHVsZXMsIFtcbiAgICAgICAgICAgICAgICB7IHR5cGU6ICd0ZXh0Jywga2V5OiAnaWQnLCB0aXRsZTogJ0FCT1VULlRBQkxFX0hFQURFUlMuTU9EVUxFUy5JRCcsIHNvcnRhYmxlOiB0cnVlIH0sXG4gICAgICAgICAgICAgICAgeyB0eXBlOiAndGV4dCcsIGtleTogJ3RpdGxlJywgdGl0bGU6ICdBQk9VVC5UQUJMRV9IRUFERVJTLk1PRFVMRVMuVElUTEUnLCBzb3J0YWJsZTogdHJ1ZSB9LFxuICAgICAgICAgICAgICAgIHsgdHlwZTogJ3RleHQnLCBrZXk6ICd2ZXJzaW9uJywgdGl0bGU6ICdBQk9VVC5UQUJMRV9IRUFERVJTLk1PRFVMRVMuREVTQ1JJUFRJT04nLCBzb3J0YWJsZTogdHJ1ZSB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgICAgICAgICAgICAgICBrZXk6ICdpbnN0YWxsRGF0ZScsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnQUJPVVQuVEFCTEVfSEVBREVSUy5NT0RVTEVTLklOU1RBTExfREFURScsXG4gICAgICAgICAgICAgICAgICAgIHNvcnRhYmxlOiB0cnVlXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgICAgICAgICAgICAgICAga2V5OiAnaW5zdGFsbFN0YXRlJyxcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdBQk9VVC5UQUJMRV9IRUFERVJTLk1PRFVMRVMuSU5TVEFMTF9TVEFURScsXG4gICAgICAgICAgICAgICAgICAgIHNvcnRhYmxlOiB0cnVlXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgICAgICAgICAgICAgICAga2V5OiAndmVyc2lvbk1pbicsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnQUJPVVQuVEFCTEVfSEVBREVSUy5NT0RVTEVTLlZFUlNJT05fTUlOJyxcbiAgICAgICAgICAgICAgICAgICAgc29ydGFibGU6IHRydWVcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgICAgICAgICAgICAgICBrZXk6ICd2ZXJzaW9uTWF4JyxcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdBQk9VVC5UQUJMRV9IRUFERVJTLk1PRFVMRVMuVkVSU0lPTl9NQVgnLFxuICAgICAgICAgICAgICAgICAgICBzb3J0YWJsZTogdHJ1ZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF0pO1xuXG4gICAgICAgICAgICB0aGlzLnN0YXR1cyA9IG5ldyBPYmplY3REYXRhVGFibGVBZGFwdGVyKFt0aGlzLmVjbVZlcnNpb24uc3RhdHVzXSwgW1xuICAgICAgICAgICAgICAgIHsgdHlwZTogJ3RleHQnLCBrZXk6ICdpc1JlYWRPbmx5JywgdGl0bGU6ICdBQk9VVC5UQUJMRV9IRUFERVJTLlNUQVRVUy5SRUFEX09OTFknLCBzb3J0YWJsZTogdHJ1ZSB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgICAgICAgICAgICAgICBrZXk6ICdpc0F1ZGl0RW5hYmxlZCcsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnQUJPVVQuVEFCTEVfSEVBREVSUy5TVEFUVVMuQVVESVRfRU5BQkxFRCcsXG4gICAgICAgICAgICAgICAgICAgIHNvcnRhYmxlOiB0cnVlXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgICAgICAgICAgICAgICAga2V5OiAnaXNRdWlja1NoYXJlRW5hYmxlZCcsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnQUJPVVQuVEFCTEVfSEVBREVSUy5TVEFUVVMuUVVJQ0tfU0hBUkVfRU5BQkxFRCcsXG4gICAgICAgICAgICAgICAgICAgIHNvcnRhYmxlOiB0cnVlXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgICAgICAgICAgICAgICAga2V5OiAnaXNUaHVtYm5haWxHZW5lcmF0aW9uRW5hYmxlZCcsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnQUJPVVQuVEFCTEVfSEVBREVSUy5TVEFUVVMuVEhVTUJOQUlMX0VOQUJMRUQnLFxuICAgICAgICAgICAgICAgICAgICBzb3J0YWJsZTogdHJ1ZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF0pO1xuXG4gICAgICAgICAgICB0aGlzLmxpY2Vuc2UgPSBuZXcgT2JqZWN0RGF0YVRhYmxlQWRhcHRlcihbdGhpcy5lY21WZXJzaW9uLmxpY2Vuc2VdLCBbXG4gICAgICAgICAgICAgICAgeyB0eXBlOiAndGV4dCcsIGtleTogJ2lzc3VlZEF0JywgdGl0bGU6ICdBQk9VVC5UQUJMRV9IRUFERVJTLkxJQ0VOU0UuSVNTVUVTX0FUJywgc29ydGFibGU6IHRydWUgfSxcbiAgICAgICAgICAgICAgICB7IHR5cGU6ICd0ZXh0Jywga2V5OiAnZXhwaXJlc0F0JywgdGl0bGU6ICdBQk9VVC5UQUJMRV9IRUFERVJTLkxJQ0VOU0UuRVhQSVJFU19BVCcsIHNvcnRhYmxlOiB0cnVlIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAndGV4dCcsXG4gICAgICAgICAgICAgICAgICAgIGtleTogJ3JlbWFpbmluZ0RheXMnLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ0FCT1VULlRBQkxFX0hFQURFUlMuTElDRU5TRS5SRU1BSU5JTkdfREFZUycsXG4gICAgICAgICAgICAgICAgICAgIHNvcnRhYmxlOiB0cnVlXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7IHR5cGU6ICd0ZXh0Jywga2V5OiAnaG9sZGVyJywgdGl0bGU6ICdBQk9VVC5UQUJMRV9IRUFERVJTLkxJQ0VOU0UuSE9MREVSJywgc29ydGFibGU6IHRydWUgfSxcbiAgICAgICAgICAgICAgICB7IHR5cGU6ICd0ZXh0Jywga2V5OiAnbW9kZScsIHRpdGxlOiAnQUJPVVQuVEFCTEVfSEVBREVSUy5MSUNFTlNFLk1PREUnLCBzb3J0YWJsZTogdHJ1ZSB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgICAgICAgICAgICAgICBrZXk6ICdpc0NsdXN0ZXJFbmFibGVkJyxcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdBQk9VVC5UQUJMRV9IRUFERVJTLkxJQ0VOU0UuQ0xVU1RFUl9FTkFCTEVEJyxcbiAgICAgICAgICAgICAgICAgICAgc29ydGFibGU6IHRydWVcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgICAgICAgICAgICAgICBrZXk6ICdpc0NyeXB0b2RvY0VuYWJsZWQnLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ0FCT1VULlRBQkxFX0hFQURFUlMuTElDRU5TRS5DUllQVE9ET0NfRU5BQkxFRCcsXG4gICAgICAgICAgICAgICAgICAgIHNvcnRhYmxlOiB0cnVlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHNldEJQTUluZm8oKSB7XG4gICAgICAgIHRoaXMuZGlzY292ZXJ5LmdldEJwbVByb2R1Y3RJbmZvKCkuc3Vic2NyaWJlKChicG1WZXJzaW9uKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmJwbVZlcnNpb24gPSBicG1WZXJzaW9uO1xuICAgICAgICB9KTtcbiAgICB9XG59XG4iXX0=
