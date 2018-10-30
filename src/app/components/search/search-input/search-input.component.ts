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

import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
  NavigationEnd,
  PRIMARY_OUTLET,
  Router,
  RouterEvent,
  UrlSegment,
  UrlSegmentGroup,
  UrlTree
} from '@angular/router';
import { SearchInputControlComponent } from '../search-input-control/search-input-control.component';
import { Store } from '@ngrx/store';
import { AppStore } from '../../../store/states/app.state';
import { SearchByTermAction } from '../../../store/actions';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'aca-search-input',
  templateUrl: 'search-input.component.html',
  encapsulation: ViewEncapsulation.None,
  host: { class: 'aca-search-input' }
})
export class SearchInputComponent implements OnInit {
  hasOneChange = false;
  hasNewChange = false;
  navigationTimer: any;

  searchedWord = null;
  searchOptions: any = [
    {
      key: 'SEARCH.INPUT.FILES',
      value: false,
      shouldDisable: this.isLibrariesChecked.bind(this)
    },
    {
      key: 'SEARCH.INPUT.FOLDERS',
      value: false,
      shouldDisable: this.isLibrariesChecked.bind(this)
    },
    {
      key: 'SEARCH.INPUT.LIBRARIES',
      value: false,
      shouldDisable: this.isContentChecked.bind(this)
    }
  ];

  @ViewChild('searchInputControl')
  searchInputControl: SearchInputControlComponent;

  constructor(private router: Router, private store: Store<AppStore>) {}

  ngOnInit() {
    this.showInputValue();

    this.router.events
      .pipe(filter(e => e instanceof RouterEvent))
      .subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.showInputValue();
        }
      });
  }

  showInputValue() {
    this.searchedWord = '';

    if (this.onSearchResults) {
      const urlTree: UrlTree = this.router.parseUrl(this.router.url);
      const urlSegmentGroup: UrlSegmentGroup =
        urlTree.root.children[PRIMARY_OUTLET];

      if (urlSegmentGroup) {
        const urlSegments: UrlSegment[] = urlSegmentGroup.segments;
        this.searchedWord = urlSegments[0].parameters['q'] || 'ss';
      }
    }

    if (this.searchInputControl) {
      this.searchInputControl.searchTerm = this.searchedWord;
    }
  }

  onItemClicked(node) {
   // to be removed..
  }

  /**
   * Called when the user submits the search, e.g. hits enter or clicks submit
   *
   * @param event Parameters relating to the search
   */
  onSearchSubmit(event: KeyboardEvent) {
    const searchTerm = (event.target as HTMLInputElement).value;
    if (searchTerm) {
      this.store.dispatch(new SearchByTermAction(searchTerm, this.searchOptions));
    }
  }

  onSearchChange(searchTerm: string) {
    if (this.hasOneChange) {
      this.hasNewChange = true;
    } else {
      this.hasOneChange = true;
    }

    if (this.hasNewChange) {
      clearTimeout(this.navigationTimer);
      this.hasNewChange = false;
    }

    this.navigationTimer = setTimeout(() => {
      if (searchTerm) {
        this.store.dispatch(new SearchByTermAction(searchTerm, this.searchOptions));
      }
      this.hasOneChange = false;
    }, 1000);
  }

  get onSearchResults() {
    return this.router.url.indexOf('/search') === 0;
  }

  isLibrariesChecked(): boolean {
    return this.searchOptions[2].value;
  }
  isContentChecked(): boolean {
    return this.searchOptions[0].value || this.searchOptions[1].value;
  }
}
