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
import { GenericErrorComponent } from './components/common/generic-error/generic-error.component';
import { SearchResultsComponent } from './components/search/search-results/search-results.component';
import { SearchLibrariesResultsComponent } from './components/search/search-libraries-results/search-libraries-results.component';
import { LoginComponent } from './components/login/login.component';
import { AppSharedRuleGuard } from '@alfresco/aca-shared';
import { AuthGuardEcm } from '@alfresco/adf-core';

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
    children: [
      {
        path: '',
        redirectTo: `/personal-files`,
        pathMatch: 'full'
      },
      {
        path: 'favorites',
        children: [
          {
            path: '',
            loadChildren:
              './components/favorites/favorites.module#AppFavoritesModule'
          },
          {
            path: 'preview/:nodeId',
            loadChildren: './components/preview/preview.module#PreviewModule',
            data: {
              navigateSource: 'favorites'
            }
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
          },
          {
            path: ':folderId',
            component: FilesComponent,
            data: {
              title: 'APP.BROWSE.LIBRARIES.MENU.MY_LIBRARIES.TITLE',
              sortingPreferenceKey: 'libraries-files'
            }
          },
          {
            path: ':folderId/preview/:nodeId',
            loadChildren: './components/preview/preview.module#PreviewModule',
            data: {
              navigateSource: 'libraries'
            }
          }
        ]
      },
      {
        path: 'favorite/libraries',
        component: FavoriteLibrariesComponent,
        data: {
          title: 'APP.BROWSE.LIBRARIES.MENU.FAVORITE_LIBRARIES.TITLE',
          sortingPreferenceKey: 'favorite-libraries'
        }
      },
      {
        path: 'personal-files',
        data: {
          sortingPreferenceKey: 'personal-files'
        },
        children: [
          {
            path: '',
            component: FilesComponent,
            data: {
              title: 'APP.BROWSE.PERSONAL.TITLE',
              defaultNodeId: '-my-'
            }
          },
          {
            path: ':folderId',
            component: FilesComponent,
            data: {
              title: 'APP.BROWSE.PERSONAL.TITLE'
            }
          },
          {
            path: 'preview/:nodeId',
            loadChildren: './components/preview/preview.module#PreviewModule',
            data: {
              navigateSource: 'personal-files'
            }
          },
          {
            path: ':folderId/preview/:nodeId',
            loadChildren: './components/preview/preview.module#PreviewModule',
            data: {
              navigateSource: 'personal-files'
            }
          }
          // Do not remove, will be enabled in future iterations
          // {
          //   path: 'view/:nodeId',
          //   outlet: 'viewer',
          //   children: [
          //     {
          //       path: '',
          //       loadChildren:
          //         './components/viewer/viewer.module#AppViewerModule'
          //     }
          //   ]
          // }
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
            loadChildren:
              './components/recent-files/recent-files.module#AppRecentFilesModule'
          },
          {
            path: 'preview/:nodeId',
            loadChildren: './components/preview/preview.module#PreviewModule',
            data: {
              navigateSource: 'recent-files'
            }
          }
        ]
      },
      {
        path: 'shared',
        children: [
          {
            path: '',
            loadChildren:
              './components/shared-files/shared-files.module#AppSharedFilesModule'
          },
          {
            path: 'preview/:nodeId',
            loadChildren: './components/preview/preview.module#PreviewModule',
            data: {
              navigateSource: 'shared'
            }
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
              title: 'APP.BROWSE.SEARCH.TITLE',
              reuse: true
            }
          },
          {
            path: 'preview/:nodeId',
            loadChildren: './components/preview/preview.module#PreviewModule',
            data: {
              navigateSource: 'search'
            }
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
            path: 'preview/:nodeId',
            loadChildren: './components/preview/preview.module#PreviewModule',
            data: {
              navigateSource: 'search'
            }
          }
        ]
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
