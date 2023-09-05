/*!
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Inject, Injectable, OnDestroy } from '@angular/core';
import { AuthenticationService, AppConfigService, AlfrescoApiService, PageTitleService, UserPreferencesService } from '@alfresco/adf-core';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { GroupService, SearchQueryBuilderService, SharedLinksApiService, UploadService, FileUploadErrorEvent } from '@alfresco/adf-content-services';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ActivatedRoute, ActivationEnd, NavigationStart, Router } from '@angular/router';
import { filter, map, tap } from 'rxjs/operators';
import {
  AppState,
  AppStore,
  CloseModalDialogsAction,
  getCustomCssPath,
  getCustomWebFontPath,
  STORE_INITIAL_APP_DATA,
  SetCurrentUrlAction,
  SetInitialStateAction,
  SetRepositoryInfoAction,
  SetUserProfileAction,
  SnackbarErrorAction,
  ResetSelectionAction
} from '@alfresco/aca-shared/store';
import { ContentApiService } from './content-api.service';
import { RouterExtensionService } from './router.extension.service';
import { Store } from '@ngrx/store';
import { DiscoveryEntry, GroupEntry, Group } from '@alfresco/js-api';
import { AcaMobileAppSwitcherService } from './aca-mobile-app-switcher.service';

@Injectable({
  providedIn: 'root'
})
// After moving shell to ADF to core, AppService will implement ShellAppService
export class AppService implements OnDestroy {
  private ready: BehaviorSubject<boolean>;

  ready$: Observable<boolean>;
  pageHeading$: Observable<string>;
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
    private groupService: GroupService,
    private overlayContainer: OverlayContainer,
    @Inject(STORE_INITIAL_APP_DATA) private initialAppState: AppState,
    searchQueryBuilderService: SearchQueryBuilderService,
    private acaMobileAppSwitcherService: AcaMobileAppSwitcherService
  ) {
    this.ready = new BehaviorSubject(this.authenticationService.isLoggedIn() || this.withCredentials);
    this.ready$ = this.ready.asObservable();

    this.authenticationService.onLogin.subscribe(() => {
      this.ready.next(true);
    });

    this.authenticationService.onLogout.subscribe(() => {
      searchQueryBuilderService.resetToDefaults();
      acaMobileAppSwitcherService.clearSessionExpireTime();
      acaMobileAppSwitcherService.closeDialog();
    });

    this.pageHeading$ = this.router.events.pipe(
      filter((event) => event instanceof ActivationEnd && event.snapshot.children.length === 0),
      map((event: ActivationEnd) => event.snapshot?.data?.title ?? ''),
      tap((title) => this.pageTitle.setTitle(title))
    );
  }

  ngOnDestroy(): void {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  init(): void {
    this.alfrescoApiService.getInstance().on('error', (error: { status: number; response: any }) => {
      if (error.status === 401 && !this.alfrescoApiService.isExcludedErrorListener(error?.response?.req?.url)) {
        if (!this.authenticationService.isLoggedIn()) {
          this.store.dispatch(new CloseModalDialogsAction());

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

    this.loadAppSettings();

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
        this.store.dispatch(new SnackbarErrorAction(err.message));
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
    let baseShareUrl = this.config.get<string>('baseShareUrl', '');
    if (!baseShareUrl.endsWith('/')) {
      baseShareUrl += '/';
    }

    const state: AppState = {
      ...this.initialAppState,
      appName: this.config.get<string>('application.name'),
      logoPath: this.config.get<string>('application.logo'),
      customCssPath: this.config.get<string>('customCssPath'),
      webFontPath: this.config.get<string>('webFontPath'),
      sharedUrl: baseShareUrl
    };

    this.store.dispatch(new SetInitialStateAction(state));
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

  public openMobileAppDialog(): void {
    const isMobileSwitchEnabled: boolean = this.config.get<boolean>('mobileAppSwitch.enabled', false);
    if (isMobileSwitchEnabled) {
      this.acaMobileAppSwitcherService.resolveExistenceOfDialog();
    } else {
      this.acaMobileAppSwitcherService.clearSessionExpireTime();
    }
  }
}
