/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2018 Alfresco Software Limited
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
  AlfrescoApiService,
  AppConfigService,
  AuthenticationService,
  FileUploadErrorEvent,
  PageTitleService,
  UploadService
} from '@alfresco/adf-core';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppExtensionService } from './extensions/extension.service';
import {
  SnackbarErrorAction,
  SetCurrentUrlAction,
  SetInitialStateAction,
  CloseModalDialogsAction,
  SetRepositoryStatusAction,
  SetUserProfileAction
} from './store/actions';
import {
  AppStore,
  AppState,
  INITIAL_APP_STATE
} from './store/states/app.state';
import { filter, takeUntil } from 'rxjs/operators';
import { ContentApiService } from './services/content-api.service';
import { DiscoveryEntry } from 'alfresco-js-api';
import { AppService } from './services/app.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  onDestroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pageTitle: PageTitleService,
    private store: Store<AppStore>,
    private config: AppConfigService,
    private alfrescoApiService: AlfrescoApiService,
    private authenticationService: AuthenticationService,
    private uploadService: UploadService,
    private extensions: AppExtensionService,
    private contentApi: ContentApiService,
    private appService: AppService
  ) {}

  ngOnInit() {
    this.alfrescoApiService.getInstance().on('error', error => {
      if (error.status === 401) {
        if (!this.authenticationService.isLoggedIn()) {
          this.store.dispatch(new CloseModalDialogsAction());
          this.router.navigate(['/login'], {
            queryParams: { returnUrl: 'personal-files' }
          });
        }
      }
    });

    this.loadAppSettings();

    const { router, pageTitle, route } = this;

    router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        let currentRoute = route.root;

        while (currentRoute.firstChild) {
          currentRoute = currentRoute.firstChild;
        }

        const snapshot: any = currentRoute.snapshot || {};
        const data: any = snapshot.data || {};

        pageTitle.setTitle(data.title || '');

        this.store.dispatch(new SetCurrentUrlAction(router.url));
      });

    this.router.config.unshift(...this.extensions.getApplicationRoutes());

    this.uploadService.fileUploadError.subscribe(error =>
      this.onFileUploadedError(error)
    );

    this.appService.ready$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(isReady => {
        if (isReady) {
          this.loadRepositoryStatus();
          this.loadUserProfile();
          // todo: load external auth-enabled plugins here
        }
      });
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  private loadRepositoryStatus() {
    this.contentApi
      .getRepositoryInformation()
      .subscribe((response: DiscoveryEntry) => {
        this.store.dispatch(
          new SetRepositoryStatusAction(response.entry.repository.status)
        );
      });
  }

  private loadUserProfile() {
    this.contentApi.getPerson('-me-').subscribe(person => {
      this.store.dispatch(new SetUserProfileAction(person.entry));
    });
  }

  private loadAppSettings() {
    const baseShareUrl =
      this.config.get<string>('baseShareUrl') ||
      this.config.get<string>('ecmHost');

    const state: AppState = {
      ...INITIAL_APP_STATE,
      languagePicker: this.config.get<boolean>('languagePicker'),
      appName: this.config.get<string>('application.name'),
      headerColor: this.config.get<string>('headerColor'),
      logoPath: this.config.get<string>('application.logo'),
      sharedUrl: `${baseShareUrl}/#/preview/s/`
    };

    this.store.dispatch(new SetInitialStateAction(state));
  }

  onFileUploadedError(error: FileUploadErrorEvent) {
    let message = 'APP.MESSAGES.UPLOAD.ERROR.GENERIC';

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
  }
}
