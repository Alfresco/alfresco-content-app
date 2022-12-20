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

import { Directive, OnInit, Input, ElementRef, Renderer2, ContentChildren, QueryList, AfterContentInit, Optional } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ActionDirective } from './action.directive';

@Directive({
  selector: '[acaActiveLink]',
  exportAs: 'acaActiveLink'
})
export class ActiveLinkDirective implements OnInit, AfterContentInit {
  @Input() acaActiveLink;
  @ContentChildren(ActionDirective, { descendants: true })
  links: QueryList<ActionDirective>;
  isLinkActive = false;

  private onDestroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private router: Router, private element: ElementRef, private renderer: Renderer2, @Optional() private action?: ActionDirective) {}

  ngOnInit() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.onDestroy$)
      )
      .subscribe((event: NavigationEnd) => {
        this.update(event.urlAfterRedirects);
      });
  }

  private update(url: string) {
    if (this.action) {
      const itemUrl = this.resolveUrl(this.action);
      this.render(url, itemUrl);
    }

    this.links.map((item) => {
      const itemUrl = this.resolveUrl(item);
      this.render(url, itemUrl);
    });
  }

  private render(routerUrl: string, actionUrl: string) {
    if (routerUrl && routerUrl.substring(1).startsWith(actionUrl)) {
      this.isLinkActive = true;
      this.renderer.addClass(this.element.nativeElement, this.acaActiveLink);
    } else {
      this.isLinkActive = false;
      this.renderer.removeClass(this.element.nativeElement, this.acaActiveLink);
    }
  }

  ngAfterContentInit() {
    this.links.changes.subscribe(() => this.update(this.router.url));
    this.update(this.router.url);
  }

  private resolveUrl(item): string {
    return (item.action && item.action.click && item.action.click.payload) || item.action.route;
  }
}
