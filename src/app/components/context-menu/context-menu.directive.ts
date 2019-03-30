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

import {
  Directive,
  HostListener,
  Input,
  OnInit,
  OnDestroy
} from '@angular/core';
import { ContextMenuOverlayRef } from './context-menu-overlay';
import { ContextMenuService } from './context-menu.service';
import { debounceTime } from 'rxjs/operators';
import { Subject, fromEvent, Subscription } from 'rxjs';

@Directive({
  selector: '[acaContextActions]'
})
export class ContextActionsDirective implements OnInit, OnDestroy {
  private execute$: Subject<any> = new Subject();
  private subscriptions: Subscription[] = [];
  private overlayRef: ContextMenuOverlayRef = null;

  // tslint:disable-next-line:no-input-rename
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

  constructor(private contextMenuService: ContextMenuService) {}

  ngOnInit() {
    this.subscriptions.push(
      fromEvent(document.body, 'contextmenu').subscribe(() => {
        if (this.overlayRef) {
          this.overlayRef.close();
        }
      }),

      this.execute$.pipe(debounceTime(300)).subscribe((event: MouseEvent) => {
        this.render(event);
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions = [];
    this.execute$ = null;
  }

  execute(event: MouseEvent, target: Element) {
    if (!this.isSelected(target)) {
      target.dispatchEvent(new MouseEvent('click'));
    }
    this.execute$.next(event);
  }

  private render(event: MouseEvent) {
    this.overlayRef = this.contextMenuService.open({
      source: event,
      hasBackdrop: false,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      panelClass: 'cdk-overlay-pane'
    });
  }

  private getTarget(event: MouseEvent): Element {
    return this.findAncestor(<Element>event.target, 'adf-datatable-cell');
  }

  private isSelected(target): boolean {
    if (!target) {
      return false;
    }

    return this.findAncestor(target, 'adf-datatable-row').classList.contains(
      'adf-is-selected'
    );
  }

  private findAncestor(el: Element, className: string): Element {
    if (el.classList.contains(className)) {
      return el;
    }
    // tslint:disable-next-line:curly
    while ((el = el.parentElement) && !el.classList.contains(className));
    return el;
  }
}
