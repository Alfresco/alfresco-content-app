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

import { Routes } from '@angular/router';
import { AppLayoutComponent } from './components/layout/app-layout/app-layout.component';
import { FilesComponent } from './components/files/files.component';
import { LibrariesComponent } from './components/libraries/libraries.component';
import { FavoriteLibrariesComponent } from './components/favorite-libraries/favorite-libraries.component';
import { SearchResultsComponent } from './components/search/search-results/search-results.component';
import { SearchLibrariesResultsComponent } from './components/search/search-libraries-results/search-libraries-results.component';
import { LoginComponent } from './components/login/login.component';
import {
  AppSharedRuleGuard,
  GenericErrorComponent
} from '@alfresco/aca-shared';
import { AuthGuardEcm, AuthGuard } from '@alfresco/adf-core';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { RecentFilesComponent } from './components/recent-files/recent-files.component';
import { SharedFilesComponent } from './components/shared-files/shared-files.component';

export const APP_ROUTES: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'APP.SIGN_IN'
    }
  },
  {
    path: 'settings',
    loadChildren: './components/settings/settings.module#AppSettingsModule'
  },
  {
    path: 'preview/s/:id',
    loadChildren:
      './components/shared-link-view/shared-link-view.module#AppSharedLinkViewModule'
  },
  {
    path: 'view',
    component: AppLayoutComponent,
    children: [
      {
        path: ':nodeId',
        outlet: 'viewer',
        children: [
          {
            path: '',
            loadChildren: './components/viewer/viewer.module#AppViewerModule'
          }
        ]
      }
    ]
  },
  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: `/personal-files`,
        pathMatch: 'full'
      },
      {
        path: 'personal-files',
        children: [
          {
            path: '',
            component: FilesComponent,
            data: {
              sortingPreferenceKey: 'personal-files',
              title: 'APP.BROWSE.PERSONAL.TITLE',
              defaultNodeId: '-my-'
            }
          },
          // deprecated, backwards compatibility with ACA 1.8
          {
            path: 'preview/:nodeId',
            loadChildren: './components/preview/preview.module#PreviewModule',
            data: {
              navigateSource: 'personal-files'
            }
          },
          {
            path: 'view/:nodeId',
            outlet: 'viewer',
            children: [
              {
                path: '',
                data: {
                  navigateSource: 'personal-files'
                },
                loadChildren:
                  './components/viewer/viewer.module#AppViewerModule'
              }
            ]
          }
        ]
      },
      {
        path: 'personal-files/:folderId',
        children: [
          {
            path: '',
            component: FilesComponent,
            data: {
              title: 'APP.BROWSE.PERSONAL.TITLE',
              sortingPreferenceKey: 'personal-files'
            }
          },
          // deprecated, backwards compatibility with ACA 1.8
          {
            path: 'preview/:nodeId',
            loadChildren: './components/preview/preview.module#PreviewModule',
            data: {
              navigateSource: 'personal-files'
            }
          },
          // deprecated, backwards compatibility with ACA 1.8
          {
            path: ':folderId/preview/:nodeId',
            loadChildren: './components/preview/preview.module#PreviewModule',
            data: {
              navigateSource: 'personal-files'
            }
          },
          {
            path: 'view/:nodeId',
            outlet: 'viewer',
            children: [
              {
                path: '',
                data: {
                  navigateSource: 'personal-files'
                },
                loadChildren:
                  './components/viewer/viewer.module#AppViewerModule'
              }
            ]
          }
        ]
      },
      {
        path: 'libraries',
        children: [
          {
            path: '',
            component: LibrariesComponent,
            data: {
              title: 'APP.BROWSE.LIBRARIES.MENU.MY_LIBRARIES.TITLE',
              sortingPreferenceKey: 'libraries'
            }
          }
        ]
      },
      {
        path: 'libraries/:folderId',
        children: [
          {
            path: '',
            component: FilesComponent,
            data: {
              title: 'APP.BROWSE.LIBRARIES.MENU.MY_LIBRARIES.TITLE',
              sortingPreferenceKey: 'libraries-files'
            }
          },
          // deprecated, backwards compatibility with ACA 1.8
          {
            path: 'preview/:nodeId',
            loadChildren: './components/preview/preview.module#PreviewModule',
            data: {
              navigateSource: 'libraries'
            }
          },
          {
            path: 'view/:nodeId',
            outlet: 'viewer',
            children: [
              {
                path: '',
                data: {
                  navigateSource: 'libraries'
                },
                loadChildren:
                  './components/viewer/viewer.module#AppViewerModule'
              }
            ]
          }
        ]
      },
      {
        path: 'favorite/libraries',
        children: [
          {
            path: '',
            component: FavoriteLibrariesComponent,
            data: {
              title: 'APP.BROWSE.LIBRARIES.MENU.FAVORITE_LIBRARIES.TITLE',
              sortingPreferenceKey: 'favorite-libraries'
            }
          }
        ]
      },
      {
        path: 'favorites',
        data: {
          sortingPreferenceKey: 'favorites'
        },
        children: [
          {
            path: '',
            component: FavoritesComponent,
            data: {
              title: 'APP.BROWSE.FAVORITES.TITLE',
              sortingPreferenceKey: 'favorites'
            }
            // loadChildren:
            //   './components/favorites/favorites.module#AppFavoritesModule'
          },
          // deprecated, backwards compatibility with ACA 1.8
          {
            path: 'preview/:nodeId',
            loadChildren: './components/preview/preview.module#PreviewModule',
            data: {
              navigateSource: 'favorites'
            }
          },
          {
            path: 'view/:nodeId',
            outlet: 'viewer',
            children: [
              {
                path: '',
                data: {
                  navigateSource: 'favorites'
                },
                loadChildren:
                  './components/viewer/viewer.module#AppViewerModule'
              }
            ]
          }
        ]
      },
      {
        path: 'recent-files',
        data: {
          sortingPreferenceKey: 'recent-files'
        },
        children: [
          {
            path: '',
            component: RecentFilesComponent,
            data: {
              title: 'APP.BROWSE.RECENT.TITLE'
            }
            // loadChildren:
            //   './components/recent-files/recent-files.module#AppRecentFilesModule'
          },
          // deprecated, backwards compatibility with ACA 1.8
          {
            path: 'preview/:nodeId',
            loadChildren: './components/preview/preview.module#PreviewModule',
            data: {
              navigateSource: 'recent-files'
            }
          },
          {
            path: 'view/:nodeId',
            outlet: 'viewer',
            children: [
              {
                path: '',
                data: {
                  navigateSource: 'recent-files'
                },
                loadChildren:
                  './components/viewer/viewer.module#AppViewerModule'
              }
            ]
          }
        ]
      },
      {
        path: 'shared',
        children: [
          {
            path: '',
            data: {
              title: 'APP.BROWSE.SHARED.TITLE',
              sortingPreferenceKey: 'shared-files'
            },
            component: SharedFilesComponent
            // loadChildren:
            //   './components/shared-files/shared-files.module#AppSharedFilesModule'
          },
          // deprecated, backwards compatibility with ACA 1.8
          {
            path: 'preview/:nodeId',
            loadChildren: './components/preview/preview.module#PreviewModule',
            data: {
              navigateSource: 'shared'
            }
          },
          {
            path: 'view/:nodeId',
            outlet: 'viewer',
            children: [
              {
                path: '',
                data: {
                  navigateSource: 'shared'
                },
                loadChildren:
                  './components/viewer/viewer.module#AppViewerModule'
              }
            ]
          }
        ],
        canActivateChild: [AppSharedRuleGuard],
        canActivate: [AppSharedRuleGuard]
      },
      {
        path: 'trashcan',
        loadChildren: './components/trashcan/trashcan.module#AppTrashcanModule'
      },
      {
        path: 'about',
        loadChildren: './components/about/about.module#AboutModule'
      },
      {
        path: 'search',
        children: [
          {
            path: '',
            component: SearchResultsComponent,
            data: {
              title: 'APP.BROWSE.SEARCH.TITLE'
            }
          },
          // deprecated, backwards compatibility with ACA 1.8
          {
            path: 'preview/:nodeId',
            loadChildren: './components/preview/preview.module#PreviewModule',
            data: {
              navigateSource: 'search'
            }
          },
          {
            path: 'view/:nodeId',
            outlet: 'viewer',
            children: [
              {
                path: '',
                data: {
                  navigateSource: 'search'
                },
                loadChildren:
                  './components/viewer/viewer.module#AppViewerModule'
              }
            ]
          }
        ]
      },
      {
        path: 'search-libraries',
        children: [
          {
            path: '',
            component: SearchLibrariesResultsComponent,
            data: {
              title: 'APP.BROWSE.SEARCH.TITLE'
            }
          },
          {
            path: 'view/:nodeId',
            outlet: 'viewer',
            children: [
              {
                path: '',
                data: {
                  navigateSource: 'search'
                },
                loadChildren:
                  './components/viewer/viewer.module#AppViewerModule'
              }
            ]
          }
        ]
      },
      {
        path: '**',
        component: GenericErrorComponent
      }
    ],
    canActivateChild: [AuthGuardEcm]
  }
];
