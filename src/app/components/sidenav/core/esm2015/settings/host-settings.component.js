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
  EventEmitter,
  Output,
  ViewEncapsulation,
  Input
} from '@angular/core';
import { Validators, FormBuilder, FormControl } from '@angular/forms';
import {
  AppConfigService,
  AppConfigValues
} from '../app-config/app-config.service';
import { StorageService } from '../services/storage.service';
import { AlfrescoApiService } from '../services/alfresco-api.service';
import { ENTER } from '@angular/cdk/keycodes';
export class HostSettingsComponent {
  /**
   * @param {?} formBuilder
   * @param {?} storageService
   * @param {?} alfrescoApiService
   * @param {?} appConfig
   */
  constructor(formBuilder, storageService, alfrescoApiService, appConfig) {
    this.formBuilder = formBuilder;
    this.storageService = storageService;
    this.alfrescoApiService = alfrescoApiService;
    this.appConfig = appConfig;
    this.HOST_REGEX = '^(http|https)://.*[^/]$';
    /**
     * Tells the component which provider options are available. Possible valid values
     * are "ECM" (Content), "BPM" (Process) , "ALL" (Content and Process), 'OAUTH2' SSO.
     */
    this.providers = ['BPM', 'ECM', 'ALL'];
    this.showSelectProviders = true;
    /**
     * Emitted when the URL is invalid.
     */
    this.error = new EventEmitter();
    /**
     * Emitted when the user cancels the changes.
     */
    this.cancel = new EventEmitter();
    /**
     * Emitted when the changes are successfully applied.
     */
    this.success = new EventEmitter();
  }
  /**
   * @return {?}
   */
  ngOnInit() {
    if (this.providers.length === 1) {
      this.showSelectProviders = false;
    }
    /** @type {?} */
    const providerSelected = this.appConfig.get(AppConfigValues.PROVIDERS);
    /** @type {?} */
    const authType = this.appConfig.get(AppConfigValues.AUTHTYPE, 'BASIC');
    this.form = this.formBuilder.group({
      providersControl: [providerSelected, Validators.required],
      authType: authType
    });
    this.addFormGroups();
    if (authType === 'OAUTH') {
      this.addOAuthFormGroup();
      this.addIdentityHostFormControl();
    }
    this.form.get('authType').valueChanges.subscribe(
      /**
       * @param {?} value
       * @return {?}
       */
      value => {
        if (value === 'BASIC') {
          this.form.removeControl('oauthConfig');
          this.form.removeControl('identityHost');
        } else {
          this.addOAuthFormGroup();
          this.addIdentityHostFormControl();
        }
      }
    );
    this.providersControl.valueChanges.subscribe(
      /**
       * @return {?}
       */
      () => {
        this.removeFormGroups();
        this.addFormGroups();
      }
    );
  }
  /**
   * @private
   * @return {?}
   */
  removeFormGroups() {
    this.form.removeControl('bpmHost');
    this.form.removeControl('ecmHost');
  }
  /**
   * @private
   * @return {?}
   */
  addFormGroups() {
    this.addBPMFormControl();
    this.addECMFormControl();
  }
  /**
   * @private
   * @return {?}
   */
  addOAuthFormGroup() {
    /** @type {?} */
    const oauthFormGroup = this.createOAuthFormGroup();
    this.form.addControl('oauthConfig', oauthFormGroup);
  }
  /**
   * @private
   * @return {?}
   */
  addBPMFormControl() {
    if ((this.isBPM() || this.isALL() || this.isOAUTH()) && !this.bpmHost) {
      /** @type {?} */
      const bpmFormControl = this.createBPMFormControl();
      this.form.addControl('bpmHost', bpmFormControl);
    }
  }
  /**
   * @private
   * @return {?}
   */
  addIdentityHostFormControl() {
    /** @type {?} */
    const identityHostFormControl = this.createIdentityFormControl();
    this.form.addControl('identityHost', identityHostFormControl);
  }
  /**
   * @private
   * @return {?}
   */
  addECMFormControl() {
    if ((this.isECM() || this.isALL()) && !this.ecmHost) {
      /** @type {?} */
      const ecmFormControl = this.createECMFormControl();
      this.form.addControl('ecmHost', ecmFormControl);
    }
  }
  /**
   * @private
   * @return {?}
   */
  createOAuthFormGroup() {
    /** @type {?} */
    const oauth = /** @type {?} */ (this.appConfig.get(
      AppConfigValues.OAUTHCONFIG,
      {}
    ));
    return this.formBuilder.group({
      host: [
        oauth.host,
        [Validators.required, Validators.pattern(this.HOST_REGEX)]
      ],
      clientId: [oauth.clientId, Validators.required],
      redirectUri: [oauth.redirectUri, Validators.required],
      redirectUriLogout: [oauth.redirectUriLogout],
      scope: [oauth.scope, Validators.required],
      secret: oauth.secret,
      silentLogin: oauth.silentLogin,
      implicitFlow: oauth.implicitFlow,
      publicUrls: [oauth.publicUrls]
    });
  }
  /**
   * @private
   * @return {?}
   */
  createBPMFormControl() {
    return new FormControl(this.appConfig.get(AppConfigValues.BPMHOST), [
      Validators.required,
      Validators.pattern(this.HOST_REGEX)
    ]);
  }
  /**
   * @private
   * @return {?}
   */
  createIdentityFormControl() {
    return new FormControl(this.appConfig.get(AppConfigValues.IDENTITY_HOST), [
      Validators.required,
      Validators.pattern(this.HOST_REGEX)
    ]);
  }
  /**
   * @private
   * @return {?}
   */
  createECMFormControl() {
    return new FormControl(this.appConfig.get(AppConfigValues.ECMHOST), [
      Validators.required,
      Validators.pattern(this.HOST_REGEX)
    ]);
  }
  /**
   * @return {?}
   */
  onCancel() {
    this.cancel.emit(true);
  }
  /**
   * @param {?} values
   * @return {?}
   */
  onSubmit(values) {
    this.storageService.setItem(
      AppConfigValues.PROVIDERS,
      values.providersControl
    );
    if (this.isBPM()) {
      this.saveBPMValues(values);
    } else if (this.isECM()) {
      this.saveECMValues(values);
    } else if (this.isALL()) {
      this.saveECMValues(values);
      this.saveBPMValues(values);
    }
    if (this.isOAUTH()) {
      this.saveOAuthValues(values);
    }
    this.storageService.setItem(AppConfigValues.AUTHTYPE, values.authType);
    this.alfrescoApiService.reset();
    this.alfrescoApiService.getInstance().invalidateSession();
    this.success.emit(true);
  }
  /**
   * @param {?} event
   * @return {?}
   */
  keyDownFunction(event) {
    if (event.keyCode === ENTER && this.form.valid) {
      this.onSubmit(this.form.value);
    }
  }
  /**
   * @private
   * @param {?} values
   * @return {?}
   */
  saveOAuthValues(values) {
    if (
      values.oauthConfig.publicUrls &&
      typeof values.oauthConfig.publicUrls === 'string'
    ) {
      values.oauthConfig.publicUrls = values.oauthConfig.publicUrls.split(',');
    }
    this.storageService.setItem(
      AppConfigValues.OAUTHCONFIG,
      JSON.stringify(values.oauthConfig)
    );
    this.storageService.setItem(
      AppConfigValues.IDENTITY_HOST,
      values.identityHost
    );
  }
  /**
   * @private
   * @param {?} values
   * @return {?}
   */
  saveBPMValues(values) {
    this.storageService.setItem(AppConfigValues.BPMHOST, values.bpmHost);
  }
  /**
   * @private
   * @param {?} values
   * @return {?}
   */
  saveECMValues(values) {
    this.storageService.setItem(AppConfigValues.ECMHOST, values.ecmHost);
  }
  /**
   * @return {?}
   */
  isBPM() {
    return this.providersControl.value === 'BPM';
  }
  /**
   * @return {?}
   */
  isECM() {
    return this.providersControl.value === 'ECM';
  }
  /**
   * @return {?}
   */
  isALL() {
    return this.providersControl.value === 'ALL';
  }
  /**
   * @return {?}
   */
  isOAUTH() {
    return this.form.get('authType').value === 'OAUTH';
  }
  /**
   * @return {?}
   */
  get providersControl() {
    return this.form.get('providersControl');
  }
  /**
   * @return {?}
   */
  get bpmHost() {
    return this.form.get('bpmHost');
  }
  /**
   * @return {?}
   */
  get ecmHost() {
    return this.form.get('ecmHost');
  }
  /**
   * @return {?}
   */
  get host() {
    return this.oauthConfig.get('host');
  }
  /**
   * @return {?}
   */
  get identityHost() {
    return this.form.get('identityHost');
  }
  /**
   * @return {?}
   */
  get clientId() {
    return this.oauthConfig.get('clientId');
  }
  /**
   * @return {?}
   */
  get scope() {
    return this.oauthConfig.get('scope');
  }
  /**
   * @return {?}
   */
  get secretId() {
    return this.oauthConfig.get('secretId');
  }
  /**
   * @return {?}
   */
  get implicitFlow() {
    return this.oauthConfig.get('implicitFlow');
  }
  /**
   * @return {?}
   */
  get silentLogin() {
    return this.oauthConfig.get('silentLogin');
  }
  /**
   * @return {?}
   */
  get redirectUri() {
    return this.oauthConfig.get('redirectUri');
  }
  /**
   * @return {?}
   */
  get publicUrls() {
    return this.oauthConfig.get('publicUrls');
  }
  /**
   * @return {?}
   */
  get redirectUriLogout() {
    return this.oauthConfig.get('redirectUriLogout');
  }
  /**
   * @return {?}
   */
  get oauthConfig() {
    return this.form.get('oauthConfig');
  }
}
HostSettingsComponent.decorators = [
  {
    type: Component,
    args: [
      {
        selector: 'adf-host-settings',
        template:
          '<div class="adf-setting-container">\n    <mat-toolbar color="primary" class="adf-setting-toolbar">\n        <h3>{{\'CORE.HOST_SETTINGS.TITLE\' | translate}}</h3>\n    </mat-toolbar>\n    <mat-card class="adf-setting-card">\n        <form id="host-form" [formGroup]="form" (submit)="onSubmit(form.value)" (keydown)="keyDownFunction($event)">\n\n            <mat-form-field floatLabel="{{\'CORE.HOST_SETTINGS.PROVIDER\' | translate }}" *ngIf="showSelectProviders">\n                <mat-select  id="adf-provider-selector" placeholder="Provider" [formControl]="providersControl">\n                    <mat-option *ngFor="let provider of providers" [value]="provider">\n                        {{ provider }}\n                    </mat-option>\n                </mat-select>\n            </mat-form-field>\n\n            <div class="adf-authentication-type">\n                <div> {{\'CORE.HOST_SETTINGS.TYPE-AUTH\' | translate }} : </div>\n                <mat-radio-group formControlName="authType" >\n                <mat-radio-button value="BASIC">{{\'CORE.HOST_SETTINGS.BASIC\' | translate }}\n                </mat-radio-button>\n                <mat-radio-button value="OAUTH">{{\'CORE.HOST_SETTINGS.SSO\' | translate }}\n                </mat-radio-button>\n            </mat-radio-group>\n            </div>\n\n            <ng-container *ngIf="isALL() || isECM()">\n                <mat-card-content>\n                    <mat-form-field class="adf-full-width" floatLabel="{{\'CORE.HOST_SETTINGS.CS-HOST\' | translate }}">\n                        <mat-label>{{\'CORE.HOST_SETTINGS.CS-HOST\' | translate }}</mat-label>\n                        <input matInput [formControl]="ecmHost" data-automation-id="ecmHost" type="text"\n                               id="ecmHost" placeholder="http(s)://host|ip:port(/path)">\n                        <mat-error *ngIf="ecmHost.hasError(\'pattern\')">\n                            {{ \'CORE.HOST_SETTINGS.NOT_VALID\'| translate }}\n                        </mat-error>\n                        <mat-error *ngIf="ecmHost.hasError(\'required\')">\n                            {{ \'CORE.HOST_SETTINGS.REQUIRED\'| translate }}\n                        </mat-error>\n                    </mat-form-field>\n                    <p>\n                </mat-card-content>\n            </ng-container>\n\n            <ng-container *ngIf="isALL() || isBPM()">\n                <mat-card-content>\n                    <mat-form-field class="adf-full-width" floatLabel="{{\'CORE.HOST_SETTINGS.BP-HOST\' | translate }}">\n                        <mat-label>{{\'CORE.HOST_SETTINGS.BP-HOST\' | translate }}</mat-label>\n                        <input matInput [formControl]="bpmHost" data-automation-id="bpmHost" type="text"\n                               id="bpmHost" placeholder="http(s)://host|ip:port(/path)">\n                        <mat-error *ngIf="bpmHost.hasError(\'pattern\')">\n                            {{ \'CORE.HOST_SETTINGS.NOT_VALID\'| translate }}\n                        </mat-error>\n                        <mat-error *ngIf="bpmHost.hasError(\'required\')">\n                            {{ \'CORE.HOST_SETTINGS.REQUIRED\'| translate }}\n                        </mat-error>\n                    </mat-form-field>\n                </mat-card-content>\n            </ng-container>\n\n            <ng-container *ngIf="isOAUTH()">\n                <mat-card-content>\n                    <mat-form-field class="adf-full-width" floatLabel="Identity Host">\n                        <mat-label>Identity Host</mat-label>\n                        <input matInput name="identityHost" id="identityHost" formControlName="identityHost"\n                                placeholder="http(s)://host|ip:port(/path)">\n                        <mat-error *ngIf="identityHost.hasError(\'pattern\')">\n                            {{ \'CORE.HOST_SETTINGS.NOT_VALID\'| translate }}\n                        </mat-error>\n                        <mat-error *ngIf="identityHost.hasError(\'required\')">\n                            {{ \'CORE.HOST_SETTINGS.REQUIRED\'| translate }}\n                        </mat-error>\n                    </mat-form-field>\n                </mat-card-content>\n            </ng-container>\n\n            <ng-container *ngIf="isOAUTH()">\n                <div formGroupName="oauthConfig">\n                    <mat-form-field class="adf-full-width" floatLabel="Auth Host">\n                        <mat-label>Auth Host</mat-label>\n                        <input matInput name="host" id="oauthHost" formControlName="host"\n                               placeholder="http(s)://host|ip:port(/path)">\n                        <mat-error *ngIf="host.hasError(\'pattern\')">\n                            {{ \'CORE.HOST_SETTINGS.NOT_VALID\'| translate }}\n                        </mat-error>\n                        <mat-error *ngIf="host.hasError(\'required\')">\n                            {{ \'CORE.HOST_SETTINGS.REQUIRED\'| translate }}\n                        </mat-error>\n                    </mat-form-field>\n                    <mat-form-field class="adf-full-width" floatLabel="Client Id">\n                        <mat-label>{{ \'CORE.HOST_SETTINGS.CLIENT\'| translate }}</mat-label>\n                        <input matInput name="clientId" id="clientId" formControlName="clientId"\n                               placeholder="Client Id">\n                        <mat-error *ngIf="clientId.hasError(\'required\')">\n                            {{ \'CORE.HOST_SETTINGS.REQUIRED\'| translate }}\n                        </mat-error>\n                    </mat-form-field>\n\n                    <mat-form-field class="adf-full-width" floatLabel="Scope">\n                        <mat-label>{{ \'CORE.HOST_SETTINGS.SCOPE\'| translate }}</mat-label>\n                        <input matInput name="{{ \'CORE.HOST_SETTINGS.SCOPE\'| translate }}"\n                               formControlName="scope" placeholder="Scope Id">\n                        <mat-error *ngIf="scope.hasError(\'required\')">\n                            {{ \'CORE.HOST_SETTINGS.REQUIRED\'| translate }}\n                        </mat-error>\n                    </mat-form-field>\n\n                    <label for="silentLogin">{{ \'CORE.HOST_SETTINGS.SILENT\'| translate }}</label>\n                    <mat-slide-toggle class="adf-full-width" name="silentLogin" [color]="\'primary\'"\n                                      formControlName="silentLogin">\n                    </mat-slide-toggle>\n\n                    <label for="implicitFlow">{{ \'CORE.HOST_SETTINGS.IMPLICIT-FLOW\'| translate }}</label>\n                    <mat-slide-toggle class="adf-full-width" name="implicitFlow" [color]="\'primary\'"\n                                      formControlName="implicitFlow">\n                    </mat-slide-toggle>\n\n\n                    <mat-form-field class="adf-full-width" floatLabel="Redirect Uri">\n                        <mat-label>{{ \'CORE.HOST_SETTINGS.REDIRECT\'| translate }}</mat-label>\n                        <input matInput placeholder="{{ \'CORE.HOST_SETTINGS.REDIRECT\'| translate }}"\n                               name="redirectUri" formControlName="redirectUri">\n                        <mat-error *ngIf="redirectUri.hasError(\'required\')">\n                            {{ \'CORE.HOST_SETTINGS.REQUIRED\'| translate }}\n                        </mat-error>\n                    </mat-form-field>\n\n                    <mat-form-field class="adf-full-width" floatLabel="Redirect Uri Logout">\n                        <mat-label>{{ \'CORE.HOST_SETTINGS.REDIRECT_LOGOUT\'| translate }}</mat-label>\n                        <input id="logout-url" matInput placeholder="{{ \'CORE.HOST_SETTINGS.REDIRECT_LOGOUT\'| translate }}"\n                               name="redirectUriLogout" formControlName="redirectUriLogout">\n                    </mat-form-field>\n\n                    <mat-form-field class="adf-full-width" floatLabel="Public Urls">\n                        <mat-label>{{ \'CORE.HOST_SETTINGS.PUBLIC_URLS\'| translate }}</mat-label>\n                        <input id="public-url" matInput placeholder="{{ \'CORE.HOST_SETTINGS.PUBLIC_URLS\'| translate }}"\n                               name="publicUrls" formControlName="publicUrls">\n                    </mat-form-field>\n\n                </div>\n            </ng-container>\n            <mat-card-actions class="adf-actions">\n                <button mat-button (click)="onCancel()" color="primary">\n                    {{\'CORE.HOST_SETTINGS.BACK\' | translate }}\n                </button>\n                <button type="submit" id="host-button" class="adf-login-button" mat-raised-button\n                        color="primary" data-automation-id="host-button"\n                        [disabled]="!form.valid">\n                    {{\'CORE.HOST_SETTINGS.APPLY\' | translate }}\n                </button>\n            </mat-card-actions>\n        </form>\n    </mat-card>\n</div>\n',
        host: {
          class: 'adf-host-settings'
        },
        encapsulation: ViewEncapsulation.None,
        styles: ['']
      }
    ]
  }
];
/** @nocollapse */
HostSettingsComponent.ctorParameters = () => [
  { type: FormBuilder },
  { type: StorageService },
  { type: AlfrescoApiService },
  { type: AppConfigService }
];
HostSettingsComponent.propDecorators = {
  providers: [{ type: Input }],
  error: [{ type: Output }],
  cancel: [{ type: Output }],
  success: [{ type: Output }]
};
if (false) {
  /** @type {?} */
  HostSettingsComponent.prototype.HOST_REGEX;
  /**
   * Tells the component which provider options are available. Possible valid values
   * are "ECM" (Content), "BPM" (Process) , "ALL" (Content and Process), 'OAUTH2' SSO.
   * @type {?}
   */
  HostSettingsComponent.prototype.providers;
  /** @type {?} */
  HostSettingsComponent.prototype.showSelectProviders;
  /** @type {?} */
  HostSettingsComponent.prototype.form;
  /**
   * Emitted when the URL is invalid.
   * @type {?}
   */
  HostSettingsComponent.prototype.error;
  /**
   * Emitted when the user cancels the changes.
   * @type {?}
   */
  HostSettingsComponent.prototype.cancel;
  /**
   * Emitted when the changes are successfully applied.
   * @type {?}
   */
  HostSettingsComponent.prototype.success;
  /**
   * @type {?}
   * @private
   */
  HostSettingsComponent.prototype.formBuilder;
  /**
   * @type {?}
   * @private
   */
  HostSettingsComponent.prototype.storageService;
  /**
   * @type {?}
   * @private
   */
  HostSettingsComponent.prototype.alfrescoApiService;
  /**
   * @type {?}
   * @private
   */
  HostSettingsComponent.prototype.appConfig;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9zdC1zZXR0aW5ncy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWxmcmVzY28vYWRmLWNvcmUvIiwic291cmNlcyI6WyJzZXR0aW5ncy9ob3N0LXNldHRpbmdzLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQUUsaUJBQWlCLEVBQVUsS0FBSyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ2xHLE9BQU8sRUFBRSxVQUFVLEVBQWEsV0FBVyxFQUFtQixXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNsRyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsZUFBZSxFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDckYsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQzdELE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBRXRFLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQVc5QyxNQUFNLE9BQU8scUJBQXFCOzs7Ozs7O0lBMkI5QixZQUFvQixXQUF3QixFQUN4QixjQUE4QixFQUM5QixrQkFBc0MsRUFDdEMsU0FBMkI7UUFIM0IsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFDeEIsbUJBQWMsR0FBZCxjQUFjLENBQWdCO1FBQzlCLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBb0I7UUFDdEMsY0FBUyxHQUFULFNBQVMsQ0FBa0I7UUE1Qi9DLGVBQVUsR0FBVywyQkFBMkIsQ0FBQzs7Ozs7UUFPakQsY0FBUyxHQUFhLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztRQUU1Qyx3QkFBbUIsR0FBRyxJQUFJLENBQUM7Ozs7UUFNM0IsVUFBSyxHQUFHLElBQUksWUFBWSxFQUFVLENBQUM7Ozs7UUFJbkMsV0FBTSxHQUFHLElBQUksWUFBWSxF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SSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDcEMsQ0FBQzs7OztJQUVELElBQUksSUFBSTtRQUNKLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDeEMsQ0FBQzs7OztJQUVELElBQUksWUFBWTtRQUNaLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDekMsQ0FBQzs7OztJQUVELElBQUksUUFBUTtRQUNSLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDNUMsQ0FBQzs7OztJQUVELElBQUksS0FBSztRQUNMLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDekMsQ0FBQzs7OztJQUVELElBQUksUUFBUTtRQUNSLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDNUMsQ0FBQzs7OztJQUVELElBQUksWUFBWTtRQUNaLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDaEQsQ0FBQzs7OztJQUVELElBQUksV0FBVztRQUNYLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDL0MsQ0FBQzs7OztJQUVELElBQUksV0FBVztRQUNYLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDL0MsQ0FBQzs7OztJQUVELElBQUksVUFBVTtRQUNWLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDOUMsQ0FBQzs7OztJQUVELElBQUksaUJBQWlCO1FBQ2pCLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUMsQ0FBQztJQUNyRCxDQUFDOzs7O0lBRUQsSUFBSSxXQUFXO1FBQ1gsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUN4QyxDQUFDOzs7WUFyUUosU0FBUyxTQUFDO2dCQUNQLFFBQVEsRUFBRSxtQkFBbUI7Z0JBQzdCLGs5UkFBMkM7Z0JBQzNDLElBQUksRUFBRTtvQkFDRixPQUFPLEVBQUUsbUJBQW1CO2lCQUMvQjtnQkFFRCxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTs7YUFDeEM7Ozs7WUFmK0IsV0FBVztZQUVsQyxjQUFjO1lBQ2Qsa0JBQWtCO1lBRmxCLGdCQUFnQjs7O3dCQXVCcEIsS0FBSztvQkFRTCxNQUFNO3FCQUlOLE1BQU07c0JBSU4sTUFBTTs7OztJQXRCUCwyQ0FBaUQ7Ozs7OztJQU1qRCwwQ0FDNEM7O0lBRTVDLG9EQUEyQjs7SUFFM0IscUNBQWdCOzs7OztJQUdoQixzQ0FDbUM7Ozs7O0lBR25DLHVDQUNxQzs7Ozs7SUFHckMsd0NBQ3NDOzs7OztJQUUxQiw0Q0FBZ0M7Ozs7O0lBQ2hDLCtDQUFzQzs7Ozs7SUFDdEMsbURBQThDOzs7OztJQUM5QywwQ0FBbUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBBbGZyZXNjbyBTb2Z0d2FyZSwgTHRkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBDb21wb25lbnQsIEV2ZW50RW1pdHRlciwgT3V0cHV0LCBWaWV3RW5jYXBzdWxhdGlvbiwgT25Jbml0LCBJbnB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgVmFsaWRhdG9ycywgRm9ybUdyb3VwLCBGb3JtQnVpbGRlciwgQWJzdHJhY3RDb250cm9sLCBGb3JtQ29udHJvbCB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IEFwcENvbmZpZ1NlcnZpY2UsIEFwcENvbmZpZ1ZhbHVlcyB9IGZyb20gJy4uL2FwcC1jb25maWcvYXBwLWNvbmZpZy5zZXJ2aWNlJztcbmltcG9ydCB7IFN0b3JhZ2VTZXJ2aWNlIH0gZnJvbSAnLi4vc2VydmljZXMvc3RvcmFnZS5zZXJ2aWNlJztcbmltcG9ydCB7IEFsZnJlc2NvQXBpU2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2VzL2FsZnJlc2NvLWFwaS5zZXJ2aWNlJztcbmltcG9ydCB7IE9hdXRoQ29uZmlnTW9kZWwgfSBmcm9tICcuLi9tb2RlbHMvb2F1dGgtY29uZmlnLm1vZGVsJztcbmltcG9ydCB7IEVOVEVSIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2tleWNvZGVzJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdhZGYtaG9zdC1zZXR0aW5ncycsXG4gICAgdGVtcGxhdGVVcmw6ICdob3N0LXNldHRpbmdzLmNvbXBvbmVudC5odG1sJyxcbiAgICBob3N0OiB7XG4gICAgICAgICdjbGFzcyc6ICdhZGYtaG9zdC1zZXR0aW5ncydcbiAgICB9LFxuICAgIHN0eWxlVXJsczogWydob3N0LXNldHRpbmdzLmNvbXBvbmVudC5zY3NzJ10sXG4gICAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZVxufSlcbmV4cG9ydCBjbGFzcyBIb3N0U2V0dGluZ3NDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gICAgSE9TVF9SRUdFWDogc3RyaW5nID0gJ14oaHR0cHxodHRwcyk6XFwvXFwvLipbXi9dJCc7XG5cbiAgICAvKipcbiAgICAgKiBUZWxscyB0aGUgY29tcG9uZW50IHdoaWNoIHByb3ZpZGVyIG9wdGlvbnMgYXJlIGF2YWlsYWJsZS4gUG9zc2libGUgdmFsaWQgdmFsdWVzXG4gICAgICogYXJlIFwiRUNNXCIgKENvbnRlbnQpLCBcIkJQTVwiIChQcm9jZXNzKSAsIFwiQUxMXCIgKENvbnRlbnQgYW5kIFByb2Nlc3MpLCAnT0FVVEgyJyBTU08uXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBwcm92aWRlcnM6IHN0cmluZ1tdID0gWydCUE0nLCAnRUNNJywgJ0FMTCddO1xuXG4gICAgc2hvd1NlbGVjdFByb3ZpZGVycyA9IHRydWU7XG5cbiAgICBmb3JtOiBGb3JtR3JvdXA7XG5cbiAgICAvKiogRW1pdHRlZCB3aGVuIHRoZSBVUkwgaXMgaW52YWxpZC4gKi9cbiAgICBAT3V0cHV0KClcbiAgICBlcnJvciA9IG5ldyBFdmVudEVtaXR0ZXI8c3RyaW5nPigpO1xuXG4gICAgLyoqIEVtaXR0ZWQgd2hlbiB0aGUgdXNlciBjYW5jZWxzIHRoZSBjaGFuZ2VzLiAqL1xuICAgIEBPdXRwdXQoKVxuICAgIGNhbmNlbCA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oKTtcblxuICAgIC8qKiBFbWl0dGVkIHdoZW4gdGhlIGNoYW5nZXMgYXJlIHN1Y2Nlc3NmdWxseSBhcHBsaWVkLiAqL1xuICAgIEBPdXRwdXQoKVxuICAgIHN1Y2Nlc3MgPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KCk7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGZvcm1CdWlsZGVyOiBGb3JtQnVpbGRlcixcbiAgICAgICAgICAgICAgICBwcml2YXRlIHN0b3JhZ2VTZXJ2aWNlOiBTdG9yYWdlU2VydmljZSxcbiAgICAgICAgICAgICAgICBwcml2YXRlIGFsZnJlc2NvQXBpU2VydmljZTogQWxmcmVzY29BcGlTZXJ2aWNlLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgYXBwQ29uZmlnOiBBcHBDb25maWdTZXJ2aWNlKSB7XG4gICAgfVxuXG4gICAgbmdPbkluaXQoKSB7XG4gICAgICAgIGlmICh0aGlzLnByb3ZpZGVycy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIHRoaXMuc2hvd1NlbGVjdFByb3ZpZGVycyA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcHJvdmlkZXJTZWxlY3RlZCA9IHRoaXMuYXBwQ29uZmlnLmdldDxzdHJpbmc+KEFwcENvbmZpZ1ZhbHVlcy5QUk9WSURFUlMpO1xuXG4gICAgICAgIGNvbnN0IGF1dGhUeXBlID0gdGhpcy5hcHBDb25maWcuZ2V0PHN0cmluZz4oQXBwQ29uZmlnVmFsdWVzLkFVVEhUWVBFLCAnQkFTSUMnKTtcblxuICAgICAgICB0aGlzLmZvcm0gPSB0aGlzLmZvcm1CdWlsZGVyLmdyb3VwKHtcbiAgICAgICAgICAgIHByb3ZpZGVyc0NvbnRyb2w6IFtwcm92aWRlclNlbGVjdGVkLCBWYWxpZGF0b3JzLnJlcXVpcmVkXSxcbiAgICAgICAgICAgIGF1dGhUeXBlOiBhdXRoVHlwZVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmFkZEZvcm1Hcm91cHMoKTtcblxuICAgICAgICBpZiAoYXV0aFR5cGUgPT09ICdPQVVUSCcpIHtcbiAgICAgICAgICAgIHRoaXMuYWRkT0F1dGhGb3JtR3JvdXAoKTtcbiAgICAgICAgICAgIHRoaXMuYWRkSWRlbnRpdHlIb3N0Rm9ybUNvbnRyb2woKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZm9ybS5nZXQoJ2F1dGhUeXBlJykudmFsdWVDaGFuZ2VzLnN1YnNjcmliZSgodmFsdWUpID0+IHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gJ0JBU0lDJykge1xuICAgICAgICAgICAgICAgIHRoaXMuZm9ybS5yZW1vdmVDb250cm9sKCdvYXV0aENvbmZpZycpO1xuICAgICAgICAgICAgICAgIHRoaXMuZm9ybS5yZW1vdmVDb250cm9sKCdpZGVudGl0eUhvc3QnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGRPQXV0aEZvcm1Hcm91cCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkSWRlbnRpdHlIb3N0Rm9ybUNvbnRyb2woKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5wcm92aWRlcnNDb250cm9sLnZhbHVlQ2hhbmdlcy5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVGb3JtR3JvdXBzKCk7XG4gICAgICAgICAgICB0aGlzLmFkZEZvcm1Hcm91cHMoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZW1vdmVGb3JtR3JvdXBzKCkge1xuICAgICAgICB0aGlzLmZvcm0ucmVtb3ZlQ29udHJvbCgnYnBtSG9zdCcpO1xuICAgICAgICB0aGlzLmZvcm0ucmVtb3ZlQ29udHJvbCgnZWNtSG9zdCcpO1xuICAgIH1cblxuICAgIHByaXZhdGUgYWRkRm9ybUdyb3VwcygpIHtcbiAgICAgICAgdGhpcy5hZGRCUE1Gb3JtQ29udHJvbCgpO1xuICAgICAgICB0aGlzLmFkZEVDTUZvcm1Db250cm9sKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhZGRPQXV0aEZvcm1Hcm91cCgpIHtcbiAgICAgICAgY29uc3Qgb2F1dGhGb3JtR3JvdXAgPSB0aGlzLmNyZWF0ZU9BdXRoRm9ybUdyb3VwKCk7XG4gICAgICAgIHRoaXMuZm9ybS5hZGRDb250cm9sKCdvYXV0aENvbmZpZycsIG9hdXRoRm9ybUdyb3VwKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFkZEJQTUZvcm1Db250cm9sKCkge1xuICAgICAgICBpZiAoKHRoaXMuaXNCUE0oKSB8fCB0aGlzLmlzQUxMKCkgfHwgdGhpcy5pc09BVVRIKCkpICYmICF0aGlzLmJwbUhvc3QpIHtcbiAgICAgICAgICAgIGNvbnN0IGJwbUZvcm1Db250cm9sID0gdGhpcy5jcmVhdGVCUE1Gb3JtQ29udHJvbCgpO1xuICAgICAgICAgICAgdGhpcy5mb3JtLmFkZENvbnRyb2woJ2JwbUhvc3QnLCBicG1Gb3JtQ29udHJvbCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGFkZElkZW50aXR5SG9zdEZvcm1Db250cm9sKCkge1xuICAgICAgICBjb25zdCBpZGVudGl0eUhvc3RGb3JtQ29udHJvbCA9IHRoaXMuY3JlYXRlSWRlbnRpdHlGb3JtQ29udHJvbCgpO1xuICAgICAgICB0aGlzLmZvcm0uYWRkQ29udHJvbCgnaWRlbnRpdHlIb3N0JywgaWRlbnRpdHlIb3N0Rm9ybUNvbnRyb2wpO1xuICAgIH1cblxuICAgIHByaXZhdGUgYWRkRUNNRm9ybUNvbnRyb2woKSB7XG4gICAgICAgIGlmICgodGhpcy5pc0VDTSgpIHx8IHRoaXMuaXNBTEwoKSkgJiYgIXRoaXMuZWNtSG9zdCkge1xuICAgICAgICAgICAgY29uc3QgZWNtRm9ybUNvbnRyb2wgPSB0aGlzLmNyZWF0ZUVDTUZvcm1Db250cm9sKCk7XG4gICAgICAgICAgICB0aGlzLmZvcm0uYWRkQ29udHJvbCgnZWNtSG9zdCcsIGVjbUZvcm1Db250cm9sKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlT0F1dGhGb3JtR3JvdXAoKTogQWJzdHJhY3RDb250cm9sIHtcbiAgICAgICAgY29uc3Qgb2F1dGggPSA8T2F1dGhDb25maWdNb2RlbD4gdGhpcy5hcHBDb25maWcuZ2V0KEFwcENvbmZpZ1ZhbHVlcy5PQVVUSENPTkZJRywge30pO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmZvcm1CdWlsZGVyLmdyb3VwKHtcbiAgICAgICAgICAgIGhvc3Q6IFtvYXV0aC5ob3N0LCBbVmFsaWRhdG9ycy5yZXF1aXJlZCwgVmFsaWRhdG9ycy5wYXR0ZXJuKHRoaXMuSE9TVF9SRUdFWCldXSxcbiAgICAgICAgICAgIGNsaWVudElkOiBbb2F1dGguY2xpZW50SWQsIFZhbGlkYXRvcnMucmVxdWlyZWRdLFxuICAgICAgICAgICAgcmVkaXJlY3RVcmk6IFtvYXV0aC5yZWRpcmVjdFVyaSwgVmFsaWRhdG9ycy5yZXF1aXJlZF0sXG4gICAgICAgICAgICByZWRpcmVjdFVyaUxvZ291dDogW29hdXRoLnJlZGlyZWN0VXJpTG9nb3V0XSxcbiAgICAgICAgICAgIHNjb3BlOiBbb2F1dGguc2NvcGUsIFZhbGlkYXRvcnMucmVxdWlyZWRdLFxuICAgICAgICAgICAgc2VjcmV0OiBvYXV0aC5zZWNyZXQsXG4gICAgICAgICAgICBzaWxlbnRMb2dpbjogb2F1dGguc2lsZW50TG9naW4sXG4gICAgICAgICAgICBpbXBsaWNpdEZsb3c6IG9hdXRoLmltcGxpY2l0RmxvdyxcbiAgICAgICAgICAgIHB1YmxpY1VybHM6IFtvYXV0aC5wdWJsaWNVcmxzXVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZUJQTUZvcm1Db250cm9sKCk6IEFic3RyYWN0Q29udHJvbCB7XG4gICAgICAgIHJldHVybiBuZXcgRm9ybUNvbnRyb2wodGhpcy5hcHBDb25maWcuZ2V0PHN0cmluZz4oQXBwQ29uZmlnVmFsdWVzLkJQTUhPU1QpLCBbVmFsaWRhdG9ycy5yZXF1aXJlZCwgVmFsaWRhdG9ycy5wYXR0ZXJuKHRoaXMuSE9TVF9SRUdFWCldKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZUlkZW50aXR5Rm9ybUNvbnRyb2woKTogQWJzdHJhY3RDb250cm9sIHtcbiAgICAgICAgcmV0dXJuIG5ldyBGb3JtQ29udHJvbCh0aGlzLmFwcENvbmZpZy5nZXQ8c3RyaW5nPihBcHBDb25maWdWYWx1ZXMuSURFTlRJVFlfSE9TVCksIFtWYWxpZGF0b3JzLnJlcXVpcmVkLCBWYWxpZGF0b3JzLnBhdHRlcm4odGhpcy5IT1NUX1JFR0VYKV0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlRUNNRm9ybUNvbnRyb2woKTogQWJzdHJhY3RDb250cm9sIHtcbiAgICAgICAgcmV0dXJuIG5ldyBGb3JtQ29udHJvbCh0aGlzLmFwcENvbmZpZy5nZXQ8c3RyaW5nPihBcHBDb25maWdWYWx1ZXMuRUNNSE9TVCksIFtWYWxpZGF0b3JzLnJlcXVpcmVkLCBWYWxpZGF0b3JzLnBhdHRlcm4odGhpcy5IT1NUX1JFR0VYKV0pO1xuICAgIH1cblxuICAgIG9uQ2FuY2VsKCkge1xuICAgICAgICB0aGlzLmNhbmNlbC5lbWl0KHRydWUpO1xuICAgIH1cblxuICAgIG9uU3VibWl0KHZhbHVlczogYW55KSB7XG4gICAgICAgIHRoaXMuc3RvcmFnZVNlcnZpY2Uuc2V0SXRlbShBcHBDb25maWdWYWx1ZXMuUFJPVklERVJTLCB2YWx1ZXMucHJvdmlkZXJzQ29udHJvbCk7XG5cbiAgICAgICAgaWYgKHRoaXMuaXNCUE0oKSkge1xuICAgICAgICAgICAgdGhpcy5zYXZlQlBNVmFsdWVzKHZhbHVlcyk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5pc0VDTSgpKSB7XG4gICAgICAgICAgICB0aGlzLnNhdmVFQ01WYWx1ZXModmFsdWVzKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmlzQUxMKCkpIHtcbiAgICAgICAgICAgIHRoaXMuc2F2ZUVDTVZhbHVlcyh2YWx1ZXMpO1xuICAgICAgICAgICAgdGhpcy5zYXZlQlBNVmFsdWVzKHZhbHVlcyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5pc09BVVRIKCkpIHtcbiAgICAgICAgICAgIHRoaXMuc2F2ZU9BdXRoVmFsdWVzKHZhbHVlcyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnN0b3JhZ2VTZXJ2aWNlLnNldEl0ZW0oQXBwQ29uZmlnVmFsdWVzLkFVVEhUWVBFLCB2YWx1ZXMuYXV0aFR5cGUpO1xuXG4gICAgICAgIHRoaXMuYWxmcmVzY29BcGlTZXJ2aWNlLnJlc2V0KCk7XG4gICAgICAgIHRoaXMuYWxmcmVzY29BcGlTZXJ2aWNlLmdldEluc3RhbmNlKCkuaW52YWxpZGF0ZVNlc3Npb24oKTtcbiAgICAgICAgdGhpcy5zdWNjZXNzLmVtaXQodHJ1ZSk7XG4gICAgfVxuXG4gICAga2V5RG93bkZ1bmN0aW9uKGV2ZW50OiBhbnkpIHtcbiAgICAgICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IEVOVEVSICYmIHRoaXMuZm9ybS52YWxpZCkge1xuICAgICAgICAgICAgdGhpcy5vblN1Ym1pdCh0aGlzLmZvcm0udmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzYXZlT0F1dGhWYWx1ZXModmFsdWVzOiBhbnkpIHtcbiAgICAgICAgaWYgKHZhbHVlcy5vYXV0aENvbmZpZy5wdWJsaWNVcmxzICYmICh0eXBlb2YgdmFsdWVzLm9hdXRoQ29uZmlnLnB1YmxpY1VybHMgPT09ICdzdHJpbmcnKSkge1xuICAgICAgICAgICAgdmFsdWVzLm9hdXRoQ29uZmlnLnB1YmxpY1VybHMgPSB2YWx1ZXMub2F1dGhDb25maWcucHVibGljVXJscy5zcGxpdCgnLCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zdG9yYWdlU2VydmljZS5zZXRJdGVtKEFwcENvbmZpZ1ZhbHVlcy5PQVVUSENPTkZJRywgSlNPTi5zdHJpbmdpZnkodmFsdWVzLm9hdXRoQ29uZmlnKSk7XG4gICAgICAgIHRoaXMuc3RvcmFnZVNlcnZpY2Uuc2V0SXRlbShBcHBDb25maWdWYWx1ZXMuSURFTlRJVFlfSE9TVCwgdmFsdWVzLmlkZW50aXR5SG9zdCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzYXZlQlBNVmFsdWVzKHZhbHVlczogYW55KSB7XG4gICAgICAgIHRoaXMuc3RvcmFnZVNlcnZpY2Uuc2V0SXRlbShBcHBDb25maWdWYWx1ZXMuQlBNSE9TVCwgdmFsdWVzLmJwbUhvc3QpO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2F2ZUVDTVZhbHVlcyh2YWx1ZXM6IGFueSkge1xuICAgICAgICB0aGlzLnN0b3JhZ2VTZXJ2aWNlLnNldEl0ZW0oQXBwQ29uZmlnVmFsdWVzLkVDTUhPU1QsIHZhbHVlcy5lY21Ib3N0KTtcbiAgICB9XG5cbiAgICBpc0JQTSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvdmlkZXJzQ29udHJvbC52YWx1ZSA9PT0gJ0JQTSc7XG4gICAgfVxuXG4gICAgaXNFQ00oKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnByb3ZpZGVyc0NvbnRyb2wudmFsdWUgPT09ICdFQ00nO1xuICAgIH1cblxuICAgIGlzQUxMKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5wcm92aWRlcnNDb250cm9sLnZhbHVlID09PSAnQUxMJztcbiAgICB9XG5cbiAgICBpc09BVVRIKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5mb3JtLmdldCgnYXV0aFR5cGUnKS52YWx1ZSA9PT0gJ09BVVRIJztcbiAgICB9XG5cbiAgICBnZXQgcHJvdmlkZXJzQ29udHJvbCgpOiBBYnN0cmFjdENvbnRyb2wge1xuICAgICAgICByZXR1cm4gdGhpcy5mb3JtLmdldCgncHJvdmlkZXJzQ29udHJvbCcpO1xuICAgIH1cblxuICAgIGdldCBicG1Ib3N0KCk6IEFic3RyYWN0Q29udHJvbCB7XG4gICAgICAgIHJldHVybiB0aGlzLmZvcm0uZ2V0KCdicG1Ib3N0Jyk7XG4gICAgfVxuXG4gICAgZ2V0IGVjbUhvc3QoKTogQWJzdHJhY3RDb250cm9sIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZm9ybS5nZXQoJ2VjbUhvc3QnKTtcbiAgICB9XG5cbiAgICBnZXQgaG9zdCgpOiBBYnN0cmFjdENvbnRyb2wge1xuICAgICAgICByZXR1cm4gdGhpcy5vYXV0aENvbmZpZy5nZXQoJ2hvc3QnKTtcbiAgICB9XG5cbiAgICBnZXQgaWRlbnRpdHlIb3N0KCk6IEFic3RyYWN0Q29udHJvbCB7XG4gICAgICAgIHJldHVybiB0aGlzLmZvcm0uZ2V0KCdpZGVudGl0eUhvc3QnKTtcbiAgICB9XG5cbiAgICBnZXQgY2xpZW50SWQoKTogQWJzdHJhY3RDb250cm9sIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub2F1dGhDb25maWcuZ2V0KCdjbGllbnRJZCcpO1xuICAgIH1cblxuICAgIGdldCBzY29wZSgpOiBBYnN0cmFjdENvbnRyb2wge1xuICAgICAgICByZXR1cm4gdGhpcy5vYXV0aENvbmZpZy5nZXQoJ3Njb3BlJyk7XG4gICAgfVxuXG4gICAgZ2V0IHNlY3JldElkKCk6IEFic3RyYWN0Q29udHJvbCB7XG4gICAgICAgIHJldHVybiB0aGlzLm9hdXRoQ29uZmlnLmdldCgnc2VjcmV0SWQnKTtcbiAgICB9XG5cbiAgICBnZXQgaW1wbGljaXRGbG93KCk6IEFic3RyYWN0Q29udHJvbCB7XG4gICAgICAgIHJldHVybiB0aGlzLm9hdXRoQ29uZmlnLmdldCgnaW1wbGljaXRGbG93Jyk7XG4gICAgfVxuXG4gICAgZ2V0IHNpbGVudExvZ2luKCk6IEFic3RyYWN0Q29udHJvbCB7XG4gICAgICAgIHJldHVybiB0aGlzLm9hdXRoQ29uZmlnLmdldCgnc2lsZW50TG9naW4nKTtcbiAgICB9XG5cbiAgICBnZXQgcmVkaXJlY3RVcmkoKTogQWJzdHJhY3RDb250cm9sIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub2F1dGhDb25maWcuZ2V0KCdyZWRpcmVjdFVyaScpO1xuICAgIH1cblxuICAgIGdldCBwdWJsaWNVcmxzKCk6IEFic3RyYWN0Q29udHJvbCB7XG4gICAgICAgIHJldHVybiB0aGlzLm9hdXRoQ29uZmlnLmdldCgncHVibGljVXJscycpO1xuICAgIH1cblxuICAgIGdldCByZWRpcmVjdFVyaUxvZ291dCgpOiBBYnN0cmFjdENvbnRyb2wge1xuICAgICAgICByZXR1cm4gdGhpcy5vYXV0aENvbmZpZy5nZXQoJ3JlZGlyZWN0VXJpTG9nb3V0Jyk7XG4gICAgfVxuXG4gICAgZ2V0IG9hdXRoQ29uZmlnKCk6IEFic3RyYWN0Q29udHJvbCB7XG4gICAgICAgIHJldHVybiB0aGlzLmZvcm0uZ2V0KCdvYXV0aENvbmZpZycpO1xuICAgIH1cblxufVxuIl19
