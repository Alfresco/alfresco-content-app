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

import {
  AlfrescoApiService,
  AppConfigService,
  AuthenticationService,
  FileUploadErrorEvent,
  PageTitleService,
  UploadService,
  SharedLinksApiService
} from '@alfresco/adf-core';
import { GroupService } from '@alfresco/adf-content-services';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, ActivationEnd } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  AppStore,
  AppState,
  SetCurrentUrlAction,
  SetInitialStateAction,
  SetUserProfileAction,
  SnackbarErrorAction,
  CloseModalDialogsAction,
  SetRepositoryInfoAction,
  getCustomCssPath,
  getCustomWebFontPath
} from '@alfresco/aca-shared/store';
import { filter, takeUntil } from 'rxjs/operators';
import { RouterExtensionService, AppService, ContentApiService } from '@alfresco/aca-shared';
import { DiscoveryEntry, GroupEntry, Group } from '@alfresco/js-api';
import { Subject } from 'rxjs';
import { INITIAL_APP_STATE } from './store/initial-state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  onDestroy$: Subject<boolean> = new Subject<boolean>();
  pageHeading = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pageTitle: PageTitleService,
    private store: Store<AppStore>,
    private config: AppConfigService,
    private alfrescoApiService: AlfrescoApiService,
    private authenticationService: AuthenticationService,
    private uploadService: UploadService,
    private routerExtensionService: RouterExtensionService,
    private contentApi: ContentApiService,
    private appService: AppService,
    private sharedLinksApiService: SharedLinksApiService,
    private groupService: GroupService
  ) {}

  ngOnInit() {
    this.alfrescoApiService.getInstance().on('error', (error: { status: number; response: any }) => {
      if (error.status === 401 && !this.alfrescoApiService.isExcludedErrorListener(error?.response?.req?.url)) {
        if (!this.authenticationService.isLoggedIn()) {
          this.store.dispatch(new CloseModalDialogsAction());

          let redirectUrl = this.route.snapshot.queryParams['redirectUrl'];
          if (!redirectUrl) {
            redirectUrl = this.router.url;
          }

          this.router.navigate(['/login'], {
            queryParams: { redirectUrl }
          });
        }
      }
    });

    this.loadAppSettings();

    this.loadCustomCss();
    this.loadCustomWebFont();

    const { router, pageTitle } = this;

    this.router.events
      .pipe(filter((event) => event instanceof ActivationEnd && event.snapshot.children.length === 0))
      .subscribe((event: ActivationEnd) => {
        const snapshot: any = event.snapshot || {};
        const data: any = snapshot.data || {};

        this.pageHeading = data.title || '';
        pageTitle.setTitle(data.title || '');
        this.store.dispatch(new SetCurrentUrlAction(router.url));
      });

    this.routerExtensionService.mapExtensionRoutes();

    this.uploadService.fileUploadError.subscribe((error) => this.onFileUploadedError(error));

    this.sharedLinksApiService.error.pipe(takeUntil(this.onDestroy$)).subscribe((err: { message: string }) => {
      this.store.dispatch(new SnackbarErrorAction(err.message));
    });

    this.appService.ready$.pipe(takeUntil(this.onDestroy$)).subscribe((isReady) => {
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
    this.contentApi.getRepositoryInformation().subscribe((response: DiscoveryEntry) => {
      this.store.dispatch(new SetRepositoryInfoAction(response.entry.repository));
    });
  }

  private async loadUserProfile() {
    const groupsEntries: GroupEntry[] = await this.groupService.listAllGroupMembershipsForPerson('-me-', { maxItems: 250 });

    const groups: Group[] = [];

    if (groupsEntries) {
      groups.push(...groupsEntries.map((obj) => obj.entry));
    }

    this.contentApi.getPerson('-me-').subscribe((person) => {
      this.store.dispatch(new SetUserProfileAction({ person: person.entry, groups }));
    });
  }

  loadAppSettings() {
    let baseShareUrl = this.config.get<string>('baseShareUrl');
    if (!baseShareUrl.endsWith('/')) {
      baseShareUrl += '/';
    }

    const state: AppState = {
      ...INITIAL_APP_STATE,
      appName: this.config.get<string>('application.name'),
      headerColor: this.config.get<string>('headerColor'),
      headerTextColor: this.config.get<string>('headerTextColor', '#000000'),
      logoPath: this.config.get<string>('application.logo'),
      headerImagePath: this.config.get<string>('application.headerImagePath'),
      customCssPath: this.config.get<string>('customCssPath'),
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

  private loadCustomCss(): void {
    this.store.select(getCustomCssPath).subscribe((cssPath) => {
      if (cssPath) {
        this.createLink(cssPath);
      }
    });
  }

  private loadCustomWebFont(): void {
    this.store.select(getCustomWebFontPath).subscribe((fontUrl) => {
      if (fontUrl) {
        this.createLink(fontUrl);
      }
    });
  }

  private createLink(url: string): void {
    const cssLinkElement = document.createElement('link');
    cssLinkElement.setAttribute('rel', 'stylesheet');
    cssLinkElement.setAttribute('type', 'text/css');
    cssLinkElement.setAttribute('href', url);
    document.head.appendChild(cssLinkElement);
  }
}
