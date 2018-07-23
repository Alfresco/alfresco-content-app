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
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ExtensionService } from './extensions/extension.service';
import {
    SetAppNameAction,
    SetHeaderColorAction,
    SetLanguagePickerAction,
    SetLogoPathAction,
    SetSharedUrlAction,
    SnackbarErrorAction,
    SetCurrentUrlAction
} from './store/actions';
import { AppStore } from './store/states/app.state';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private pageTitle: PageTitleService,
        private store: Store<AppStore>,
        private config: AppConfigService,
        private alfrescoApiService: AlfrescoApiService,
        private authenticationService: AuthenticationService,
        private uploadService: UploadService,
        private extensions: ExtensionService
    ) {}

    ngOnInit() {
        this.alfrescoApiService.getInstance().on('error', error => {
            if (error.status === 401) {
                if (!this.authenticationService.isLoggedIn()) {
                    this.authenticationService.setRedirect({ provider: 'ECM', url: this.router.url });
                    this.router.navigate(['/login']);
                }
            }
        });

        this.loadAppSettings();

        const { router, pageTitle, route } = this;

        router.events
            .filter(event => event instanceof NavigationEnd)
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
    }

    private loadAppSettings() {
        const headerColor = this.config.get<string>('headerColor');
        if (headerColor) {
            this.store.dispatch(new SetHeaderColorAction(headerColor));
        }
        const appName = this.config.get<string>('application.name');
        if (appName) {
            this.store.dispatch(new SetAppNameAction(appName));
        }
        const logoPath = this.config.get<string>('application.logo');
        if (logoPath) {
            this.store.dispatch(new SetLogoPathAction(logoPath));
        }
        const languagePicker = this.config.get<boolean>('languagePicker');
        this.store.dispatch(new SetLanguagePickerAction(languagePicker));

        const sharedPreviewUrl =
            this.config.get<string>('ecmHost') + '/#/preview/s/';
        this.store.dispatch(new SetSharedUrlAction(sharedPreviewUrl));
    }

    onFileUploadedError(error: FileUploadErrorEvent) {
        let message = 'APP.MESSAGES.UPLOAD.ERROR.GENERIC';

        if (error.error.status === 409) {
            message = 'APP.MESSAGES.UPLOAD.ERROR.CONFLICT';
        }

        if (error.error.status === 500) {
            message = 'APP.MESSAGES.UPLOAD.ERROR.500';
        }

        this.store.dispatch(new SnackbarErrorAction(message));
    }
}
