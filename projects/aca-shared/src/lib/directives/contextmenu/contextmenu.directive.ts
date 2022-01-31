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

import { Directive, HostListener, Input, OnInit, OnDestroy } from '@angular/core';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppStore, ContextMenu } from '@alfresco/aca-shared/store';

@Directive({
  selector: '[acaContextActions]',
  exportAs: 'acaContextActions'
})
export class ContextActionsDirective implements OnInit, OnDestroy {
  private execute$: Subject<any> = new Subject();
  onDestroy$: Subject<boolean> = new Subject<boolean>();

  // eslint-disable-next-line
  @Input('acaContextEnable')
  enabled = true;

  @HostListener('contextmenu', ['$event'])
  onContextMenuEvent(event: MouseEvent) {
    if (event) {
      event.preventDefault();

      if (this.enabled) {
        const target = this.getTarget(event);
        if (target) {
          this.execute(event, target);
        }
      }
    }
  }

  constructor(private store: Store<AppStore>) {}

  ngOnInit() {
    this.execute$.pipe(debounceTime(300), takeUntil(this.onDestroy$)).subscribe((event: MouseEvent) => {
      this.store.dispatch(new ContextMenu(event));
    });
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  execute(event: MouseEvent, target: Element) {
    if (!this.isSelected(target)) {
      target.dispatchEvent(new MouseEvent('click'));
    }

    this.execute$.next(event);
  }

  private getTarget(event: MouseEvent): Element {
    const target = event.target as Element;
    return this.findAncestor(target, 'adf-datatable-cell');
  }

  private isSelected(target: Element): boolean {
    if (!target) {
      return false;
    }

    return this.findAncestor(target, 'adf-datatable-row').classList.contains('adf-is-selected');
  }

  private findAncestor(el: Element, className: string): Element {
    if (el.classList.contains(className)) {
      return el;
    }
    // eslint-disable-next-line curly
    while ((el = el.parentElement) && !el.classList.contains(className));
    return el;
  }
}
