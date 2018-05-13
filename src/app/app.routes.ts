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

import { Routes } from '@angular/router';
import { AuthGuardEcm } from '@alfresco/adf-core';

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
import { SearchComponent } from './components/search/search.component';

export const APP_ROUTES: Routes = [
    {
        path: 'login',
        component: LoginComponent,
        data: {
            i18nTitle: 'APP.SIGN_IN'
        }
    },
    {
        path: 'personal-files/:folderId/preview/:nodeId',
        component: PreviewComponent,
        data: {
            i18nTitle: 'APP.PREVIEW.TITLE',
            navigateMultiple: true,
            navigateSource: 'personal-files'
        }
    },
    {
        path: 'personal-files/preview/:nodeId',
        component: PreviewComponent,
        data: {
            i18nTitle: 'APP.PREVIEW.TITLE',
            navigateMultiple: true,
            navigateSource: 'personal-files'
        }
    },
    {
        path: 'favorites/preview/:nodeId',
        component: PreviewComponent,
        data: {
            i18nTitle: 'APP.PREVIEW.TITLE',
            navigateMultiple: true,
            navigateSource: 'favorites'
        }
    },
    {
        path: 'libraries/:folderId/preview/:nodeId',
        component: PreviewComponent,
        data: {
            i18nTitle: 'APP.PREVIEW.TITLE',
            navigateMultiple: true,
            navigateSource: 'libraries'
        }
    },
    {
        path: 'recent-files/preview/:nodeId',
        component: PreviewComponent,
        data: {
            i18nTitle: 'APP.PREVIEW.TITLE',
            navigateMultiple: true,
            navigateSource: 'recent-files'
        }
    },
    {
        path: 'shared/preview/:nodeId',
        component: PreviewComponent,
        data: {
            i18nTitle: 'APP.PREVIEW.TITLE',
            navigateMultiple: true,
            navigateSource: 'shared'
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
                data: {
                    preferencePrefix: 'favorites'
                },
                children: [
                    {
                        path: '',
                        component: FavoritesComponent,
                        data: {
                            i18nTitle: 'APP.BROWSE.FAVORITES.TITLE'
                        }
                    }
                ]
            },
            {
                path: 'libraries',
                data: {
                    preferencePrefix: 'libraries'
                },
                children: [{
                    path: '',
                    component: LibrariesComponent,
                    data: {
                        i18nTitle: 'APP.BROWSE.LIBRARIES.TITLE'
                    }
                }, {
                    path: ':folderId',
                    component: FilesComponent,
                    data: {
                        i18nTitle: 'APP.BROWSE.LIBRARIES.TITLE',
                        preferencePrefix: 'libraries-files'
                    }
                }
                ]
            },
            {
                path: 'personal-files',
                data: {
                    preferencePrefix: 'personal-files'
                },
                children: [
                    {
                        path: '',
                        component: FilesComponent,
                        data: {
                            i18nTitle: 'APP.BROWSE.PERSONAL.TITLE',
                            defaultNodeId: '-my-'
                        }
                    },
                    {
                        path: ':folderId',
                        component: FilesComponent,
                        data: {
                            i18nTitle: 'APP.BROWSE.PERSONAL.TITLE'
                        }
                    }
                ]
            },
            {
                path: 'recent-files',
                data: {
                    preferencePrefix: 'recent-files'
                },
                children: [
                    {
                        path: '',
                        component: RecentFilesComponent,
                        data: {
                            i18nTitle: 'APP.BROWSE.RECENT.TITLE'
                        }
                    }
                ]
            },
            {
                path: 'shared',
                data: {
                    preferencePrefix: 'shared-files'
                },
                children: [
                    {
                        path: '',
                        component: SharedFilesComponent,
                        data: {
                            i18nTitle: 'APP.BROWSE.SHARED.TITLE'
                        }
                    }
                ]
            },
            {
                path: 'trashcan',
                component: TrashcanComponent,
                data: {
                    i18nTitle: 'APP.BROWSE.TRASHCAN.TITLE',
                    preferencePrefix: 'trashcan'
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
                path: 'search',
                component: SearchComponent
            },
            {
                path: '**',
                component: GenericErrorComponent
            }
        ],
        canActivateChild: [AuthGuardEcm],
        canActivate: [AuthGuardEcm]
    }
];

