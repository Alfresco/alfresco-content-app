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
  Input,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { AuthenticationService } from '../../services/authentication.service';
import { LogService } from '../../services/log.service';
import { TranslationService } from '../../services/translation.service';
import { UserPreferencesService } from '../../services/user-preferences.service';
import { LoginErrorEvent } from '../models/login-error.event';
import { LoginSubmitEvent } from '../models/login-submit.event';
import { LoginSuccessEvent } from '../models/login-success.event';
import {
  AppConfigService,
  AppConfigValues
} from '../../app-config/app-config.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
/** @enum {number} */
const LoginSteps = {
  Landing: 0,
  Checking: 1,
  Welcome: 2
};
LoginSteps[LoginSteps.Landing] = 'Landing';
LoginSteps[LoginSteps.Checking] = 'Checking';
LoginSteps[LoginSteps.Welcome] = 'Welcome';
/**
 * @record
 */
function ValidationMessage() {}
if (false) {
  /** @type {?} */
  ValidationMessage.prototype.value;
  /** @type {?|undefined} */
  ValidationMessage.prototype.params;
}
export class LoginComponent {
  /**
   * Constructor
   * @param {?} _fb
   * @param {?} authService
   * @param {?} translateService
   * @param {?} logService
   * @param {?} router
   * @param {?} appConfig
   * @param {?} userPreferences
   * @param {?} location
   * @param {?} route
   * @param {?} sanitizer
   */
  constructor(
    _fb,
    authService,
    translateService,
    logService,
    router,
    appConfig,
    userPreferences,
    location,
    route,
    sanitizer
  ) {
    this._fb = _fb;
    this.authService = authService;
    this.translateService = translateService;
    this.logService = logService;
    this.router = router;
    this.appConfig = appConfig;
    this.userPreferences = userPreferences;
    this.location = location;
    this.route = route;
    this.sanitizer = sanitizer;
    this.isPasswordShow = false;
    /**
     * Should the `Remember me` checkbox be shown? When selected, this
     * option will remember the logged-in user after the browser is closed
     * to avoid logging in repeatedly.
     */
    this.showRememberMe = true;
    /**
     * Should the extra actions (`Need Help`, `Register`, etc) be shown?
     */
    this.showLoginActions = true;
    /**
     * Sets the URL of the NEED HELP link in the footer.
     */
    this.needHelpLink = '';
    /**
     * Sets the URL of the REGISTER link in the footer.
     */
    this.registerLink = '';
    /**
     * Path to a custom logo image.
     */
    this.logoImageUrl = './assets/images/alfresco-logo.svg';
    /**
     * Path to a custom background image.
     */
    this.backgroundImageUrl = './assets/images/background.svg';
    /**
     * The copyright text below the login box.
     */
    this.copyrightText =
      '\u00A9 2016 Alfresco Software, Inc. All Rights Reserved.';
    /**
     * Route to redirect to on successful login.
     */
    this.successRoute = null;
    /**
     * Emitted when the login is successful.
     */
    this.success = new EventEmitter();
    /**
     * Emitted when the login fails.
     */
    this.error = new EventEmitter();
    /**
     * Emitted when the login form is submitted.
     */
    this.executeSubmit = new EventEmitter();
    this.implicitFlow = false;
    this.isError = false;
    this.actualLoginStep = LoginSteps.Landing;
    this.LoginSteps = LoginSteps;
    this.rememberMe = true;
    this.minLength = 2;
    this.onDestroy$ = new Subject();
    this.initFormError();
    this.initFormFieldsMessages();
  }
  /**
   * @return {?}
   */
  ngOnInit() {
    if (this.authService.isOauth()) {
      /** @type {?} */
      const oauth = this.appConfig.get(AppConfigValues.OAUTHCONFIG, null);
      if (oauth && oauth.implicitFlow) {
        this.implicitFlow = true;
      }
    }
    if (this.authService.isEcmLoggedIn() || this.authService.isBpmLoggedIn()) {
      this.location.forward();
    } else {
      this.route.queryParams.subscribe(
        /**
         * @param {?} params
         * @return {?}
         */
        params => {
          /** @type {?} */
          const url = params['redirectUrl'];
          /** @type {?} */
          const provider = this.appConfig.get(AppConfigValues.PROVIDERS);
          this.authService.setRedirect({ provider, url });
        }
      );
    }
    if (this.hasCustomFieldsValidation()) {
      this.form = this._fb.group(this.fieldsValidation);
    } else {
      this.initFormFieldsDefault();
      this.initFormFieldsMessagesDefault();
    }
    this.form.valueChanges.pipe(takeUntil(this.onDestroy$)).subscribe(
      /**
       * @param {?} data
       * @return {?}
       */
      data => this.onValueChanged(data)
    );
  }
  /**
   * @return {?}
   */
  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }
  /**
   * @return {?}
   */
  submit() {
    this.onSubmit(this.form.value);
  }
  /**
   * Method called on submit form
   * @param {?} values
   * @return {?}
   */
  onSubmit(values) {
    this.disableError();
    /** @type {?} */
    const args = new LoginSubmitEvent({
      controls: { username: this.form.controls.username }
    });
    this.executeSubmit.emit(args);
    if (!args.defaultPrevented) {
      this.performLogin(values);
    }
  }
  /**
   * @return {?}
   */
  implicitLogin() {
    this.authService.ssoImplicitLogin();
  }
  /**
   * The method check the error in the form and push the error in the formError object
   * @param {?} data
   * @return {?}
   */
  onValueChanged(data) {
    this.disableError();
    for (const field in this.formError) {
      if (field) {
        this.formError[field] = '';
        /** @type {?} */
        const hasError =
          (this.form.controls[field].errors && data[field] !== '') ||
          (this.form.controls[field].dirty && !this.form.controls[field].valid);
        if (hasError) {
          for (const key in this.form.controls[field].errors) {
            if (key) {
              /** @type {?} */
              const message = this._message[field][key];
              if (message && message.value) {
                /** @type {?} */
                const translated = this.translateService.instant(
                  message.value,
                  message.params
                );
                this.formError[field] += translated;
              }
            }
          }
        }
      }
    }
  }
  /**
   * @private
   * @param {?} values
   * @return {?}
   */
  performLogin(values) {
    this.actualLoginStep = LoginSteps.Checking;
    this.authService
      .login(values.username, values.password, this.rememberMe)
      .subscribe(
        /**
         * @param {?} token
         * @return {?}
         */
        token => {
          /** @type {?} */
          const redirectUrl = this.authService.getRedirect();
          this.actualLoginStep = LoginSteps.Welcome;
          this.userPreferences.setStoragePrefix(values.username);
          values.password = null;
          this.success.emit(
            new LoginSuccessEvent(token, values.username, null)
          );
          if (redirectUrl) {
            this.authService.setRedirect(null);
            this.router.navigateByUrl(redirectUrl);
          } else if (this.successRoute) {
            this.router.navigate([this.successRoute]);
          }
        }
        /**
         * @param {?} err
         * @return {?}
         */,
        err => {
          this.actualLoginStep = LoginSteps.Landing;
          this.displayErrorMessage(err);
          this.isError = true;
          this.error.emit(new LoginErrorEvent(err));
        }
        /**
         * @return {?}
         */,
        () => this.logService.info('Login done')
      );
  }
  /**
   * Check and display the right error message in the UI
   * @private
   * @param {?} err
   * @return {?}
   */
  displayErrorMessage(err) {
    if (
      err.error &&
      err.error.crossDomain &&
      err.error.message.indexOf('Access-Control-Allow-Origin') !== -1
    ) {
      this.errorMsg = err.error.message;
    } else if (
      err.status === 403 &&
      err.message.indexOf('Invalid CSRF-token') !== -1
    ) {
      this.errorMsg = 'LOGIN.MESSAGES.LOGIN-ERROR-CSRF';
    } else if (
      err.status === 403 &&
      err.message.indexOf('The system is currently in read-only mode') !== -1
    ) {
      this.errorMsg = 'LOGIN.MESSAGES.LOGIN-ECM-LICENSE';
    } else {
      this.errorMsg = 'LOGIN.MESSAGES.LOGIN-ERROR-CREDENTIALS';
    }
  }
  /**
   * Add a custom form error for a field
   * @param {?} field
   * @param {?} msg
   * @return {?}
   */
  addCustomFormError(field, msg) {
    this.formError[field] += msg;
  }
  /**
   * Add a custom validation rule error for a field
   * @param {?} field
   * @param {?} ruleId - i.e. required | minlength | maxlength
   * @param {?} msg
   * @param {?=} params
   * @return {?}
   */
  addCustomValidationError(field, ruleId, msg, params) {
    this._message[field][ruleId] = {
      value: msg,
      params
    };
  }
  /**
   * Display and hide the password value.
   * @param {?} event
   * @return {?}
   */
  toggleShowPassword(event) {
    event.stopPropagation();
    this.isPasswordShow = !this.isPasswordShow;
  }
  /**
   * The method return if a field is valid or not
   * @param {?} field
   * @return {?}
   */
  isErrorStyle(field) {
    return !field.valid && field.dirty && !field.pristine;
  }
  /**
   * Trim username
   * @param {?} event
   * @return {?}
   */
  trimUsername(event) {
    event.target.value = event.target.value.trim();
  }
  /**
   * @return {?}
   */
  getBackgroundUrlImageUrl() {
    return this.sanitizer.bypassSecurityTrustStyle(
      `url(${this.backgroundImageUrl})`
    );
  }
  /**
   * Default formError values
   * @private
   * @return {?}
   */
  initFormError() {
    this.formError = {
      username: '',
      password: ''
    };
  }
  /**
   * Init form fields messages
   * @private
   * @return {?}
   */
  initFormFieldsMessages() {
    this._message = {
      username: {},
      password: {}
    };
  }
  /**
   * Default form fields messages
   * @private
   * @return {?}
   */
  initFormFieldsMessagesDefault() {
    this._message = {
      username: {
        required: {
          value: 'LOGIN.MESSAGES.USERNAME-REQUIRED'
        },
        minLength: {
          value: 'LOGIN.MESSAGES.USERNAME-MIN',
          params: {
            /**
             * @return {?}
             */
            get minLength() {
              return this.minLength;
            }
          }
        }
      },
      password: {
        required: {
          value: 'LOGIN.MESSAGES.PASSWORD-REQUIRED'
        }
      }
    };
  }
  /**
   * @private
   * @return {?}
   */
  initFormFieldsDefault() {
    this.form = this._fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  /**
   * Disable the error flag
   * @private
   * @return {?}
   */
  disableError() {
    this.isError = false;
    this.initFormError();
  }
  /**
   * @private
   * @return {?}
   */
  hasCustomFieldsValidation() {
    return this.fieldsValidation !== undefined;
  }
}
LoginComponent.decorators = [
  {
    type: Component,
    args: [
      {
        selector: 'adf-login',
        template:
          '<div class="adf-login-content" [style.background-image]="getBackgroundUrlImageUrl()">\n    <div class="adf-ie11FixerParent">\n        <div class="adf-ie11FixerChild">\n\n            <mat-card class="adf-login-card-wide">\n                <form id="adf-login-form" [formGroup]="form" (submit)="onSubmit(form.value)" autocomplete="off">\n                    <mat-card-header>\n                        <mat-card-title>\n                            <div class="adf-alfresco-logo">\n                                <!--HEADER TEMPLATE-->\n                                <ng-template *ngIf="headerTemplate"\n                                             ngFor [ngForOf]="[data]"\n                                             [ngForTemplate]="headerTemplate">\n                                </ng-template>\n                                <img *ngIf="!headerTemplate" id="adf-login-img-logo" class="adf-img-logo" [src]="logoImageUrl"\n                                     alt="{{\'LOGIN.LOGO\' | translate }}">\n                            </div>\n                        </mat-card-title>\n                    </mat-card-header>\n\n                    <mat-card-content class="adf-login-controls">\n\n                        <!--ERRORS AREA-->\n                        <div class="adf-error-container">\n                            <div *ngIf="isError" id="login-error" data-automation-id="login-error"\n                                 class="adf-error  adf-error-message">\n                                <mat-icon class="adf-error-icon">warning</mat-icon>\n                                <span class="adf-login-error-message">{{errorMsg | translate }}</span>\n                            </div>\n                        </div>\n\n                        <div *ngIf="!implicitFlow">\n\n                            <!--USERNAME FIELD-->\n                            <div class="adf-login__field"\n                                 [ngClass]="{\'adf-is-invalid\': isErrorStyle(form.controls.username)}">\n                                <mat-form-field class="adf-full-width" floatPlaceholder="never" color="primary">\n                                    <input matInput placeholder="{{\'LOGIN.LABEL.USERNAME\' | translate }}"\n                                           type="text"\n                                           class="adf-full-width"\n                                           [formControl]="form.controls[\'username\']"\n                                           autocapitalize="none"\n                                           id="username"\n                                           data-automation-id="username"\n                                           (blur)="trimUsername($event)">\n                                </mat-form-field>\n\n                                <span class="adf-login-validation" for="username" *ngIf="formError[\'username\']">\n                                <span id="username-error" class="adf-login-error" data-automation-id="username-error">{{formError[\'username\'] | translate }}</span>\n                            </span>\n                            </div>\n\n                            <!--PASSWORD FIELD-->\n                            <div class="adf-login__field">\n                                <mat-form-field class="adf-full-width" floatPlaceholder="never" color="primary">\n                                    <input matInput placeholder="{{\'LOGIN.LABEL.PASSWORD\' | translate }}"\n                                           [type]="isPasswordShow ? \'text\' : \'password\'"\n                                           [formControl]="form.controls[\'password\']"\n                                           id="password"\n                                           data-automation-id="password">\n                                        <button\n                                            matSuffix\n                                            mat-icon-button\n                                            type="button"\n                                            [attr.aria-label]="(isPasswordShow ?\n                                                    \'LOGIN.ARIA-LABEL.HIDE-PASSWORD\':\n                                                    \'LOGIN.ARIA-LABEL.SHOW-PASSWORD\'\n                                                ) | translate"\n                                            (click)="toggleShowPassword($event)"\n                                            (keyup.enter)="toggleShowPassword($event)"\n                                            [attr.data-automation-id]="isPasswordShow ? \'hide_password\':\'show_password\'">\n                                           <mat-icon class="adf-login-password-icon">\n                                               {{ isPasswordShow ? \'visibility\':\'visibility_off\' }}\n                                            </mat-icon>\n                                       </button>\n                                </mat-form-field>\n                                <span class="adf-login-validation" for="password" *ngIf="formError[\'password\']">\n                                <span id="password-required" class="adf-login-error"\n                                      data-automation-id="password-required">{{formError[\'password\'] | translate }}</span>\n                            </span>\n                            </div>\n\n                            <!--CUSTOM CONTENT-->\n                            <ng-content></ng-content>\n\n                            <br>\n                            <button type="submit" id="login-button"\n                                    class="adf-login-button"\n                                    mat-raised-button color="primary"\n                                    [class.adf-isChecking]="actualLoginStep === LoginSteps.Checking"\n                                    [class.adf-isWelcome]="actualLoginStep === LoginSteps.Welcome"\n                                    data-automation-id="login-button" [disabled]="!form.valid"\n                                    [attr.aria-label]="\'LOGIN.BUTTON.LOGIN\' | translate">\n\n                                <span *ngIf="actualLoginStep === LoginSteps.Landing" class="adf-login-button-label">{{ \'LOGIN.BUTTON.LOGIN\' | translate }}</span>\n\n                                <div *ngIf="actualLoginStep === LoginSteps.Checking"\n                                     class="adf-interactive-login-label">\n                                    <span\n                                        class="adf-login-button-label">{{ \'LOGIN.BUTTON.CHECKING\' | translate }}</span>\n                                    <div class="adf-login-spinner-container">\n                                        <mat-spinner id="checking-spinner" class="adf-login-checking-spinner"\n                                                     [diameter]="25"></mat-spinner>\n                                    </div>\n                                </div>\n\n\n                                <div *ngIf="actualLoginStep === LoginSteps.Welcome" class="adf-interactive-login-label">\n                                    <span class="adf-login-button-label">{{ \'LOGIN.BUTTON.WELCOME\' | translate }}</span>\n                                    <mat-icon class="adf-welcome-icon">done</mat-icon>\n                                </div>\n\n                            </button>\n                            <div *ngIf="showRememberMe" class="adf-login__remember-me">\n                                <mat-checkbox id="adf-login-remember" color="primary" class="adf-login-remember-me"\n                                              [checked]="rememberMe"\n                                              (change)="rememberMe = !rememberMe">{{ \'LOGIN.LABEL.REMEMBER\' | translate }}\n                                </mat-checkbox>\n                            </div>\n                        </div>\n\n                        <div *ngIf="implicitFlow">\n                            <button type="button" (click)="implicitLogin()" id="login-button-sso"\n                                    [attr.aria-label]="\'LOGIN.BUTTON.SSO\' | translate"\n                                    class="adf-login-button"\n                                    mat-raised-button color="primary"\n                                    data-automation-id="login-button-sso">\n                                <span  class="adf-login-button-label">{{ \'LOGIN.BUTTON.SSO\' | translate }}</span>\n                            </button>\n                        </div>\n\n                    </mat-card-content>\n\n                    <mat-card-actions *ngIf="footerTemplate || showLoginActions">\n\n                        <div class="adf-login-action-container">\n                            <!--FOOTER TEMPLATE-->\n                            <ng-template *ngIf="footerTemplate"\n                                         ngFor [ngForOf]="[data]"\n                                         [ngForTemplate]="footerTemplate">\n                            </ng-template>\n                            <div class="adf-login-action" *ngIf="!footerTemplate && showLoginActions">\n                                <div id="adf-login-action-left" class="adf-login-action-left">\n                                    <a href="{{needHelpLink}}">{{\'LOGIN.ACTION.HELP\' | translate }}</a>\n                                </div>\n                                <div id="adf-login-action-right" class="adf-login-action-right">\n                                    <a href="{{registerLink}}">{{\'LOGIN.ACTION.REGISTER\' | translate }}</a>\n                                </div>\n                            </div>\n                        </div>\n                    </mat-card-actions>\n\n                </form>\n            </mat-card>\n\n            <div class="adf-copyright" data-automation-id="login-copyright">\n                {{ copyrightText }}\n            </div>\n\n        </div>\n    </div>\n</div>\n',
        encapsulation: ViewEncapsulation.None,
        host: {
          class: 'adf-login'
        },
        styles: ['']
      }
    ]
  }
];
/** @nocollapse */
LoginComponent.ctorParameters = () => [
  { type: FormBuilder },
  { type: AuthenticationService },
  { type: TranslationService },
  { type: LogService },
  { type: Router },
  { type: AppConfigService },
  { type: UserPreferencesService },
  { type: Location },
  { type: ActivatedRoute },
  { type: DomSanitizer }
];
LoginComponent.propDecorators = {
  showRememberMe: [{ type: Input }],
  showLoginActions: [{ type: Input }],
  needHelpLink: [{ type: Input }],
  registerLink: [{ type: Input }],
  logoImageUrl: [{ type: Input }],
  backgroundImageUrl: [{ type: Input }],
  copyrightText: [{ type: Input }],
  fieldsValidation: [{ type: Input }],
  successRoute: [{ type: Input }],
  success: [{ type: Output }],
  error: [{ type: Output }],
  executeSubmit: [{ type: Output }]
};
if (false) {
  /** @type {?} */
  LoginComponent.prototype.isPasswordShow;
  /**
   * Should the `Remember me` checkbox be shown? When selected, this
   * option will remember the logged-in user after the browser is closed
   * to avoid logging in repeatedly.
   * @type {?}
   */
  LoginComponent.prototype.showRememberMe;
  /**
   * Should the extra actions (`Need Help`, `Register`, etc) be shown?
   * @type {?}
   */
  LoginComponent.prototype.showLoginActions;
  /**
   * Sets the URL of the NEED HELP link in the footer.
   * @type {?}
   */
  LoginComponent.prototype.needHelpLink;
  /**
   * Sets the URL of the REGISTER link in the footer.
   * @type {?}
   */
  LoginComponent.prototype.registerLink;
  /**
   * Path to a custom logo image.
   * @type {?}
   */
  LoginComponent.prototype.logoImageUrl;
  /**
   * Path to a custom background image.
   * @type {?}
   */
  LoginComponent.prototype.backgroundImageUrl;
  /**
   * The copyright text below the login box.
   * @type {?}
   */
  LoginComponent.prototype.copyrightText;
  /**
   * Custom validation rules for the login form.
   * @type {?}
   */
  LoginComponent.prototype.fieldsValidation;
  /**
   * Route to redirect to on successful login.
   * @type {?}
   */
  LoginComponent.prototype.successRoute;
  /**
   * Emitted when the login is successful.
   * @type {?}
   */
  LoginComponent.prototype.success;
  /**
   * Emitted when the login fails.
   * @type {?}
   */
  LoginComponent.prototype.error;
  /**
   * Emitted when the login form is submitted.
   * @type {?}
   */
  LoginComponent.prototype.executeSubmit;
  /** @type {?} */
  LoginComponent.prototype.implicitFlow;
  /** @type {?} */
  LoginComponent.prototype.form;
  /** @type {?} */
  LoginComponent.prototype.isError;
  /** @type {?} */
  LoginComponent.prototype.errorMsg;
  /** @type {?} */
  LoginComponent.prototype.actualLoginStep;
  /** @type {?} */
  LoginComponent.prototype.LoginSteps;
  /** @type {?} */
  LoginComponent.prototype.rememberMe;
  /** @type {?} */
  LoginComponent.prototype.formError;
  /** @type {?} */
  LoginComponent.prototype.minLength;
  /** @type {?} */
  LoginComponent.prototype.footerTemplate;
  /** @type {?} */
  LoginComponent.prototype.headerTemplate;
  /** @type {?} */
  LoginComponent.prototype.data;
  /**
   * @type {?}
   * @private
   */
  LoginComponent.prototype._message;
  /**
   * @type {?}
   * @private
   */
  LoginComponent.prototype.onDestroy$;
  /**
   * @type {?}
   * @private
   */
  LoginComponent.prototype._fb;
  /**
   * @type {?}
   * @private
   */
  LoginComponent.prototype.authService;
  /**
   * @type {?}
   * @private
   */
  LoginComponent.prototype.translateService;
  /**
   * @type {?}
   * @private
   */
  LoginComponent.prototype.logService;
  /**
   * @type {?}
   * @private
   */
  LoginComponent.prototype.router;
  /**
   * @type {?}
   * @private
   */
  LoginComponent.prototype.appConfig;
  /**
   * @type {?}
   * @private
   */
  LoginComponent.prototype.userPreferences;
  /**
   * @type {?}
   * @private
   */
  LoginComponent.prototype.location;
  /**
   * @type {?}
   * @private
   */
  LoginComponent.prototype.route;
  /**
   * @type {?}
   * @private
   */
  LoginComponent.prototype.sanitizer;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGFsZnJlc2NvL2FkZi1jb3JlLyIsInNvdXJjZXMiOlsibG9naW4vY29tcG9uZW50cy9sb2dpbi5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsT0FBTyxFQUNILFNBQVMsRUFBRSxZQUFZLEVBQ3ZCLEtBQUssRUFBVSxNQUFNLEVBQWUsaUJBQWlCLEVBQ3hELE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBbUIsV0FBVyxFQUFhLFVBQVUsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3JGLE9BQU8sRUFBRSxNQUFNLEVBQUUsY0FBYyxFQUFVLE1BQU0saUJBQWlCLENBQUM7QUFDakUsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzNDLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLHVDQUF1QyxDQUFDO0FBQzlFLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUN4RCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQUN4RSxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSx5Q0FBeUMsQ0FBQztBQUVqRixPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDOUQsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFDaEUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFDbEUsT0FBTyxFQUNILGdCQUFnQixFQUNoQixlQUFlLEVBQ2xCLE1BQU0scUNBQXFDLENBQUM7QUFFN0MsT0FBTyxFQUFFLFlBQVksRUFBYSxNQUFNLDJCQUEyQixDQUFDO0FBQ3BFLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDL0IsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixD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QUlMLEtBQUs7K0JBSUwsS0FBSzsyQkFJTCxLQUFLO3NCQUlMLE1BQU07b0JBSU4sTUFBTTs0QkFJTixNQUFNOzs7O0lBbkRQLHdDQUFnQzs7Ozs7OztJQU9oQyx3Q0FDK0I7Ozs7O0lBRy9CLDBDQUNpQzs7Ozs7SUFHakMsc0NBQzBCOzs7OztJQUcxQixzQ0FDMEI7Ozs7O0lBRzFCLHNDQUMyRDs7Ozs7SUFHM0QsNENBQzhEOzs7OztJQUc5RCx1Q0FDbUY7Ozs7O0lBR25GLDBDQUNzQjs7Ozs7SUFHdEIsc0NBQzRCOzs7OztJQUc1QixpQ0FDZ0Q7Ozs7O0lBR2hELCtCQUM0Qzs7Ozs7SUFHNUMsdUNBQ3FEOztJQUVyRCxzQ0FBOEI7O0lBRTlCLDhCQUFnQjs7SUFDaEIsaUNBQXlCOztJQUN6QixrQ0FBaUI7O0lBQ2pCLHlDQUEwQzs7SUFDMUMsb0NBQXdCOztJQUN4QixvQ0FBMkI7O0lBQzNCLG1DQUFvQzs7SUFDcEMsbUNBQXNCOztJQUN0Qix3Q0FBaUM7O0lBQ2pDLHdDQUFpQzs7SUFDakMsOEJBQVU7Ozs7O0lBRVYsa0NBQXdFOzs7OztJQUN4RSxvQ0FBNEM7Ozs7O0lBU3hDLDZCQUF3Qjs7Ozs7SUFDeEIscUNBQTBDOzs7OztJQUMxQywwQ0FBNEM7Ozs7O0lBQzVDLG9DQUE4Qjs7Ozs7SUFDOUIsZ0NBQXNCOzs7OztJQUN0QixtQ0FBbUM7Ozs7O0lBQ25DLHlDQUErQzs7Ozs7SUFDL0Msa0NBQTBCOzs7OztJQUMxQiwrQkFBNkI7Ozs7O0lBQzdCLG1DQUErQiIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEFsZnJlc2NvIFNvZnR3YXJlLCBMdGQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7XG4gICAgQ29tcG9uZW50LCBFdmVudEVtaXR0ZXIsXG4gICAgSW5wdXQsIE9uSW5pdCwgT3V0cHV0LCBUZW1wbGF0ZVJlZiwgVmlld0VuY2Fwc3VsYXRpb24sIE9uRGVzdHJveVxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFic3RyYWN0Q29udHJvbCwgRm9ybUJ1aWxkZXIsIEZvcm1Hcm91cCwgVmFsaWRhdG9ycyB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IFJvdXRlciwgQWN0aXZhdGVkUm91dGUsIFBhcmFtcyB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBMb2NhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBBdXRoZW50aWNhdGlvblNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9hdXRoZW50aWNhdGlvbi5zZXJ2aWNlJztcbmltcG9ydCB7IExvZ1NlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9sb2cuc2VydmljZSc7XG5pbXBvcnQgeyBUcmFuc2xhdGlvblNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy90cmFuc2xhdGlvbi5zZXJ2aWNlJztcbmltcG9ydCB7IFVzZXJQcmVmZXJlbmNlc1NlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy91c2VyLXByZWZlcmVuY2VzLnNlcnZpY2UnO1xuXG5pbXBvcnQgeyBMb2dpbkVycm9yRXZlbnQgfSBmcm9tICcuLi9tb2RlbHMvbG9naW4tZXJyb3IuZXZlbnQnO1xuaW1wb3J0IHsgTG9naW5TdWJtaXRFdmVudCB9IGZyb20gJy4uL21vZGVscy9sb2dpbi1zdWJtaXQuZXZlbnQnO1xuaW1wb3J0IHsgTG9naW5TdWNjZXNzRXZlbnQgfSBmcm9tICcuLi9tb2RlbHMvbG9naW4tc3VjY2Vzcy5ldmVudCc7XG5pbXBvcnQge1xuICAgIEFwcENvbmZpZ1NlcnZpY2UsXG4gICAgQXBwQ29uZmlnVmFsdWVzXG59IGZyb20gJy4uLy4uL2FwcC1jb25maWcvYXBwLWNvbmZpZy5zZXJ2aWNlJztcbmltcG9ydCB7IE9hdXRoQ29uZmlnTW9kZWwgfSBmcm9tICcuLi8uLi9tb2RlbHMvb2F1dGgtY29uZmlnLm1vZGVsJztcbmltcG9ydCB7IERvbVNhbml0aXplciwgU2FmZVN0eWxlIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyB0YWtlVW50aWwgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmVudW0gTG9naW5TdGVwcyB7XG4gICAgTGFuZGluZyA9IDAsXG4gICAgQ2hlY2tpbmcgPSAxLFxuICAgIFdlbGNvbWUgPSAyXG59XG5cbmludGVyZmFjZSBWYWxpZGF0aW9uTWVzc2FnZSB7XG4gICAgdmFsdWU6IHN0cmluZztcbiAgICBwYXJhbXM/OiBhbnk7XG59XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnYWRmLWxvZ2luJyxcbiAgICB0ZW1wbGF0ZVVybDogJy4vbG9naW4uY29tcG9uZW50Lmh0bWwnLFxuICAgIHN0eWxlVXJsczogWycuL2xvZ2luLmNvbXBvbmVudC5zY3NzJ10sXG4gICAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgICBob3N0OiB7XG4gICAgICAgIGNsYXNzOiAnYWRmLWxvZ2luJ1xuICAgIH1cbn0pXG5leHBvcnQgY2xhc3MgTG9naW5Db21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gICAgaXNQYXNzd29yZFNob3c6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIC8qKlxuICAgICAqIFNob3VsZCB0aGUgYFJlbWVtYmVyIG1lYCBjaGVja2JveCBiZSBzaG93bj8gV2hlbiBzZWxlY3RlZCwgdGhpc1xuICAgICAqIG9wdGlvbiB3aWxsIHJlbWVtYmVyIHRoZSBsb2dnZWQtaW4gdXNlciBhZnRlciB0aGUgYnJvd3NlciBpcyBjbG9zZWRcbiAgICAgKiB0byBhdm9pZCBsb2dnaW5nIGluIHJlcGVhdGVkbHkuXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBzaG93UmVtZW1iZXJNZTogYm9vbGVhbiA9IHRydWU7XG5cbiAgICAvKiogU2hvdWxkIHRoZSBleHRyYSBhY3Rpb25zIChgTmVlZCBIZWxwYCwgYFJlZ2lzdGVyYCwgZXRjKSBiZSBzaG93bj8gKi9cbiAgICBASW5wdXQoKVxuICAgIHNob3dMb2dpbkFjdGlvbnM6IGJvb2xlYW4gPSB0cnVlO1xuXG4gICAgLyoqIFNldHMgdGhlIFVSTCBvZiB0aGUgTkVFRCBIRUxQIGxpbmsgaW4gdGhlIGZvb3Rlci4gKi9cbiAgICBASW5wdXQoKVxuICAgIG5lZWRIZWxwTGluazogc3RyaW5nID0gJyc7XG5cbiAgICAvKiogU2V0cyB0aGUgVVJMIG9mIHRoZSBSRUdJU1RFUiBsaW5rIGluIHRoZSBmb290ZXIuICovXG4gICAgQElucHV0KClcbiAgICByZWdpc3Rlckxpbms6IHN0cmluZyA9ICcnO1xuXG4gICAgLyoqIFBhdGggdG8gYSBjdXN0b20gbG9nbyBpbWFnZS4gKi9cbiAgICBASW5wdXQoKVxuICAgIGxvZ29JbWFnZVVybDogc3RyaW5nID0gJy4vYXNzZXRzL2ltYWdlcy9hbGZyZXNjby1sb2dvLnN2Zyc7XG5cbiAgICAvKiogUGF0aCB0byBhIGN1c3RvbSBiYWNrZ3JvdW5kIGltYWdlLiAqL1xuICAgIEBJbnB1dCgpXG4gICAgYmFja2dyb3VuZEltYWdlVXJsOiBzdHJpbmcgPSAnLi9hc3NldHMvaW1hZ2VzL2JhY2tncm91bmQuc3ZnJztcblxuICAgIC8qKiBUaGUgY29weXJpZ2h0IHRleHQgYmVsb3cgdGhlIGxvZ2luIGJveC4gKi9cbiAgICBASW5wdXQoKVxuICAgIGNvcHlyaWdodFRleHQ6IHN0cmluZyA9ICdcXHUwMEE5IDIwMTYgQWxmcmVzY28gU29mdHdhcmUsIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC4nO1xuXG4gICAgLyoqIEN1c3RvbSB2YWxpZGF0aW9uIHJ1bGVzIGZvciB0aGUgbG9naW4gZm9ybS4gKi9cbiAgICBASW5wdXQoKVxuICAgIGZpZWxkc1ZhbGlkYXRpb246IGFueTtcblxuICAgIC8qKiBSb3V0ZSB0byByZWRpcmVjdCB0byBvbiBzdWNjZXNzZnVsIGxvZ2luLiAqL1xuICAgIEBJbnB1dCgpXG4gICAgc3VjY2Vzc1JvdXRlOiBzdHJpbmcgPSBudWxsO1xuXG4gICAgLyoqIEVtaXR0ZWQgd2hlbiB0aGUgbG9naW4gaXMgc3VjY2Vzc2Z1bC4gKi9cbiAgICBAT3V0cHV0KClcbiAgICBzdWNjZXNzID0gbmV3IEV2ZW50RW1pdHRlcjxMb2dpblN1Y2Nlc3NFdmVudD4oKTtcblxuICAgIC8qKiBFbWl0dGVkIHdoZW4gdGhlIGxvZ2luIGZhaWxzLiAqL1xuICAgIEBPdXRwdXQoKVxuICAgIGVycm9yID0gbmV3IEV2ZW50RW1pdHRlcjxMb2dpbkVycm9yRXZlbnQ+KCk7XG5cbiAgICAvKiogRW1pdHRlZCB3aGVuIHRoZSBsb2dpbiBmb3JtIGlzIHN1Ym1pdHRlZC4gKi9cbiAgICBAT3V0cHV0KClcbiAgICBleGVjdXRlU3VibWl0ID0gbmV3IEV2ZW50RW1pdHRlcjxMb2dpblN1Ym1pdEV2ZW50PigpO1xuXG4gICAgaW1wbGljaXRGbG93OiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBmb3JtOiBGb3JtR3JvdXA7XG4gICAgaXNFcnJvcjogYm9vbGVhbiA9IGZhbHNlO1xuICAgIGVycm9yTXNnOiBzdHJpbmc7XG4gICAgYWN0dWFsTG9naW5TdGVwOiBhbnkgPSBMb2dpblN0ZXBzLkxhbmRpbmc7XG4gICAgTG9naW5TdGVwcyA9IExvZ2luU3RlcHM7XG4gICAgcmVtZW1iZXJNZTogYm9vbGVhbiA9IHRydWU7XG4gICAgZm9ybUVycm9yOiB7IFtpZDogc3RyaW5nXTogc3RyaW5nIH07XG4gICAgbWluTGVuZ3RoOiBudW1iZXIgPSAyO1xuICAgIGZvb3RlclRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuICAgIGhlYWRlclRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuICAgIGRhdGE6IGFueTtcblxuICAgIHByaXZhdGUgX21lc3NhZ2U6IHsgW2lkOiBzdHJpbmddOiB7IFtpZDogc3RyaW5nXTogVmFsaWRhdGlvbk1lc3NhZ2UgfSB9O1xuICAgIHByaXZhdGUgb25EZXN0cm95JCA9IG5ldyBTdWJqZWN0PGJvb2xlYW4+KCk7XG5cbiAgICAvKipcbiAgICAgKiBDb25zdHJ1Y3RvclxuICAgICAqIEBwYXJhbSBfZmJcbiAgICAgKiBAcGFyYW0gYXV0aFNlcnZpY2VcbiAgICAgKiBAcGFyYW0gdHJhbnNsYXRlXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByaXZhdGUgX2ZiOiBGb3JtQnVpbGRlcixcbiAgICAgICAgcHJpdmF0ZSBhdXRoU2VydmljZTogQXV0aGVudGljYXRpb25TZXJ2aWNlLFxuICAgICAgICBwcml2YXRlIHRyYW5zbGF0ZVNlcnZpY2U6IFRyYW5zbGF0aW9uU2VydmljZSxcbiAgICAgICAgcHJpdmF0ZSBsb2dTZXJ2aWNlOiBMb2dTZXJ2aWNlLFxuICAgICAgICBwcml2YXRlIHJvdXRlcjogUm91dGVyLFxuICAgICAgICBwcml2YXRlIGFwcENvbmZpZzogQXBwQ29uZmlnU2VydmljZSxcbiAgICAgICAgcHJpdmF0ZSB1c2VyUHJlZmVyZW5jZXM6IFVzZXJQcmVmZXJlbmNlc1NlcnZpY2UsXG4gICAgICAgIHByaXZhdGUgbG9jYXRpb246IExvY2F0aW9uLFxuICAgICAgICBwcml2YXRlIHJvdXRlOiBBY3RpdmF0ZWRSb3V0ZSxcbiAgICAgICAgcHJpdmF0ZSBzYW5pdGl6ZXI6IERvbVNhbml0aXplclxuICAgICkge1xuICAgICAgICB0aGlzLmluaXRGb3JtRXJyb3IoKTtcbiAgICAgICAgdGhpcy5pbml0Rm9ybUZpZWxkc01lc3NhZ2VzKCk7XG4gICAgfVxuXG4gICAgbmdPbkluaXQoKSB7XG4gICAgICAgIGlmICh0aGlzLmF1dGhTZXJ2aWNlLmlzT2F1dGgoKSkge1xuICAgICAgICAgICAgY29uc3Qgb2F1dGg6IE9hdXRoQ29uZmlnTW9kZWwgPSB0aGlzLmFwcENvbmZpZy5nZXQ8T2F1dGhDb25maWdNb2RlbD4oQXBwQ29uZmlnVmFsdWVzLk9BVVRIQ09ORklHLCBudWxsKTtcbiAgICAgICAgICAgIGlmIChvYXV0aCAmJiBvYXV0aC5pbXBsaWNpdEZsb3cpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmltcGxpY2l0RmxvdyA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5hdXRoU2VydmljZS5pc0VjbUxvZ2dlZEluKCkgfHwgdGhpcy5hdXRoU2VydmljZS5pc0JwbUxvZ2dlZEluKCkpIHtcbiAgICAgICAgICAgIHRoaXMubG9jYXRpb24uZm9yd2FyZCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5yb3V0ZS5xdWVyeVBhcmFtcy5zdWJzY3JpYmUoKHBhcmFtczogUGFyYW1zKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgdXJsID0gcGFyYW1zWydyZWRpcmVjdFVybCddO1xuICAgICAgICAgICAgICAgIGNvbnN0IHByb3ZpZGVyID0gdGhpcy5hcHBDb25maWcuZ2V0PHN0cmluZz4oQXBwQ29uZmlnVmFsdWVzLlBST1ZJREVSUyk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmF1dGhTZXJ2aWNlLnNldFJlZGlyZWN0KHsgcHJvdmlkZXIsIHVybCB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuaGFzQ3VzdG9tRmllbGRzVmFsaWRhdGlvbigpKSB7XG4gICAgICAgICAgICB0aGlzLmZvcm0gPSB0aGlzLl9mYi5ncm91cCh0aGlzLmZpZWxkc1ZhbGlkYXRpb24pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5pbml0Rm9ybUZpZWxkc0RlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoaXMuaW5pdEZvcm1GaWVsZHNNZXNzYWdlc0RlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmZvcm0udmFsdWVDaGFuZ2VzXG4gICAgICAgICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5vbkRlc3Ryb3kkKSlcbiAgICAgICAgICAgIC5zdWJzY3JpYmUoZGF0YSA9PiB0aGlzLm9uVmFsdWVDaGFuZ2VkKGRhdGEpKTtcbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy5vbkRlc3Ryb3kkLm5leHQodHJ1ZSk7XG4gICAgICAgIHRoaXMub25EZXN0cm95JC5jb21wbGV0ZSgpO1xuICAgIH1cblxuICAgIHN1Ym1pdCgpIHtcbiAgICAgICAgdGhpcy5vblN1Ym1pdCh0aGlzLmZvcm0udmFsdWUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE1ldGhvZCBjYWxsZWQgb24gc3VibWl0IGZvcm1cbiAgICAgKiBAcGFyYW0gdmFsdWVzXG4gICAgICogQHBhcmFtIGV2ZW50XG4gICAgICovXG4gICAgb25TdWJtaXQodmFsdWVzOiBhbnkpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5kaXNhYmxlRXJyb3IoKTtcblxuICAgICAgICBjb25zdCBhcmdzID0gbmV3IExvZ2luU3VibWl0RXZlbnQoe1xuICAgICAgICAgICAgY29udHJvbHM6IHsgdXNlcm5hbWU6IHRoaXMuZm9ybS5jb250cm9scy51c2VybmFtZSB9XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmV4ZWN1dGVTdWJtaXQuZW1pdChhcmdzKTtcblxuICAgICAgICBpZiAoIWFyZ3MuZGVmYXVsdFByZXZlbnRlZCkge1xuICAgICAgICAgICAgdGhpcy5wZXJmb3JtTG9naW4odmFsdWVzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGltcGxpY2l0TG9naW4oKSB7XG4gICAgICAgIHRoaXMuYXV0aFNlcnZpY2Uuc3NvSW1wbGljaXRMb2dpbigpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBtZXRob2QgY2hlY2sgdGhlIGVycm9yIGluIHRoZSBmb3JtIGFuZCBwdXNoIHRoZSBlcnJvciBpbiB0aGUgZm9ybUVycm9yIG9iamVjdFxuICAgICAqIEBwYXJhbSBkYXRhXG4gICAgICovXG4gICAgb25WYWx1ZUNoYW5nZWQoZGF0YTogYW55KSB7XG4gICAgICAgIHRoaXMuZGlzYWJsZUVycm9yKCk7XG4gICAgICAgIGZvciAoY29uc3QgZmllbGQgaW4gdGhpcy5mb3JtRXJyb3IpIHtcbiAgICAgICAgICAgIGlmIChmaWVsZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZm9ybUVycm9yW2ZpZWxkXSA9ICcnO1xuICAgICAgICAgICAgICAgIGNvbnN0IGhhc0Vycm9yID1cbiAgICAgICAgICAgICAgICAgICAgKHRoaXMuZm9ybS5jb250cm9sc1tmaWVsZF0uZXJyb3JzICYmIGRhdGFbZmllbGRdICE9PSAnJykgfHxcbiAgICAgICAgICAgICAgICAgICAgKHRoaXMuZm9ybS5jb250cm9sc1tmaWVsZF0uZGlydHkgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICF0aGlzLmZvcm0uY29udHJvbHNbZmllbGRdLnZhbGlkKTtcbiAgICAgICAgICAgICAgICBpZiAoaGFzRXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gdGhpcy5mb3JtLmNvbnRyb2xzW2ZpZWxkXS5lcnJvcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBtZXNzYWdlID0gdGhpcy5fbWVzc2FnZVtmaWVsZF1ba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobWVzc2FnZSAmJiBtZXNzYWdlLnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRyYW5zbGF0ZWQgPSB0aGlzLnRyYW5zbGF0ZVNlcnZpY2UuaW5zdGFudChtZXNzYWdlLnZhbHVlLCBtZXNzYWdlLnBhcmFtcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZm9ybUVycm9yW2ZpZWxkXSArPSB0cmFuc2xhdGVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgcGVyZm9ybUxvZ2luKHZhbHVlczogYW55KSB7XG4gICAgICAgIHRoaXMuYWN0dWFsTG9naW5TdGVwID0gTG9naW5TdGVwcy5DaGVja2luZztcbiAgICAgICAgdGhpcy5hdXRoU2VydmljZVxuICAgICAgICAgICAgLmxvZ2luKHZhbHVlcy51c2VybmFtZSwgdmFsdWVzLnBhc3N3b3JkLCB0aGlzLnJlbWVtYmVyTWUpXG4gICAgICAgICAgICAuc3Vic2NyaWJlKFxuICAgICAgICAgICAgICAgICh0b2tlbjogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlZGlyZWN0VXJsID0gdGhpcy5hdXRoU2VydmljZS5nZXRSZWRpcmVjdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWN0dWFsTG9naW5TdGVwID0gTG9naW5TdGVwcy5XZWxjb21lO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVzZXJQcmVmZXJlbmNlcy5zZXRTdG9yYWdlUHJlZml4KHZhbHVlcy51c2VybmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlcy5wYXNzd29yZCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3VjY2Vzcy5lbWl0KFxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3IExvZ2luU3VjY2Vzc0V2ZW50KHRva2VuLCB2YWx1ZXMudXNlcm5hbWUsIG51bGwpXG4gICAgICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlZGlyZWN0VXJsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmF1dGhTZXJ2aWNlLnNldFJlZGlyZWN0KG51bGwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGVCeVVybChyZWRpcmVjdFVybCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5zdWNjZXNzUm91dGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFt0aGlzLnN1Y2Nlc3NSb3V0ZV0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAoZXJyOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hY3R1YWxMb2dpblN0ZXAgPSBMb2dpblN0ZXBzLkxhbmRpbmc7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzcGxheUVycm9yTWVzc2FnZShlcnIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzRXJyb3IgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVycm9yLmVtaXQobmV3IExvZ2luRXJyb3JFdmVudChlcnIpKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICgpID0+IHRoaXMubG9nU2VydmljZS5pbmZvKCdMb2dpbiBkb25lJylcbiAgICAgICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2sgYW5kIGRpc3BsYXkgdGhlIHJpZ2h0IGVycm9yIG1lc3NhZ2UgaW4gdGhlIFVJXG4gICAgICovXG4gICAgcHJpdmF0ZSBkaXNwbGF5RXJyb3JNZXNzYWdlKGVycjogYW55KTogdm9pZCB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIGVyci5lcnJvciAmJlxuICAgICAgICAgICAgZXJyLmVycm9yLmNyb3NzRG9tYWluICYmXG4gICAgICAgICAgICBlcnIuZXJyb3IubWVzc2FnZS5pbmRleE9mKCdBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nKSAhPT0gLTFcbiAgICAgICAgKSB7XG4gICAgICAgICAgICB0aGlzLmVycm9yTXNnID0gZXJyLmVycm9yLm1lc3NhZ2U7XG4gICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICBlcnIuc3RhdHVzID09PSA0MDMgJiZcbiAgICAgICAgICAgIGVyci5tZXNzYWdlLmluZGV4T2YoJ0ludmFsaWQgQ1NSRi10b2tlbicpICE9PSAtMVxuICAgICAgICApIHtcbiAgICAgICAgICAgIHRoaXMuZXJyb3JNc2cgPSAnTE9HSU4uTUVTU0FHRVMuTE9HSU4tRVJST1ItQ1NSRic7XG4gICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICBlcnIuc3RhdHVzID09PSA0MDMgJiZcbiAgICAgICAgICAgIGVyci5tZXNzYWdlLmluZGV4T2YoJ1RoZSBzeXN0ZW0gaXMgY3VycmVudGx5IGluIHJlYWQtb25seSBtb2RlJykgIT09XG4gICAgICAgICAgICAtMVxuICAgICAgICApIHtcbiAgICAgICAgICAgIHRoaXMuZXJyb3JNc2cgPSAnTE9HSU4uTUVTU0FHRVMuTE9HSU4tRUNNLUxJQ0VOU0UnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5lcnJvck1zZyA9ICdMT0dJTi5NRVNTQUdFUy5MT0dJTi1FUlJPUi1DUkVERU5USUFMUyc7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBZGQgYSBjdXN0b20gZm9ybSBlcnJvciBmb3IgYSBmaWVsZFxuICAgICAqIEBwYXJhbSBmaWVsZFxuICAgICAqIEBwYXJhbSBtc2dcbiAgICAgKi9cbiAgICBwdWJsaWMgYWRkQ3VzdG9tRm9ybUVycm9yKGZpZWxkOiBzdHJpbmcsIG1zZzogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuZm9ybUVycm9yW2ZpZWxkXSArPSBtc2c7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIGEgY3VzdG9tIHZhbGlkYXRpb24gcnVsZSBlcnJvciBmb3IgYSBmaWVsZFxuICAgICAqIEBwYXJhbSBmaWVsZFxuICAgICAqIEBwYXJhbSBydWxlSWQgLSBpLmUuIHJlcXVpcmVkIHwgbWlubGVuZ3RoIHwgbWF4bGVuZ3RoXG4gICAgICogQHBhcmFtIG1zZ1xuICAgICAqL1xuICAgIGFkZEN1c3RvbVZhbGlkYXRpb25FcnJvcihcbiAgICAgICAgZmllbGQ6IHN0cmluZyxcbiAgICAgICAgcnVsZUlkOiBzdHJpbmcsXG4gICAgICAgIG1zZzogc3RyaW5nLFxuICAgICAgICBwYXJhbXM/OiBhbnlcbiAgICApIHtcbiAgICAgICAgdGhpcy5fbWVzc2FnZVtmaWVsZF1bcnVsZUlkXSA9IHtcbiAgICAgICAgICAgIHZhbHVlOiBtc2csXG4gICAgICAgICAgICBwYXJhbXNcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEaXNwbGF5IGFuZCBoaWRlIHRoZSBwYXNzd29yZCB2YWx1ZS5cbiAgICAgKi9cbiAgICB0b2dnbGVTaG93UGFzc3dvcmQoZXZlbnQ6IE1vdXNlRXZlbnQgfCBLZXlib2FyZEV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICB0aGlzLmlzUGFzc3dvcmRTaG93ID0gIXRoaXMuaXNQYXNzd29yZFNob3c7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIG1ldGhvZCByZXR1cm4gaWYgYSBmaWVsZCBpcyB2YWxpZCBvciBub3RcbiAgICAgKiBAcGFyYW0gZmllbGRcbiAgICAgKi9cbiAgICBpc0Vycm9yU3R5bGUoZmllbGQ6IEFic3RyYWN0Q29udHJvbCkge1xuICAgICAgICByZXR1cm4gIWZpZWxkLnZhbGlkICYmIGZpZWxkLmRpcnR5ICYmICFmaWVsZC5wcmlzdGluZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUcmltIHVzZXJuYW1lXG4gICAgICovXG4gICAgdHJpbVVzZXJuYW1lKGV2ZW50OiBhbnkpIHtcbiAgICAgICAgZXZlbnQudGFyZ2V0LnZhbHVlID0gZXZlbnQudGFyZ2V0LnZhbHVlLnRyaW0oKTtcbiAgICB9XG5cbiAgICBnZXRCYWNrZ3JvdW5kVXJsSW1hZ2VVcmwoKTogU2FmZVN0eWxlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2FuaXRpemVyLmJ5cGFzc1NlY3VyaXR5VHJ1c3RTdHlsZShgdXJsKCR7dGhpcy5iYWNrZ3JvdW5kSW1hZ2VVcmx9KWApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERlZmF1bHQgZm9ybUVycm9yIHZhbHVlc1xuICAgICAqL1xuICAgIHByaXZhdGUgaW5pdEZvcm1FcnJvcigpIHtcbiAgICAgICAgdGhpcy5mb3JtRXJyb3IgPSB7XG4gICAgICAgICAgICB1c2VybmFtZTogJycsXG4gICAgICAgICAgICBwYXNzd29yZDogJydcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbml0IGZvcm0gZmllbGRzIG1lc3NhZ2VzXG4gICAgICovXG4gICAgcHJpdmF0ZSBpbml0Rm9ybUZpZWxkc01lc3NhZ2VzKCkge1xuICAgICAgICB0aGlzLl9tZXNzYWdlID0ge1xuICAgICAgICAgICAgdXNlcm5hbWU6IHt9LFxuICAgICAgICAgICAgcGFzc3dvcmQ6IHt9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRGVmYXVsdCBmb3JtIGZpZWxkcyBtZXNzYWdlc1xuICAgICAqL1xuICAgIHByaXZhdGUgaW5pdEZvcm1GaWVsZHNNZXNzYWdlc0RlZmF1bHQoKSB7XG4gICAgICAgIHRoaXMuX21lc3NhZ2UgPSB7XG4gICAgICAgICAgICB1c2VybmFtZToge1xuICAgICAgICAgICAgICAgIHJlcXVpcmVkOiB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiAnTE9HSU4uTUVTU0FHRVMuVVNFUk5BTUUtUkVRVUlSRUQnXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBtaW5MZW5ndGg6IHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6ICdMT0dJTi5NRVNTQUdFUy5VU0VSTkFNRS1NSU4nLFxuICAgICAgICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdldCBtaW5MZW5ndGgoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubWluTGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcGFzc3dvcmQ6IHtcbiAgICAgICAgICAgICAgICByZXF1aXJlZDoge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogJ0xPR0lOLk1FU1NBR0VTLlBBU1NXT1JELVJFUVVJUkVEJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGluaXRGb3JtRmllbGRzRGVmYXVsdCgpIHtcbiAgICAgICAgdGhpcy5mb3JtID0gdGhpcy5fZmIuZ3JvdXAoe1xuICAgICAgICAgICAgdXNlcm5hbWU6IFsnJywgVmFsaWRhdG9ycy5yZXF1aXJlZF0sXG4gICAgICAgICAgICBwYXNzd29yZDogWycnLCBWYWxpZGF0b3JzLnJlcXVpcmVkXVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEaXNhYmxlIHRoZSBlcnJvciBmbGFnXG4gICAgICovXG4gICAgcHJpdmF0ZSBkaXNhYmxlRXJyb3IoKSB7XG4gICAgICAgIHRoaXMuaXNFcnJvciA9IGZhbHNlO1xuICAgICAgICB0aGlzLmluaXRGb3JtRXJyb3IoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGhhc0N1c3RvbUZpZWxkc1ZhbGlkYXRpb24oKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmZpZWxkc1ZhbGlkYXRpb24gIT09IHVuZGVmaW5lZDtcbiAgICB9XG59XG4iXX0=
