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

import { Directive, OnInit, Input, HostListener } from '@angular/core';
import { PRIMARY_OUTLET, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppStore } from '../../../store/states/app.state';

@Directive({
  selector: '[action]',
  exportAs: 'action'
})
export class ActionDirective implements OnInit {
  @Input() action;

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    if (this.action.route) {
      this.router.navigate([this.action.route]);
    } else if (this.action.click) {
      this.dispatchAction(this.action.click);
    }
  }

  constructor(private router: Router, private store: Store<AppStore>) {}

  dispatchAction(action) {
    this.store.dispatch({
      type: action.action,
      payload: this.getNavigationCommands(action.payload)
    });
  }

  private getNavigationCommands(url: string): any[] {
    const urlTree = this.router.parseUrl(url);
    const urlSegmentGroup = urlTree.root.children[PRIMARY_OUTLET];

    if (!urlSegmentGroup) {
      return [url];
    }

    const urlSegments = urlSegmentGroup.segments;

    return urlSegments.reduce(function(acc, item) {
      acc.push(item.path, item.parameters);
      return acc;
    }, []);
  }

  ngOnInit() {}
}
