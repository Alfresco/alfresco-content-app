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

import { Directive, Input, HostListener } from '@angular/core';
import { PRIMARY_OUTLET, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppStore } from '@alfresco/aca-shared/store';

@Directive({
  /* eslint-disable-next-line */
  selector: '[action]',
  exportAs: 'action'
})
export class ActionDirective {
  @Input() action;

  @HostListener('click')
  onClick() {
    if (this.action.url) {
      this.router.navigate(this.getNavigationCommands(this.action.url));
    } else if (this.action.click) {
      this.store.dispatch({
        type: this.action.click.action,
        payload: this.getNavigationCommands(this.action.click.payload)
      });
    }
  }

  constructor(private router: Router, private store: Store<AppStore>) {}

  private getNavigationCommands(url: string): any[] {
    const urlTree = this.router.parseUrl(url);
    const urlSegmentGroup = urlTree.root.children[PRIMARY_OUTLET];

    if (!urlSegmentGroup) {
      return [url];
    }

    const urlSegments = urlSegmentGroup.segments;

    return urlSegments.reduce(function (acc, item) {
      acc.push(item.path, item.parameters);
      return acc;
    }, []);
  }
}
