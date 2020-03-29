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
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
  ViewChild,
  ElementRef
} from '@angular/core';
import { Subject } from 'rxjs';
var SearchInputControlComponent = /** @class */ (function() {
  function SearchInputControlComponent() {
    this.onDestroy$ = new Subject();
    /** Type of the input field to render, e.g. "search" or "text" (default). */
    this.inputType = 'text';
    /** Emitted when the search is submitted pressing ENTER button.
     * The search term is provided as value of the event.
     */
    this.submit = new EventEmitter();
    /** Emitted when the search term is changed. The search term is provided
     * in the 'value' property of the returned object.  If the term is less
     * than three characters in length then the term is truncated to an empty
     * string.
     */
    this.searchChange = new EventEmitter();
    this.searchTerm = '';
  }
  SearchInputControlComponent.prototype.ngOnDestroy = function() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  };
  SearchInputControlComponent.prototype.searchSubmit = function(event) {
    this.submit.emit(event);
  };
  SearchInputControlComponent.prototype.inputChange = function(event) {
    this.searchChange.emit(event);
  };
  SearchInputControlComponent.prototype.clear = function() {
    this.searchTerm = '';
    this.searchChange.emit('');
  };
  SearchInputControlComponent.prototype.isTermTooShort = function() {
    return !!(this.searchTerm && this.searchTerm.length < 2);
  };
  tslib_1.__decorate(
    [Input(), tslib_1.__metadata('design:type', Object)],
    SearchInputControlComponent.prototype,
    'inputType',
    void 0
  );
  tslib_1.__decorate(
    [Output(), tslib_1.__metadata('design:type', EventEmitter)],
    SearchInputControlComponent.prototype,
    'submit',
    void 0
  );
  tslib_1.__decorate(
    [Output(), tslib_1.__metadata('design:type', EventEmitter)],
    SearchInputControlComponent.prototype,
    'searchChange',
    void 0
  );
  tslib_1.__decorate(
    [ViewChild('searchInput'), tslib_1.__metadata('design:type', ElementRef)],
    SearchInputControlComponent.prototype,
    'searchInput',
    void 0
  );
  SearchInputControlComponent = tslib_1.__decorate(
    [
      Component({
        selector: 'app-search-input-control',
        templateUrl: './search-input-control.component.html',
        styleUrls: ['./search-input-control.component.scss'],
        encapsulation: ViewEncapsulation.None,
        host: { class: 'app-search-control' }
      })
    ],
    SearchInputControlComponent
  );
  return SearchInputControlComponent;
})();
export { SearchInputControlComponent };
//# sourceMappingURL=search-input-control.component.js.map
