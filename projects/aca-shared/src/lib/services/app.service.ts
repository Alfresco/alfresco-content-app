/*!
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Alfresco Example Content Application
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail. Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * from Hyland Software. If not, see <http://www.gnu.org/licenses/>.
 */

import { inject, Injectable, OnDestroy } from '@angular/core';
import {
  AuthenticationService,
  AppConfigService,
  AlfrescoApiService,
  PageTitleService,
  UserPreferencesService,
  NotificationService
} from '@alfresco/adf-core';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { SearchQueryBuilderService, SharedLinksApiService, UploadService, FileUploadErrorEvent } from '@alfresco/adf-content-services';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ActivatedRoute, ActivationEnd, NavigationStart, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { AppStore, SetCurrentUrlAction, SetRepositoryInfoAction, SetUserProfileAction, ResetSelectionAction } from '@alfresco/aca-shared/store';
import { ContentApiService } from './content-api.service';
import { RouterExtensionService } from './router.extension.service';
import { Store } from '@ngrx/store';
import { DiscoveryEntry } from '@alfresco/js-api';
import { AcaMobileAppSwitcherService } from './aca-mobile-app-switcher.service';
import { ShellAppService } from '@alfresco/adf-core/shell';
import { AppSettingsService } from './app-settings.service';
import { UserProfileService } from './user-profile.service';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
// After moving shell to ADF to core, AppService will implement ShellAppService
export class AppService implements ShellAppService, OnDestroy {
  private notificationService = inject(NotificationService);
  private matDialog = inject(MatDialog);
  private ready: BehaviorSubject<boolean>;

  ready$: Observable<boolean>;

  private pageHeading = new BehaviorSubject('');
  /** @deprecated page title is updated automatically */
  pageHeading$ = this.pageHeading.asObservable();

  appNavNarMode$: Subject<'collapsed' | 'expanded'> = new BehaviorSubject('expanded');
  toggleAppNavBar$ = new Subject();

  hideSidenavConditions = ['/preview/'];
  minimizeSidenavConditions = ['search'];

  onDestroy$ = new Subject<boolean>();

  /**
   * Whether `withCredentials` mode is enabled.
   * Usually means that `Kerberos` mode is used.
   */
  get withCredentials(): boolean {
    return this.config.get<boolean>('auth.withCredentials', false);
  }

