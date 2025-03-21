/*!
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject, Injectable } from '@angular/core';
import { map, take, tap } from 'rxjs/operators';
import {
  AppStore,
  FullscreenViewerAction,
  getAppSelection,
  getCurrentFolder,
  PluginPreviewAction,
  ViewerActionTypes,
  ViewFileAction,
  ViewNodeAction,
  ViewNodeVersionAction
} from '@alfresco/aca-shared/store';
import { PRIMARY_OUTLET, Router, UrlSegment, UrlSegmentGroup, UrlTree } from '@angular/router';
import { createSelector, Store } from '@ngrx/store';
import { AppExtensionService } from '@alfresco/aca-shared';
import { MatDialog } from '@angular/material/dialog';

export const fileToPreview = createSelector(getAppSelection, getCurrentFolder, (selection, folder) => ({
  selection,
  folder
}));

@Injectable()
export class ViewerEffects {
  private store = inject(Store<AppStore>);
  private actions$ = inject(Actions);
  private router = inject(Router);
  private extensions = inject(AppExtensionService);
  private dialog = inject(MatDialog);

  fullscreenViewer$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<FullscreenViewerAction>(ViewerActionTypes.FullScreen),
        map(() => {
          this.enterFullScreen();
        })
      ),
    { dispatch: false }
  );

  viewNode$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<ViewNodeAction>(ViewerActionTypes.ViewNode),
        map((action) => {
          if (action.viewNodeExtras) {
            const { location, path } = action.viewNodeExtras;

            if (location) {
              const navigation = this.getNavigationCommands(location);

              this.router.navigate([...navigation, { outlets: { viewer: ['view', action.nodeId] } }], {
                queryParams: { location }
              });
            }

            if (path) {
              this.router.navigate(['view', { outlets: { viewer: [action.nodeId] } }], {
                queryParams: { path }
              });
            }
          } else {
            this.router.navigate(['view', { outlets: { viewer: [action.nodeId] } }]);
          }
        })
      ),
    { dispatch: false }
  );

  viewFile$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<ViewFileAction>(ViewerActionTypes.ViewFile),
        map((action) => {
          if (action.payload?.entry) {
            const { id, nodeId, isFile } = action.payload.entry as any;

            if (this.extensions.canPreviewNode(action.payload) && (isFile || nodeId)) {
              this.displayPreview(nodeId || id, action.parentId);
            }
          } else {
            this.store
              .select(fileToPreview)
              .pipe(take(1))
              .subscribe((result) => {
                if (result.selection?.file) {
                  const { id, nodeId, isFile } = result.selection.file.entry as any;

                  if (this.extensions.canPreviewNode(action.payload) && (isFile || nodeId)) {
                    const parentId = result.folder ? result.folder.id : null;
                    this.displayPreview(nodeId || id, parentId);
                  }
                }
              });
          }
        })
      ),
    { dispatch: false }
  );

  viewNodeVersion$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<ViewNodeVersionAction>(ViewerActionTypes.ViewNodeVersion),
        map((action) => {
          this.dialog.closeAll();
          if (action.viewNodeExtras) {
            const { location, path } = action.viewNodeExtras;
            if (location) {
              const navigation = this.getNavigationCommands(location);
              this.router.navigate([...navigation, { outlets: { viewer: ['view', action.nodeId, action.versionId] } }], {
                queryParams: { location }
              });
            }

            if (path) {
              this.router.navigate(['view', { outlets: { viewer: [action.nodeId, action.versionId] } }], {
                queryParams: { path }
              });
            }
          } else {
            this.router.navigate(['view', { outlets: { viewer: [action.nodeId, action.versionId] } }]);
          }
        })
      ),
    { dispatch: false }
  );

  pluginPreview$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<PluginPreviewAction>(ViewerActionTypes.PluginPreview),
        tap((action) => {
          this.router.navigate([
            action.pluginRoute,
            {
              outlets: {
                viewer: ['preview', action.nodeId]
              }
            }
          ]);
        })
      ),
    { dispatch: false }
  );

  private displayPreview(nodeId: string, parentId: string) {
    if (!nodeId) {
      return;
    }

    let previewLocation = this.router.url;
    if (previewLocation.lastIndexOf('/') > 0) {
      previewLocation = previewLocation.substring(0, this.router.url.indexOf('/', 1));
    }
    previewLocation = previewLocation.replace(/\//g, '');

    const path = [previewLocation];
    if (parentId) {
      path.push(parentId);
    }
    path.push('preview', nodeId);
    this.router.navigateByUrl(path.join('/'));
  }

  enterFullScreen() {
    const container: any = document.documentElement.querySelector('.adf-viewer__fullscreen-container');
    if (container) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
      } else if (container.mozRequestFullScreen) {
        container.mozRequestFullScreen();
      } else if (container.msRequestFullscreen) {
        container.msRequestFullscreen();
      }
    }
  }

  private getNavigationCommands(url: string): any[] {
    const urlTree: UrlTree = this.router.parseUrl(url);
    const urlSegmentGroup: UrlSegmentGroup = urlTree.root.children[PRIMARY_OUTLET];

    if (!urlSegmentGroup) {
      return [url];
    }

    const urlSegments: UrlSegment[] = urlSegmentGroup.segments;

    return urlSegments.reduce(function (acc, item) {
      acc.push(item.path, item.parameters);
      return acc;
    }, []);
  }
}
