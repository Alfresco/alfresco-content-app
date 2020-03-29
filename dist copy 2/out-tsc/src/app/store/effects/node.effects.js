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
import * as tslib_1 from 'tslib';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { map, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import {
  NodeActionTypes,
  getCurrentFolder,
  getAppSelection
} from '@alfresco/aca-shared/store';
import { ContentManagementService } from '../../services/content-management.service';
import { ViewUtilService } from '@alfresco/adf-core';
var NodeEffects = /** @class */ (function() {
  function NodeEffects(store, actions$, contentService, viewUtils) {
    var _this = this;
    this.store = store;
    this.actions$ = actions$;
    this.contentService = contentService;
    this.viewUtils = viewUtils;
    this.shareNode$ = this.actions$.pipe(
      ofType(NodeActionTypes.Share),
      map(function(action) {
        if (action.payload) {
          _this.contentService.shareNode(action.payload);
        } else {
          _this.store
            .select(getAppSelection)
            .pipe(take(1))
            .subscribe(function(selection) {
              if (selection && selection.file) {
                _this.contentService.shareNode(selection.file);
              }
            });
        }
      })
    );
    this.unshareNodes$ = this.actions$.pipe(
      ofType(NodeActionTypes.Unshare),
      map(function(action) {
        if (action && action.payload && action.payload.length > 0) {
          _this.contentService.unshareNodes(action.payload);
        } else {
          _this.store
            .select(getAppSelection)
            .pipe(take(1))
            .subscribe(function(selection) {
              if (selection && !selection.isEmpty) {
                _this.contentService.unshareNodes(selection.nodes);
              }
            });
        }
      })
    );
    this.purgeDeletedNodes$ = this.actions$.pipe(
      ofType(NodeActionTypes.PurgeDeleted),
      map(function(action) {
        if (action && action.payload && action.payload.length > 0) {
          _this.contentService.purgeDeletedNodes(action.payload);
        } else {
          _this.store
            .select(getAppSelection)
            .pipe(take(1))
            .subscribe(function(selection) {
              if (selection && selection.count > 0) {
                _this.contentService.purgeDeletedNodes(selection.nodes);
              }
            });
        }
      })
    );
    this.restoreDeletedNodes$ = this.actions$.pipe(
      ofType(NodeActionTypes.RestoreDeleted),
      map(function(action) {
        if (action && action.payload && action.payload.length > 0) {
          _this.contentService.restoreDeletedNodes(action.payload);
        } else {
          _this.store
            .select(getAppSelection)
            .pipe(take(1))
            .subscribe(function(selection) {
              if (selection && selection.count > 0) {
                _this.contentService.restoreDeletedNodes(selection.nodes);
              }
            });
        }
      })
    );
    this.deleteNodes$ = this.actions$.pipe(
      ofType(NodeActionTypes.Delete),
      map(function(action) {
        if (action && action.payload && action.payload.length > 0) {
          _this.contentService.deleteNodes(action.payload);
        } else {
          _this.store
            .select(getAppSelection)
            .pipe(take(1))
            .subscribe(function(selection) {
              if (selection && selection.count > 0) {
                _this.contentService.deleteNodes(selection.nodes);
              }
            });
        }
      })
    );
    this.undoDeleteNodes$ = this.actions$.pipe(
      ofType(NodeActionTypes.UndoDelete),
      map(function(action) {
        if (action.payload.length > 0) {
          _this.contentService.undoDeleteNodes(action.payload);
        }
      })
    );
    this.createFolder$ = this.actions$.pipe(
      ofType(NodeActionTypes.CreateFolder),
      map(function(action) {
        if (action.payload) {
          _this.contentService.createFolder(action.payload);
        } else {
          _this.store
            .select(getCurrentFolder)
            .pipe(take(1))
            .subscribe(function(node) {
              if (node && node.id) {
                _this.contentService.createFolder(node.id);
              }
            });
        }
      })
    );
    this.editFolder$ = this.actions$.pipe(
      ofType(NodeActionTypes.EditFolder),
      map(function(action) {
        if (action.payload) {
          _this.contentService.editFolder(action.payload);
        } else {
          _this.store
            .select(getAppSelection)
            .pipe(take(1))
            .subscribe(function(selection) {
              if (selection && selection.folder) {
                _this.contentService.editFolder(selection.folder);
              }
            });
        }
      })
    );
    this.copyNodes$ = this.actions$.pipe(
      ofType(NodeActionTypes.Copy),
      map(function(action) {
        if (action.payload && action.payload.length > 0) {
          _this.contentService.copyNodes(action.payload);
        } else {
          _this.store
            .select(getAppSelection)
            .pipe(take(1))
            .subscribe(function(selection) {
              if (selection && !selection.isEmpty) {
                _this.contentService.copyNodes(selection.nodes);
              }
            });
        }
      })
    );
    this.moveNodes$ = this.actions$.pipe(
      ofType(NodeActionTypes.Move),
      map(function(action) {
        if (action.payload && action.payload.length > 0) {
          _this.contentService.moveNodes(action.payload);
        } else {
          _this.store
            .select(getAppSelection)
            .pipe(take(1))
            .subscribe(function(selection) {
              if (selection && !selection.isEmpty) {
                _this.contentService.moveNodes(selection.nodes);
              }
            });
        }
      })
    );
    this.managePermissions$ = this.actions$.pipe(
      ofType(NodeActionTypes.ManagePermissions),
      map(function(action) {
        if (action && action.payload) {
          _this.contentService.managePermissions(action.payload);
        } else {
          _this.store
            .select(getAppSelection)
            .pipe(take(1))
            .subscribe(function(selection) {
              if (selection && !selection.isEmpty) {
                _this.contentService.managePermissions(selection.first);
              }
            });
        }
      })
    );
    this.manageVersions$ = this.actions$.pipe(
      ofType(NodeActionTypes.ManageVersions),
      map(function(action) {
        if (action && action.payload) {
          _this.contentService.manageVersions(action.payload);
        } else {
          _this.store
            .select(getAppSelection)
            .pipe(take(1))
            .subscribe(function(selection) {
              if (selection && selection.file) {
                _this.contentService.manageVersions(selection.file);
              }
            });
        }
      })
    );
    this.printFile$ = this.actions$.pipe(
      ofType(NodeActionTypes.PrintFile),
      map(function(action) {
        if (action && action.payload) {
          _this.printFile(action.payload);
        } else {
          _this.store
            .select(getAppSelection)
            .pipe(take(1))
            .subscribe(function(selection) {
              if (selection && selection.file) {
                _this.printFile(selection.file);
              }
            });
        }
      })
    );
    this.unlockWrite$ = this.actions$.pipe(
      ofType(NodeActionTypes.UnlockForWriting),
      map(function(action) {
        if (action && action.payload) {
          _this.contentService.unlockNode(action.payload);
        } else {
          _this.store
            .select(getAppSelection)
            .pipe(take(1))
            .subscribe(function(selection) {
              if (selection && selection.file) {
                _this.contentService.unlockNode(selection.file);
              }
            });
        }
      })
    );
  }
  NodeEffects.prototype.printFile = function(node) {
    if (node && node.entry) {
      // shared and favorite
      var id = node.entry.nodeId || node.entry.guid || node.entry.id;
      var mimeType = node.entry.content.mimeType;
      if (id) {
        this.viewUtils.printFileGeneric(id, mimeType);
      }
    }
  };
  tslib_1.__decorate(
    [Effect({ dispatch: false }), tslib_1.__metadata('design:type', Object)],
    NodeEffects.prototype,
    'shareNode$',
    void 0
  );
  tslib_1.__decorate(
    [Effect({ dispatch: false }), tslib_1.__metadata('design:type', Object)],
    NodeEffects.prototype,
    'unshareNodes$',
    void 0
  );
  tslib_1.__decorate(
    [Effect({ dispatch: false }), tslib_1.__metadata('design:type', Object)],
    NodeEffects.prototype,
    'purgeDeletedNodes$',
    void 0
  );
  tslib_1.__decorate(
    [Effect({ dispatch: false }), tslib_1.__metadata('design:type', Object)],
    NodeEffects.prototype,
    'restoreDeletedNodes$',
    void 0
  );
  tslib_1.__decorate(
    [Effect({ dispatch: false }), tslib_1.__metadata('design:type', Object)],
    NodeEffects.prototype,
    'deleteNodes$',
    void 0
  );
  tslib_1.__decorate(
    [Effect({ dispatch: false }), tslib_1.__metadata('design:type', Object)],
    NodeEffects.prototype,
    'undoDeleteNodes$',
    void 0
  );
  tslib_1.__decorate(
    [Effect({ dispatch: false }), tslib_1.__metadata('design:type', Object)],
    NodeEffects.prototype,
    'createFolder$',
    void 0
  );
  tslib_1.__decorate(
    [Effect({ dispatch: false }), tslib_1.__metadata('design:type', Object)],
    NodeEffects.prototype,
    'editFolder$',
    void 0
  );
  tslib_1.__decorate(
    [Effect({ dispatch: false }), tslib_1.__metadata('design:type', Object)],
    NodeEffects.prototype,
    'copyNodes$',
    void 0
  );
  tslib_1.__decorate(
    [Effect({ dispatch: false }), tslib_1.__metadata('design:type', Object)],
    NodeEffects.prototype,
    'moveNodes$',
    void 0
  );
  tslib_1.__decorate(
    [Effect({ dispatch: false }), tslib_1.__metadata('design:type', Object)],
    NodeEffects.prototype,
    'managePermissions$',
    void 0
  );
  tslib_1.__decorate(
    [Effect({ dispatch: false }), tslib_1.__metadata('design:type', Object)],
    NodeEffects.prototype,
    'manageVersions$',
    void 0
  );
  tslib_1.__decorate(
    [Effect({ dispatch: false }), tslib_1.__metadata('design:type', Object)],
    NodeEffects.prototype,
    'printFile$',
    void 0
  );
  tslib_1.__decorate(
    [Effect({ dispatch: false }), tslib_1.__metadata('design:type', Object)],
    NodeEffects.prototype,
    'unlockWrite$',
    void 0
  );
  NodeEffects = tslib_1.__decorate(
    [
      Injectable(),
      tslib_1.__metadata('design:paramtypes', [
        Store,
        Actions,
        ContentManagementService,
        ViewUtilService
      ])
    ],
    NodeEffects
  );
  return NodeEffects;
})();
export { NodeEffects };
//# sourceMappingURL=node.effects.js.map