  constructor(
    public preferencesService: UserPreferencesService,
    private authenticationService: AuthenticationService,
    private store: Store<AppStore>,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private config: AppConfigService,
    private pageTitle: PageTitleService,
    private alfrescoApiService: AlfrescoApiService,
    private uploadService: UploadService,
    private routerExtensionService: RouterExtensionService,
    private contentApi: ContentApiService,
    private sharedLinksApiService: SharedLinksApiService,
    private overlayContainer: OverlayContainer,
    searchQueryBuilderService: SearchQueryBuilderService,
    private acaMobileAppSwitcherService: AcaMobileAppSwitcherService,
    private appSettingsService: AppSettingsService,
    private userProfileService: UserProfileService
  ) {
    this.ready = new BehaviorSubject(this.authenticationService.isLoggedIn() || this.withCredentials);
    this.ready$ = this.ready.asObservable();

    this.authenticationService.onLogin.subscribe(() => {
      this.ready.next(true);
      this.preferencesService.setStoragePrefix(this.authenticationService.getUsername());
    });

    this.authenticationService.onLogout.subscribe(() => {
      searchQueryBuilderService.resetToDefaults();
      acaMobileAppSwitcherService.clearSessionExpireTime();
      acaMobileAppSwitcherService.closeDialog();
    });

    this.router.events
      .pipe(
        filter((event) => event instanceof ActivationEnd && event.snapshot.children.length === 0),
        map((event: ActivationEnd) => event.snapshot?.data?.title ?? '')
      )
      .subscribe((title) => {
        this.pageHeading.next(title);
        this.pageTitle.setTitle(title);
      });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  init(): void {
    this.alfrescoApiService.getInstance().on('error', (error: { status: number; response: any }) => {
      if (error.status === 401 && !this.alfrescoApiService.isExcludedErrorListener(error?.response?.req?.url)) {
        if (!this.authenticationService.isLoggedIn()) {
          this.matDialog.closeAll();

          let redirectUrl = this.activatedRoute.snapshot.queryParams['redirectUrl'];
          if (!redirectUrl) {
            redirectUrl = this.router.url;
          }

          this.router.navigate(['/login'], {
            queryParams: { redirectUrl }
          });
        }
      }
    });

    this.loadCustomCss();
    this.loadCustomWebFont();

    const { router } = this;

    this.router.events.pipe(filter((event) => event instanceof ActivationEnd && event.snapshot.children.length === 0)).subscribe(() => {
      this.store.dispatch(new SetCurrentUrlAction(router.url));
    });

    this.router.events.pipe(filter((event) => event instanceof NavigationStart)).subscribe(() => {
      this.store.dispatch(new ResetSelectionAction());
    });

    this.routerExtensionService.mapExtensionRoutes();

    this.uploadService.fileUploadError.subscribe((error) => this.onFileUploadedError(error));

    this.sharedLinksApiService.error.subscribe((err: { message: string }) => {
      if (err?.message) {
        this.notificationService.showError(err.message);
      }
    });

    this.ready$.subscribe((isReady) => {
      if (isReady) {
        this.loadRepositoryStatus();
        this.loadUserProfile();
        setTimeout(() => {
          this.openMobileAppDialog();
        });
      }
    });

    this.overlayContainer.getContainerElement().setAttribute('role', 'region');
  }

  setAppNavbarMode(mode: 'expanded' | 'collapsed'): void {
    this.appNavNarMode$.next(mode);
    this.preferencesService.set('expandedSidenav', mode === 'expanded');
  }

  private loadRepositoryStatus() {
    this.contentApi.getRepositoryInformation().subscribe((response: DiscoveryEntry) => {
      if (response?.entry?.repository) {
        this.store.dispatch(new SetRepositoryInfoAction(response.entry.repository));
      }
    });
  }

  private async loadUserProfile() {
    const profile = await this.userProfileService.loadUserProfile();
    this.store.dispatch(new SetUserProfileAction(profile));
  }

  onFileUploadedError(error: FileUploadErrorEvent) {
    let message = 'APP.MESSAGES.UPLOAD.ERROR.GENERIC';

    if (error?.error?.status === 403) {
      message = 'APP.MESSAGES.UPLOAD.ERROR.403';
    }

    if (error?.error?.status === 404) {
      message = 'APP.MESSAGES.UPLOAD.ERROR.404';
    }

    if (error?.error?.status === 409) {
      message = 'APP.MESSAGES.UPLOAD.ERROR.CONFLICT';
    }

    if (error?.error?.status === 500) {
      message = 'APP.MESSAGES.UPLOAD.ERROR.500';
    }

    if (error?.error?.status === 504) {
      message = 'APP.MESSAGES.UPLOAD.ERROR.504';
    }

    this.notificationService.showError(message);
  }

  private loadCustomCss(): void {
    const customCssPath = this.appSettingsService.customCssPath;
    if (customCssPath) {
      this.createLink(customCssPath);
    }
  }

  private loadCustomWebFont(): void {
    const webFontPath = this.appSettingsService.webFontPath;
    if (webFontPath) {
      this.createLink(webFontPath);
    }
  }

  private createLink(url: string): void {
    const cssLinkElement = document.createElement('link');
    cssLinkElement.setAttribute('rel', 'stylesheet');
    cssLinkElement.setAttribute('type', 'text/css');
    cssLinkElement.setAttribute('href', url);
    document.head.appendChild(cssLinkElement);
  }

  public openMobileAppDialog(): void {
    const isMobileSwitchEnabled: boolean = this.config.get<boolean>('mobileAppSwitch.enabled', false);
    if (isMobileSwitchEnabled) {
      this.acaMobileAppSwitcherService.resolveExistenceOfDialog();
    } else {
      this.acaMobileAppSwitcherService.clearSessionExpireTime();
    }
  }
}
