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
  AppStore,
  AppState,
  SetCurrentUrlAction,
  SetInitialStateAction,
  SetUserProfileAction,
  SnackbarErrorAction,
  CloseModalDialogsAction,
  SetRepositoryInfoAction
} from '@alfresco/aca-shared/store';
import { filter, takeUntil } from 'rxjs/operators';
import { ContentApiService } from '@alfresco/aca-shared';
import { DiscoveryEntry, GroupsApi, Group } from '@alfresco/js-api';
import { AppService } from './services/app.service';
import { Subject } from 'rxjs';
import { INITIAL_APP_STATE } from './store/initial-state';

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
    this.alfrescoApiService
      .getInstance()
      .on('error', (error: { status: number }) => {
        if (error.status === 401) {
          if (!this.authenticationService.isLoggedIn()) {
            this.store.dispatch(new CloseModalDialogsAction());

            let redirectUrl = this.route.snapshot.queryParams['redirectUrl'];
            if (!redirectUrl) {
              redirectUrl = this.router.url;
            }

            this.router.navigate(['/login'], {
              queryParams: { redirectUrl: redirectUrl }
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
          new SetRepositoryInfoAction(response.entry.repository)
        );
      });
  }

  private async loadUserProfile() {
    const groupsApi = new GroupsApi(this.alfrescoApiService.getInstance());
    const paging = await groupsApi.listGroupMembershipsForPerson('-me-');
    const groups: Group[] = [];

    if (paging && paging.list && paging.list.entries) {
      groups.push(...paging.list.entries.map(obj => obj.entry));
    }

    this.contentApi.getPerson('-me-').subscribe(person => {
      this.store.dispatch(
        new SetUserProfileAction({ person: person.entry, groups })
      );
    });
  }

  loadAppSettings() {
    let baseShareUrl = this.config.get<string>('baseShareUrl');
    if (!baseShareUrl.endsWith('/')) {
      baseShareUrl += '/';
    }

    const state: AppState = {
      ...INITIAL_APP_STATE,
      languagePicker: this.config.get<boolean>('languagePicker'),
      appName: this.config.get<string>('application.name'),
      headerColor: this.config.get<string>('headerColor'),
      logoPath: this.config.get<string>('application.logo'),
      sharedUrl: baseShareUrl
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
