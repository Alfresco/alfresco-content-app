/*!
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Directive, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Directive({
  standalone: true,
  selector: '[acaContextMenuOutsideEvent]'
})
export class OutsideEventDirective implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  @Output()
  clickOutside: EventEmitter<void> = new EventEmitter();

  ngOnInit() {
    this.subscriptions = this.subscriptions.concat([
      fromEvent(document.body, 'click')
        .pipe(filter((event) => !this.findAncestor(event.target as Element)))
        .subscribe(() => this.clickOutside.next())
    ]);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.subscriptions = [];
  }

  private findAncestor(el: Element): boolean {
    const className = 'aca-context-menu';

    while (el && !el.classList.contains(className)) {
      el = el.parentElement;
    }
    return !!el;
  }
}
