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

import { Directive, Input, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, PRIMARY_OUTLET } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatExpansionPanel } from '@angular/material/expansion';
import { Store } from '@ngrx/store';

@Directive({
  selector: '[acaExpansionPanel]',
  exportAs: 'acaExpansionPanel'
})
export class ExpansionPanelDirective implements OnInit, OnDestroy {
  @Input() acaExpansionPanel;
  public hasActiveChildren = false;

  private onDestroy$: Subject<boolean> = new Subject<boolean>();

  @HostListener('click')
  onClick() {
    if (this.expansionPanel.expanded && !this.hasActiveLinks()) {
      const firstChild = this.acaExpansionPanel.children[0];
      if (firstChild.url) {
        this.router.navigate(this.getNavigationCommands(firstChild.url));
      } else {
        this.store.dispatch({
          type: firstChild.action.action,
          payload: this.getNavigationCommands(firstChild.action.payload)
        });
      }
    }
  }

  constructor(private store: Store<any>, private router: Router, private expansionPanel: MatExpansionPanel) {}

  hasActiveLinks() {
    if (this.acaExpansionPanel && this.acaExpansionPanel.children) {
      return this.acaExpansionPanel.children.some((child) => this.router.url.startsWith(child.url || child.action.payload));
    }
    return false;
  }

  ngOnInit() {
    this.hasActiveChildren = this.hasActiveLinks();

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.onDestroy$)
      )
      .subscribe(() => {
        this.hasActiveChildren = this.hasActiveLinks();
      });
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

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
