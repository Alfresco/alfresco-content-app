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
import { EventEmitter, OnInit, TemplateRef, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { AuthenticationService } from '../../services/authentication.service';
import { LogService } from '../../services/log.service';
import { TranslationService } from '../../services/translation.service';
import { UserPreferencesService } from '../../services/user-preferences.service';
import { LoginErrorEvent } from '../models/login-error.event';
import { LoginSubmitEvent } from '../models/login-submit.event';
import { LoginSuccessEvent } from '../models/login-success.event';
import { AppConfigService } from '../../app-config/app-config.service';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
declare enum LoginSteps {
  Landing = 0,
  Checking = 1,
  Welcome = 2
}
export declare class LoginComponent implements OnInit, OnDestroy {
  private _fb;
  private authService;
  private translateService;
  private logService;
  private router;
  private appConfig;
  private userPreferences;
  private location;
  private route;
  private sanitizer;
  isPasswordShow: boolean;
  /**
   * Should the `Remember me` checkbox be shown? When selected, this
   * option will remember the logged-in user after the browser is closed
   * to avoid logging in repeatedly.
   */
  showRememberMe: boolean;
  /** Should the extra actions (`Need Help`, `Register`, etc) be shown? */
  showLoginActions: boolean;
  /** Sets the URL of the NEED HELP link in the footer. */
  needHelpLink: string;
  /** Sets the URL of the REGISTER link in the footer. */
  registerLink: string;
  /** Path to a custom logo image. */
  logoImageUrl: string;
  /** Path to a custom background image. */
  backgroundImageUrl: string;
  /** The copyright text below the login box. */
  copyrightText: string;
  /** Custom validation rules for the login form. */
  fieldsValidation: any;
  /** Route to redirect to on successful login. */
  successRoute: string;
  /** Emitted when the login is successful. */
  success: EventEmitter<LoginSuccessEvent>;
  /** Emitted when the login fails. */
  error: EventEmitter<LoginErrorEvent>;
  /** Emitted when the login form is submitted. */
  executeSubmit: EventEmitter<LoginSubmitEvent>;
  implicitFlow: boolean;
  form: FormGroup;
  isError: boolean;
  errorMsg: string;
  actualLoginStep: any;
  LoginSteps: typeof LoginSteps;
  rememberMe: boolean;
  formError: {
    [id: string]: string;
  };
  minLength: number;
  footerTemplate: TemplateRef<any>;
  headerTemplate: TemplateRef<any>;
  data: any;
  private _message;
  private onDestroy$;
  /**
   * Constructor
   * @param _fb
   * @param authService
   * @param translate
   */
  constructor(
    _fb: FormBuilder,
    authService: AuthenticationService,
    translateService: TranslationService,
    logService: LogService,
    router: Router,
    appConfig: AppConfigService,
    userPreferences: UserPreferencesService,
    location: Location,
    route: ActivatedRoute,
    sanitizer: DomSanitizer
  );
  ngOnInit(): void;
  ngOnDestroy(): void;
  submit(): void;
  /**
   * Method called on submit form
   * @param values
   * @param event
   */
  onSubmit(values: any): void;
  implicitLogin(): void;
  /**
   * The method check the error in the form and push the error in the formError object
   * @param data
   */
  onValueChanged(data: any): void;
  private performLogin;
  /**
   * Check and display the right error message in the UI
   */
  private displayErrorMessage;
  /**
   * Add a custom form error for a field
   * @param field
   * @param msg
   */
  addCustomFormError(field: string, msg: string): void;
  /**
   * Add a custom validation rule error for a field
   * @param field
   * @param ruleId - i.e. required | minlength | maxlength
   * @param msg
   */
  addCustomValidationError(
    field: string,
    ruleId: string,
    msg: string,
    params?: any
  ): void;
  /**
   * Display and hide the password value.
   */
  toggleShowPassword(event: MouseEvent | KeyboardEvent): void;
  /**
   * The method return if a field is valid or not
   * @param field
   */
  isErrorStyle(field: AbstractControl): boolean;
  /**
   * Trim username
   */
  trimUsername(event: any): void;
  getBackgroundUrlImageUrl(): SafeStyle;
  /**
   * Default formError values
   */
  private initFormError;
  /**
   * Init form fields messages
   */
  private initFormFieldsMessages;
  /**
   * Default form fields messages
   */
  private initFormFieldsMessagesDefault;
  private initFormFieldsDefault;
  /**
   * Disable the error flag
   */
  private disableError;
  private hasCustomFieldsValidation;
}
export {};
