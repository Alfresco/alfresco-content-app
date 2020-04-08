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
import { EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { AppConfigService } from '../app-config/app-config.service';
import { StorageService } from '../services/storage.service';
import { AlfrescoApiService } from '../services/alfresco-api.service';
export declare class HostSettingsComponent implements OnInit {
  private formBuilder;
  private storageService;
  private alfrescoApiService;
  private appConfig;
  HOST_REGEX: string;
  /**
   * Tells the component which provider options are available. Possible valid values
   * are "ECM" (Content), "BPM" (Process) , "ALL" (Content and Process), 'OAUTH2' SSO.
   */
  providers: string[];
  showSelectProviders: boolean;
  form: FormGroup;
  /** Emitted when the URL is invalid. */
  error: EventEmitter<string>;
  /** Emitted when the user cancels the changes. */
  cancel: EventEmitter<boolean>;
  /** Emitted when the changes are successfully applied. */
  success: EventEmitter<boolean>;
  constructor(
    formBuilder: FormBuilder,
    storageService: StorageService,
    alfrescoApiService: AlfrescoApiService,
    appConfig: AppConfigService
  );
  ngOnInit(): void;
  private removeFormGroups;
  private addFormGroups;
  private addOAuthFormGroup;
  private addBPMFormControl;
  private addIdentityHostFormControl;
  private addECMFormControl;
  private createOAuthFormGroup;
  private createBPMFormControl;
  private createIdentityFormControl;
  private createECMFormControl;
  onCancel(): void;
  onSubmit(values: any): void;
  keyDownFunction(event: any): void;
  private saveOAuthValues;
  private saveBPMValues;
  private saveECMValues;
  isBPM(): boolean;
  isECM(): boolean;
  isALL(): boolean;
  isOAUTH(): boolean;
  readonly providersControl: AbstractControl;
  readonly bpmHost: AbstractControl;
  readonly ecmHost: AbstractControl;
  readonly host: AbstractControl;
  readonly identityHost: AbstractControl;
  readonly clientId: AbstractControl;
  readonly scope: AbstractControl;
  readonly secretId: AbstractControl;
  readonly implicitFlow: AbstractControl;
  readonly silentLogin: AbstractControl;
  readonly redirectUri: AbstractControl;
  readonly publicUrls: AbstractControl;
  readonly redirectUriLogout: AbstractControl;
  readonly oauthConfig: AbstractControl;
}
