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
import {
  AlfrescoApiService,
  AppConfigService,
  AuthenticationService,
  PageTitleService,
  UploadService,
  SharedLinksApiService
} from '@alfresco/adf-core';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, ActivationEnd } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppExtensionService } from './extensions/extension.service';
import {
  SetCurrentUrlAction,
  SetInitialStateAction,
  SetUserProfileAction,
  SnackbarErrorAction,
  CloseModalDialogsAction,
  SetRepositoryInfoAction
} from '@alfresco/aca-shared/store';
import { filter, takeUntil } from 'rxjs/operators';
import { AppService, ContentApiService } from '@alfresco/aca-shared';
import { GroupsApi } from '@alfresco/js-api';
import { Subject } from 'rxjs';
import { INITIAL_APP_STATE } from './store/initial-state';
var AppComponent = /** @class */ (function() {
  function AppComponent(
    route,
    router,
    pageTitle,
    store,
    config,
    alfrescoApiService,
    authenticationService,
    uploadService,
    extensions,
    contentApi,
    appService,
    sharedLinksApiService
  ) {
    this.route = route;
    this.router = router;
    this.pageTitle = pageTitle;
    this.store = store;
    this.config = config;
    this.alfrescoApiService = alfrescoApiService;
    this.authenticationService = authenticationService;
    this.uploadService = uploadService;
    this.extensions = extensions;
    this.contentApi = contentApi;
    this.appService = appService;
    this.sharedLinksApiService = sharedLinksApiService;
    this.onDestroy$ = new Subject();
    this.pageHeading = '';
  }
  AppComponent.prototype.ngOnInit = function() {
    var _this = this;
    var _a;
    this.alfrescoApiService.getInstance().on('error', function(error) {
      if (error.status === 401) {
        if (!_this.authenticationService.isLoggedIn()) {
          _this.store.dispatch(new CloseModalDialogsAction());
          var redirectUrl = _this.route.snapshot.queryParams['redirectUrl'];
          if (!redirectUrl) {
            redirectUrl = _this.router.url;
          }
          _this.router.navigate(['/login'], {
            queryParams: { redirectUrl: redirectUrl }
          });
        }
      }
    });
    this.loadAppSettings();
    var _b = this,
      router = _b.router,
      pageTitle = _b.pageTitle;
    this.router.events
      .pipe(
        filter(function(event) {
          return (
            event instanceof ActivationEnd &&
            event.snapshot.children.length === 0
          );
        })
      )
      .subscribe(function(event) {
        var snapshot = event.snapshot || {};
        var data = snapshot.data || {};
        _this.pageHeading = data.title || '';
        pageTitle.setTitle(data.title || '');
        _this.store.dispatch(new SetCurrentUrlAction(router.url));
      });
    (_a = this.router.config).unshift.apply(
      _a,
      this.extensions.getApplicationRoutes()
    );
    this.uploadService.fileUploadError.subscribe(function(error) {
      return _this.onFileUploadedError(error);
    });
    this.sharedLinksApiService.error
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(function(err) {
        _this.store.dispatch(new SnackbarErrorAction(err.message));
      });
    this.appService.ready$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(function(isReady) {
        if (isReady) {
          _this.loadRepositoryStatus();
          _this.loadUserProfile();
        }
      });
  };
  AppComponent.prototype.ngOnDestroy = function() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  };
  AppComponent.prototype.loadRepositoryStatus = function() {
    var _this = this;
    this.contentApi.getRepositoryInformation().subscribe(function(response) {
      _this.store.dispatch(
        new SetRepositoryInfoAction(response.entry.repository)
      );
    });
  };
  AppComponent.prototype.loadUserProfile = function() {
    return tslib_1.__awaiter(this, void 0, void 0, function() {
      var groupsApi, paging, groups;
      var _this = this;
      return tslib_1.__generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            groupsApi = new GroupsApi(this.alfrescoApiService.getInstance());
            return [
              4 /*yield*/,
              groupsApi.listGroupMembershipsForPerson('-me-')
            ];
          case 1:
            paging = _a.sent();
            groups = [];
            if (paging && paging.list && paging.list.entries) {
              groups.push.apply(
                groups,
                paging.list.entries.map(function(obj) {
                  return obj.entry;
                })
              );
            }
            this.contentApi.getPerson('-me-').subscribe(function(person) {
              _this.store.dispatch(
                new SetUserProfileAction({
                  person: person.entry,
                  groups: groups
                })
              );
            });
            return [2 /*return*/];
        }
      });
    });
  };
  AppComponent.prototype.loadAppSettings = function() {
    var baseShareUrl = this.config.get('baseShareUrl');
    if (!baseShareUrl.endsWith('/')) {
      baseShareUrl += '/';
    }
    var state = tslib_1.__assign({}, INITIAL_APP_STATE, {
      languagePicker: this.config.get('languagePicker'),
      processServices: this.config.get('processServices'),
      appName: this.config.get('application.name'),
      headerColor: this.config.get('headerColor'),
      logoPath: this.config.get('application.logo'),
      sharedUrl: baseShareUrl
    });
    this.store.dispatch(new SetInitialStateAction(state));
  };
  AppComponent.prototype.onFileUploadedError = function(error) {
    var message = 'APP.MESSAGES.UPLOAD.ERROR.GENERIC';
    if (error.error.status === 403) {
      message = 'APP.MESSAGES.UPLOAD.ERROR.403';
    }
    if (error.error.status === 404) {
      message = 'APP.MESSAGES.UPLOAD.ERROR.404';
    }
    if (error.error.status === 409) {
      message = 'APP.MESSAGES.UPLOAD.ERROR.CONFLICT';
    }
    if (error.error.status === 500) {
      message = 'APP.MESSAGES.UPLOAD.ERROR.500';
    }
    if (error.error.status === 504) {
      message = 'APP.MESSAGES.UPLOAD.ERROR.504';
    }
    this.store.dispatch(new SnackbarErrorAction(message));
  };
  AppComponent = tslib_1.__decorate(
    [
      Component({
        selector: 'app-root',
        templateUrl: './app.component.html',
        styleUrls: ['./app.component.scss']
      }),
      tslib_1.__metadata('design:paramtypes', [
        ActivatedRoute,
        Router,
        PageTitleService,
        Store,
        AppConfigService,
        AlfrescoApiService,
        AuthenticationService,
        UploadService,
        AppExtensionService,
        ContentApiService,
        AppService,
        SharedLinksApiService
      ])
    ],
    AppComponent
  );
  return AppComponent;
})();
export { AppComponent };
//# sourceMappingURL=app.component.js.map
