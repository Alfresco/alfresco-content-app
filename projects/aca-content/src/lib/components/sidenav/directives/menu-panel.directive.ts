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

import { DestroyRef, Directive, HostListener, inject, Input, OnInit } from '@angular/core';
import { NavigationEnd, PRIMARY_OUTLET, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Directive({
  standalone: true,
  selector: '[acaMenuPanel]',
  exportAs: 'acaMenuPanel'
})
export class MenuPanelDirective implements OnInit {
  @Input() acaMenuPanel;
  hasActiveChildren = false;

  @HostListener('menuOpened')
  menuOpened() {
    if (this.acaMenuPanel.children && !this.hasActiveLinks()) {
      const firstChild = this.acaMenuPanel.children[0];
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

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private store: Store<any>,
    private router: Router
  ) {}

  hasActiveLinks() {
    if (this.acaMenuPanel?.children) {
      return this.acaMenuPanel.children.some((child) => this.router.url.startsWith(child.url || child.action.payload));
    }
    return false;
  }

  ngOnInit() {
    this.hasActiveChildren = this.hasActiveLinks();

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.hasActiveChildren = this.hasActiveLinks();
      });
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
