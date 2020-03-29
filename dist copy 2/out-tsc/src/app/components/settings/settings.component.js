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
import * as tslib_1 from 'tslib';
import { Component, ViewEncapsulation } from '@angular/core';
import { AppConfigService, StorageService } from '@alfresco/adf-core';
import { Validators, FormBuilder } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  SetLanguagePickerAction,
  getHeaderColor,
  getAppName,
  getUserProfile,
  getLanguagePickerState,
  ToggleProcessServicesAction
} from '@alfresco/aca-shared/store';
var SettingsComponent = /** @class */ (function() {
  function SettingsComponent(store, appConfig, storage, fb) {
    this.store = store;
    this.appConfig = appConfig;
    this.storage = storage;
    this.fb = fb;
    this.defaultPath = '/assets/images/alfresco-logo-white.svg';
    this.profile$ = store.select(getUserProfile);
    this.appName$ = store.select(getAppName);
    this.languagePicker$ = store.select(getLanguagePickerState);
    this.headerColor$ = store.select(getHeaderColor);
  }
  Object.defineProperty(SettingsComponent.prototype, 'logo', {
    get: function() {
      return this.appConfig.get('application.logo', this.defaultPath);
    },
    enumerable: true,
    configurable: true
  });
  SettingsComponent.prototype.ngOnInit = function() {
    this.aiExtensions$ = new BehaviorSubject(
      this.storage.getItem('ai') === 'true'
    );
    this.psExtensions$ = new BehaviorSubject(
      this.storage.getItem('processServices') === 'true'
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
  };
  SettingsComponent.prototype.apply = function(model, isValid) {
    if (isValid) {
      this.storage.setItem('ecmHost', model.ecmHost);
      this.storage.setItem('authType', model.authType);
      var config = this.appConfig.get('oauth2', null);
      config.host = model.aisHost;
      this.storage.setItem('oauth2', JSON.stringify(config));
      // window.location.reload(true);
    }
  };
  SettingsComponent.prototype.reset = function() {
    var config = this.appConfig.get('oauth2', null);
    this.form.reset({
      ecmHost: this.storage.getItem('ecmHost') || this.appConfig.get('ecmHost'),
      aisHost: config.host,
      authType: this.appConfig.get('authType')
    });
  };
  SettingsComponent.prototype.onLanguagePickerValueChanged = function(event) {
    this.storage.setItem('languagePicker', event.checked.toString());
    this.store.dispatch(new SetLanguagePickerAction(event.checked));
  };
  SettingsComponent.prototype.onToggleAiExtensions = function(event) {
    this.storage.setItem('ai', event.checked.toString());
  };
  SettingsComponent.prototype.onTogglePsExtensions = function(event) {
    this.storage.setItem('processServices', event.checked.toString());
    this.store.dispatch(new ToggleProcessServicesAction(event.checked));
  };
  SettingsComponent = tslib_1.__decorate(
    [
      Component({
        selector: 'aca-settings',
        templateUrl: './settings.component.html',
        encapsulation: ViewEncapsulation.None,
        host: { class: 'aca-settings' }
      }),
      tslib_1.__metadata('design:paramtypes', [
        Store,
        AppConfigService,
        StorageService,
        FormBuilder
      ])
    ],
    SettingsComponent
  );
  return SettingsComponent;
})();
export { SettingsComponent };
//# sourceMappingURL=settings.component.js.map
