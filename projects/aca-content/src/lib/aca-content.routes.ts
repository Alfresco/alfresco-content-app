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

import { FilesComponent } from './components/files/files.component';
import { LibrariesComponent } from './components/libraries/libraries.component';
import { FavoriteLibrariesComponent } from './components/favorite-libraries/favorite-libraries.component';
import { SearchResultsComponent } from './components/search/search-results/search-results.component';
import { SearchLibrariesResultsComponent } from './components/search/search-libraries-results/search-libraries-results.component';
import { AppSharedRuleGuard, GenericErrorComponent, ExtensionRoute, ExtensionsDataLoaderGuard } from '@alfresco/aca-shared';
import { AuthGuard } from '@alfresco/adf-core';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { RecentFilesComponent } from './components/recent-files/recent-files.component';
import { SharedFilesComponent } from './components/shared-files/shared-files.component';
import { DetailsComponent } from './components/details/details.component';
import { HomeComponent } from './components/home/home.component';
import { ViewProfileComponent } from './components/view-profile/view-profile.component';
import { ViewProfileRuleGuard } from './components/view-profile/view-profile.guard';
import { Route } from '@angular/router';
import { SharedLinkViewComponent } from './components/shared-link-view/shared-link-view.component';
import { TrashcanComponent } from './components/trashcan/trashcan.component';
import { ShellLayoutComponent } from '@alfresco/adf-core/shell';

export const CONTENT_ROUTES: ExtensionRoute[] = [
  {
    path: 'preview/s/:id',
    children: [
      {
        path: '',
        component: SharedLinkViewComponent,
        data: {
          title: 'APP.PREVIEW.TITLE'
        }
      }
    ]
  },
  {
    path: 'view',
    component: ShellLayoutComponent,
    children: [
      {
        path: ':nodeId',
        outlet: 'viewer',
        children: [
          {
            path: '',
            loadChildren: () => import('@alfresco/aca-viewer').then((m) => m.AcaViewerModule)
          }
        ]
      }
    ]
  }
];

