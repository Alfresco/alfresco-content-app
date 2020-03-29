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
import { Component, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SiteEntry } from '@alfresco/js-api';
import { Store } from '@ngrx/store';
import { UpdateLibraryAction } from '@alfresco/aca-shared/store';
import { debounceTime, mergeMap, takeUntil } from 'rxjs/operators';
import { AlfrescoApiService } from '@alfresco/adf-core';
import { from, Subject } from 'rxjs';
var LibraryMetadataFormComponent = /** @class */ (function() {
  function LibraryMetadataFormComponent(alfrescoApiService, store) {
    this.alfrescoApiService = alfrescoApiService;
    this.store = store;
    this.libraryTitleExists = false;
    this.libraryType = [
      { value: 'PUBLIC', label: 'LIBRARY.VISIBILITY.PUBLIC' },
      { value: 'PRIVATE', label: 'LIBRARY.VISIBILITY.PRIVATE' },
      { value: 'MODERATED', label: 'LIBRARY.VISIBILITY.MODERATED' }
    ];
    this.form = new FormGroup({
      id: new FormControl({ value: '', disabled: true }),
      title: new FormControl({ value: '' }, [
        Validators.required,
        Validators.maxLength(256)
      ]),
      description: new FormControl({ value: '' }, [Validators.maxLength(512)]),
      visibility: new FormControl(this.libraryType[0].value)
    });
    this.onDestroy$ = new Subject();
  }
  Object.defineProperty(
    LibraryMetadataFormComponent.prototype,
    'canUpdateLibrary',
    {
      get: function() {
        return (
          this.node && this.node.entry && this.node.entry.role === 'SiteManager'
        );
      },
      enumerable: true,
      configurable: true
    }
  );
  LibraryMetadataFormComponent.prototype.getVisibilityLabel = function(value) {
    return this.libraryType.find(function(type) {
      return type.value === value;
    }).label;
  };
  LibraryMetadataFormComponent.prototype.toggleEdit = function() {
    this.edit = !this.edit;
  };
  LibraryMetadataFormComponent.prototype.cancel = function() {
    this.updateForm(this.node);
    this.toggleEdit();
  };
  LibraryMetadataFormComponent.prototype.ngOnInit = function() {
    var _this = this;
    this.updateForm(this.node);
    this.form.controls['title'].valueChanges
      .pipe(
        debounceTime(300),
        mergeMap(function(title) {
          return _this.findLibraryByTitle(title);
        }),
        takeUntil(this.onDestroy$)
      )
      .subscribe(function(result) {
        var entries = result.list.entries;
        if (entries.length) {
          if (_this.form.controls.title.value === _this.node.entry.title) {
            _this.libraryTitleExists = false;
          } else {
            _this.libraryTitleExists =
              _this.form.controls.title.value === entries[0].entry.title;
          }
        } else {
          _this.libraryTitleExists = false;
        }
      });
  };
  LibraryMetadataFormComponent.prototype.ngOnDestroy = function() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  };
  LibraryMetadataFormComponent.prototype.ngOnChanges = function() {
    this.updateForm(this.node);
  };
  LibraryMetadataFormComponent.prototype.update = function() {
    if (this.canUpdateLibrary && this.form.valid) {
      this.store.dispatch(new UpdateLibraryAction(this.form.value));
    }
  };
  LibraryMetadataFormComponent.prototype.updateForm = function(node) {
    var entry = node.entry;
    this.form.setValue({
      id: entry.id,
      title: entry.title,
      description: entry.description || '',
      visibility: entry.visibility
    });
  };
  LibraryMetadataFormComponent.prototype.findLibraryByTitle = function(
    libraryTitle
  ) {
    return from(
      this.alfrescoApiService
        .getInstance()
        .core.queriesApi.findSites(libraryTitle, {
          maxItems: 1,
          fields: ['title']
        })
        .catch(function() {
          return { list: { entries: [] } };
        })
    );
  };
  tslib_1.__decorate(
    [Input(), tslib_1.__metadata('design:type', SiteEntry)],
    LibraryMetadataFormComponent.prototype,
    'node',
    void 0
  );
  LibraryMetadataFormComponent = tslib_1.__decorate(
    [
      Component({
        selector: 'app-library-metadata-form',
        templateUrl: './library-metadata-form.component.html'
      }),
      tslib_1.__metadata('design:paramtypes', [AlfrescoApiService, Store])
    ],
    LibraryMetadataFormComponent
  );
  return LibraryMetadataFormComponent;
})();
export { LibraryMetadataFormComponent };
//# sourceMappingURL=library-metadata-form.component.js.map
