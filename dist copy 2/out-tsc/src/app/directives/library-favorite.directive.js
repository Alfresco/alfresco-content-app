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
import {
  Directive,
  HostListener,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { AlfrescoApiService } from '@alfresco/adf-core';
var LibraryFavoriteDirective = /** @class */ (function() {
  function LibraryFavoriteDirective(alfrescoApiService) {
    this.alfrescoApiService = alfrescoApiService;
    this.library = null;
    this.toggle = new EventEmitter();
    this.error = new EventEmitter();
    this.targetLibrary = null;
  }
  LibraryFavoriteDirective.prototype.onClick = function() {
    this.toggleFavorite();
  };
  LibraryFavoriteDirective.prototype.ngOnChanges = function(changes) {
    if (!changes.library.currentValue) {
      this.targetLibrary = null;
      return;
    }
    this.targetLibrary = changes.library.currentValue;
    this.markFavoriteLibrary(changes.library.currentValue);
  };
  LibraryFavoriteDirective.prototype.isFavorite = function() {
    return this.targetLibrary && this.targetLibrary.isFavorite;
  };
  LibraryFavoriteDirective.prototype.toggleFavorite = function() {
    if (this.targetLibrary.isFavorite) {
      this.removeFavorite(this.targetLibrary.entry.guid);
    } else {
      var favoriteBody = this.createFavoriteBody(this.targetLibrary);
      this.addFavorite(favoriteBody);
    }
  };
  LibraryFavoriteDirective.prototype.markFavoriteLibrary = function(library) {
    return tslib_1.__awaiter(this, void 0, void 0, function() {
      return tslib_1.__generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            if (!(this.targetLibrary.isFavorite === undefined))
              return [3 /*break*/, 2];
            return [4 /*yield*/, this.getFavoriteSite(library)];
          case 1:
            _a.sent();
            return [3 /*break*/, 3];
          case 2:
            this.targetLibrary = library;
            _a.label = 3;
          case 3:
            return [2 /*return*/];
        }
      });
    });
  };
  LibraryFavoriteDirective.prototype.getFavoriteSite = function(library) {
    var _this = this;
    this.alfrescoApiService.peopleApi
      .getFavoriteSite('-me-', library.entry.id)
      .then(function() {
        return (_this.targetLibrary.isFavorite = true);
      })
      .catch(function() {
        return (_this.targetLibrary.isFavorite = false);
      });
  };
  LibraryFavoriteDirective.prototype.createFavoriteBody = function(library) {
    return {
      target: {
        site: {
          guid: library.entry.guid
        }
      }
    };
  };
  LibraryFavoriteDirective.prototype.addFavorite = function(favoriteBody) {
    var _this = this;
    this.alfrescoApiService.peopleApi
      .addFavorite('-me-', favoriteBody)
      .then(function(libraryEntry) {
        _this.targetLibrary.isFavorite = true;
        _this.toggle.emit(libraryEntry);
      })
      .catch(function(error) {
        return _this.error.emit(error);
      });
  };
  LibraryFavoriteDirective.prototype.removeFavorite = function(favoriteId) {
    var _this = this;
    this.alfrescoApiService.favoritesApi
      .removeFavoriteSite('-me-', favoriteId)
      .then(function(libraryBody) {
        _this.targetLibrary.isFavorite = false;
        _this.toggle.emit(libraryBody);
      })
      .catch(function(error) {
        return _this.error.emit(error);
      });
  };
  tslib_1.__decorate(
    [Input('acaFavoriteLibrary'), tslib_1.__metadata('design:type', Object)],
    LibraryFavoriteDirective.prototype,
    'library',
    void 0
  );
  tslib_1.__decorate(
    [Output(), tslib_1.__metadata('design:type', EventEmitter)],
    LibraryFavoriteDirective.prototype,
    'toggle',
    void 0
  );
  tslib_1.__decorate(
    [Output(), tslib_1.__metadata('design:type', EventEmitter)],
    LibraryFavoriteDirective.prototype,
    'error',
    void 0
  );
  tslib_1.__decorate(
    [
      HostListener('click'),
      tslib_1.__metadata('design:type', Function),
      tslib_1.__metadata('design:paramtypes', []),
      tslib_1.__metadata('design:returntype', void 0)
    ],
    LibraryFavoriteDirective.prototype,
    'onClick',
    null
  );
  LibraryFavoriteDirective = tslib_1.__decorate(
    [
      Directive({
        selector: '[acaFavoriteLibrary]',
        exportAs: 'favoriteLibrary'
      }),
      tslib_1.__metadata('design:paramtypes', [AlfrescoApiService])
    ],
    LibraryFavoriteDirective
  );
  return LibraryFavoriteDirective;
})();
export { LibraryFavoriteDirective };
//# sourceMappingURL=library-favorite.directive.js.map