export const CONTENT_LAYOUT_ROUTES: Route = {
  path: '',
  canActivate: [ExtensionsDataLoaderGuard],
  children: [
    {
      path: 'profile',
      canActivate: [ViewProfileRuleGuard],
      component: ViewProfileComponent
    },
    {
      path: '',
      component: HomeComponent
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
        {
          path: 'details/:nodeId',
          children: [
            {
              path: '',
              component: DetailsComponent,
              data: {
                navigateSource: 'personal-files'
              }
            },
            {
              path: ':activeTab',
              component: DetailsComponent,
              data: {
                title: 'APP.BROWSE.PERSONAL.PERMISSIONS.TITLE',
                navigateSource: 'personal-files'
              }
            }
          ]
        },
        // deprecated, backwards compatibility with ACA 1.8
        {
          path: 'preview/:nodeId',
          loadChildren: () => import('@alfresco/aca-preview').then((m) => m.PreviewModule),
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
              loadChildren: () => import('@alfresco/aca-viewer').then((m) => m.AcaViewerModule)
            }
          ]
        },
        {
          path: 'view/:nodeId/:versionId',
          outlet: 'viewer',
          children: [
            {
              path: '',
              data: {
                navigateSource: 'personal-files'
              },
              loadChildren: () => import('@alfresco/aca-viewer').then((m) => m.AcaViewerModule)
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
        {
          path: 'view/:nodeId/:versionId',
          outlet: 'viewer',
          children: [
            {
              path: '',
              data: {
                navigateSource: 'personal-files'
              },
              loadChildren: () => import('@alfresco/aca-viewer').then((m) => m.AcaViewerModule)
            }
          ]
        },
        // deprecated, backwards compatibility with ACA 1.8
        {
          path: 'preview/:nodeId',
          loadChildren: () => import('@alfresco/aca-preview').then((m) => m.PreviewModule),
          data: {
            navigateSource: 'personal-files'
          }
        },
        // deprecated, backwards compatibility with ACA 1.8
        {
          path: ':folderId/preview/:nodeId',
          loadChildren: () => import('@alfresco/aca-preview').then((m) => m.PreviewModule),
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
              loadChildren: () => import('@alfresco/aca-viewer').then((m) => m.AcaViewerModule)
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
          loadChildren: () => import('@alfresco/aca-preview').then((m) => m.PreviewModule),
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
              loadChildren: () => import('@alfresco/aca-viewer').then((m) => m.AcaViewerModule)
            }
          ],
          data: {
            navigateSource: 'libraries'
          }
        },
        {
          path: 'view/:nodeId/:versionId',
          outlet: 'viewer',
          children: [
            {
              path: '',
              data: {
                navigateSource: 'libraries'
              },
              loadChildren: () => import('@alfresco/aca-viewer').then((m) => m.AcaViewerModule)
            }
          ]
        }
      ]
    },
    {
      path: 'favorite',
      children: [
        {
          path: '',
          pathMatch: 'full',
          redirectTo: 'libraries'
        },
        {
          path: 'libraries',
          component: FavoriteLibrariesComponent,
          data: {
            title: 'APP.BROWSE.LIBRARIES.MENU.FAVORITE_LIBRARIES.TITLE',
            sortingPreferenceKey: 'favorite-libraries'
          }
        }
      ]
    },
    {
      path: 'favorite/libraries/:folderId',
      children: [
        {
          path: '',
          component: FilesComponent,
          data: {
            title: 'APP.BROWSE.LIBRARIES.MENU.FAVORITE_LIBRARIES.TITLE',
            sortingPreferenceKey: 'libraries-files'
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
              loadChildren: () => import('@alfresco/aca-viewer').then((m) => m.AcaViewerModule)
            }
          ]
        },
        {
          path: 'view/:nodeId/:versionId',
          outlet: 'viewer',
          children: [
            {
              path: '',
              data: {
                navigateSource: 'libraries'
              },
              loadChildren: () => import('@alfresco/aca-viewer').then((m) => m.AcaViewerModule)
            }
          ]
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
          loadChildren: () => import('@alfresco/aca-preview').then((m) => m.PreviewModule),
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
              loadChildren: () => import('@alfresco/aca-viewer').then((m) => m.AcaViewerModule)
            }
          ]
        },
        {
          path: 'view/:nodeId/:versionId',
          outlet: 'viewer',
          children: [
            {
              path: '',
              data: {
                navigateSource: 'favorites'
              },
              loadChildren: () => import('@alfresco/aca-viewer').then((m) => m.AcaViewerModule)
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
          loadChildren: () => import('@alfresco/aca-preview').then((m) => m.PreviewModule),
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
              loadChildren: () => import('@alfresco/aca-viewer').then((m) => m.AcaViewerModule)
            }
          ]
        },
        {
          path: 'view/:nodeId/:versionId',
          outlet: 'viewer',
          children: [
            {
              path: '',
              data: {
                navigateSource: 'recent-files'
              },
              loadChildren: () => import('@alfresco/aca-viewer').then((m) => m.AcaViewerModule)
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
          loadChildren: () => import('@alfresco/aca-preview').then((m) => m.PreviewModule),
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
              loadChildren: () => import('@alfresco/aca-viewer').then((m) => m.AcaViewerModule)
            }
          ]
        },
        {
          path: 'view/:nodeId/:versionId',
          outlet: 'viewer',
          children: [
            {
              path: '',
              data: {
                navigateSource: 'shared'
              },
              loadChildren: () => import('@alfresco/aca-viewer').then((m) => m.AcaViewerModule)
            }
          ]
        }
      ],
      canActivateChild: [AppSharedRuleGuard],
      canActivate: [AppSharedRuleGuard]
    },
    {
      path: 'trashcan',
      children: [
        {
          path: '',
          component: TrashcanComponent,
          data: {
            title: 'APP.BROWSE.TRASHCAN.TITLE',
            sortingPreferenceKey: 'trashcan'
          }
        }
      ]
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
          loadChildren: () => import('@alfresco/aca-preview').then((m) => m.PreviewModule),
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
              loadChildren: () => import('@alfresco/aca-viewer').then((m) => m.AcaViewerModule)
            }
          ]
        },
        {
          path: 'view/:nodeId/:versionId',
          outlet: 'viewer',
          children: [
            {
              path: '',
              data: {
                navigateSource: 'search'
              },
              loadChildren: () => import('@alfresco/aca-viewer').then((m) => m.AcaViewerModule)
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
              loadChildren: () => import('@alfresco/aca-viewer').then((m) => m.AcaViewerModule)
            }
          ]
        }
      ]
    },
    {
      path: 'nodes/:nodeId',
      children: [
        {
          path: '',
          loadChildren: () => import('@alfresco/aca-folder-rules').then((m) => m.AcaFolderRulesModule)
        }
      ]
    },
    {
      path: '**',
      component: GenericErrorComponent
    }
  ],
  canActivateChild: [AuthGuard]
};
