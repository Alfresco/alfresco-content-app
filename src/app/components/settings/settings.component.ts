/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2019 Alfresco Software Limited
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

import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import {
  AppConfigService,
  StorageService,
  OauthConfigModel
} from '@alfresco/adf-core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  appLanguagePicker,
  selectHeaderColor,
  selectAppName,
  selectUser
} from '../../store/selectors/app.selectors';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { AppStore, SetLanguagePickerAction } from '@alfresco/aca-shared/store';
import { ProfileState } from '@alfresco/adf-extensions';

interface RepositoryConfig {
  ecmHost: string;
  authType: string;
  aisHost: string;
}

@Component({
  selector: 'aca-settings',
  templateUrl: './settings.component.html',
  encapsulation: ViewEncapsulation.None,
  host: { class: 'aca-settings' }
})
export class SettingsComponent implements OnInit {
  private defaultPath = '/assets/images/alfresco-logo-white.svg';

  form: FormGroup;

  profile$: Observable<ProfileState>;
  appName$: Observable<string>;
  headerColor$: Observable<string>;
  languagePicker$: Observable<boolean>;
  aiExtensions$: Observable<boolean>;

  constructor(
    private store: Store<AppStore>,
    private appConfig: AppConfigService,
    private storage: StorageService,
    private fb: FormBuilder
  ) {
    this.profile$ = store.select(selectUser);
    this.appName$ = store.select(selectAppName);
    this.languagePicker$ = store.select(appLanguagePicker);
    this.headerColor$ = store.select(selectHeaderColor);
  }

  get logo() {
    return this.appConfig.get('application.logo', this.defaultPath);
  }

  ngOnInit() {
    this.aiExtensions$ = new BehaviorSubject(
      this.storage.getItem('ai') === 'true'
    );

    this.form = this.fb.group({
      ecmHost: [
        '',
        [Validators.required, Validators.pattern('^(http|https)://.*[^/]$')]
      ],
      aisHost: [
        '',
        [Validators.required, Validators.pattern('^(http|https)://.*[^/]$')]
      ],
      authType: ['']
    });

    this.reset();
  }

  apply(model: RepositoryConfig, isValid: boolean) {
    if (isValid) {
      this.storage.setItem('ecmHost', model.ecmHost);
      this.storage.setItem('authType', model.authType);

      const config: OauthConfigModel = this.appConfig.get<OauthConfigModel>(
        'oauth2',
        null
      );
      config.host = model.aisHost;
      this.storage.setItem('oauth2', JSON.stringify(config));

      // window.location.reload(true);
    }
  }

  reset() {
    const config: OauthConfigModel = this.appConfig.get<OauthConfigModel>(
      'oauth2',
      null
    );

    this.form.reset(<RepositoryConfig>{
      ecmHost:
        this.storage.getItem('ecmHost') ||
        this.appConfig.get<string>('ecmHost'),
      aisHost: config.host,
      authType: this.appConfig.get<string>('authType')
    });
  }

  onLanguagePickerValueChanged(event: MatCheckboxChange) {
    this.storage.setItem('languagePicker', event.checked.toString());
    this.store.dispatch(new SetLanguagePickerAction(event.checked));
  }

  onToggleAiExtensions(event: MatCheckboxChange) {
    this.storage.setItem('ai', event.checked.toString());
  }
}
