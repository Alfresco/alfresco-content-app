/*!
 * @license
 * Copyright 2017 Alfresco Software, Ltd.
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

import { Routes } from '@angular/router';
import { AuthGuardEcm } from 'ng2-alfresco-core';

import { LayoutComponent } from './components/layout/layout.component';

import { FilesComponent } from './components/files/files.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { LibrariesComponent } from './components/libraries/libraries.component';
import { RecentFilesComponent } from './components/recent-files/recent-files.component';
import { SharedFilesComponent } from './components/shared-files/shared-files.component';
import { TrashcanComponent } from './components/trashcan/trashcan.component';
import { AboutComponent } from './components/about/about.component';

import { LoginComponent } from './components/login/login.component';
import { PreviewComponent } from './components/preview/preview.component';
import { GenericErrorComponent } from './components/generic-error/generic-error.component';

export const APP_ROUTES: Routes = [
    {
        path: 'preview/:nodeId',
        component: PreviewComponent,
        data: {
            i18nTitle: 'APP.PREVIEW.TITLE'
        }
    },
    {
        path: 'login',
        component: LoginComponent,
        data: {
            i18nTitle: 'APP.SIGN_IN'
        }
    },
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: '',
                redirectTo: `/personal-files`,
                pathMatch: 'full'
            },
            {
                path: 'favorites',
                component: FavoritesComponent,
                data: {
                    i18nTitle: 'APP.BROWSE.FAVORITES.TITLE'
                }
            },
            {
                path: 'libraries',
                children: [{
                    path: '',
                    component: LibrariesComponent,
                    data: {
                        i18nTitle: 'APP.BROWSE.LIBRARIES.TITLE'
                    }
                }, {
                    path: ':id',
                    component: FilesComponent,
                    data: {
                        i18nTitle: 'APP.BROWSE.LIBRARIES.TITLE'
                    }
                }]
            },
            {
                path: 'personal-files',
                children: [{
                    path: '',
                    component: FilesComponent,
                    data: {
                        i18nTitle: 'APP.BROWSE.PERSONAL.TITLE',
                        defaultNodeId: '-my-'
                    }
                }, {
                    path: ':id',
                    component: FilesComponent,
                    data: {
                        i18nTitle: 'APP.BROWSE.PERSONAL.TITLE'
                    }
                }]
            },
            {
                path: 'recent-files',
                component: RecentFilesComponent,
                data: {
                    i18nTitle: 'APP.BROWSE.RECENT.TITLE'
                }
            },
            {
                path: 'shared',
                component: SharedFilesComponent,
                data: {
                    i18nTitle: 'APP.BROWSE.SHARED.TITLE'
                }
            },
            {
                path: 'trashcan',
                component: TrashcanComponent,
                data: {
                    i18nTitle: 'APP.BROWSE.TRASHCAN.TITLE'
                }
            },
            {
                path: 'about',
                component: AboutComponent,
                data: {
                    i18nTitle: 'APP.BROWSE.ABOUT.TITLE'
                }
            },
            {
                path: '**',
                component: GenericErrorComponent
            }
        ],
        canActivate: [
            AuthGuardEcm
        ]
    }
];

