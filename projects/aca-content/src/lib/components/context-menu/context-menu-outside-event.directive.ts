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

import { DestroyRef, Directive, EventEmitter, HostListener, inject, Input, OnInit, Output } from '@angular/core';
import { fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Directive({
  standalone: true,
  selector: '[acaContextMenuOutsideEvent]'
})
export class OutsideEventDirective implements OnInit {
  @Output()
  clickOutside: EventEmitter<void> = new EventEmitter();

  @Input()
  focusTargetSelector = '.adf-context-menu-source';

  private readonly destroyRef = inject(DestroyRef);

  ngOnInit() {
    fromEvent(document.body, 'click')
      .pipe(
        filter((event) => !this.findAncestor(event.target as Element)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.clickOutside.next());
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKeydown() {
    document.querySelector<HTMLElement>(this.focusTargetSelector)?.focus();
  }

  private findAncestor(el: Element): boolean {
    const className = 'aca-context-menu';

    while (el && !el.classList.contains(className)) {
      el = el.parentElement;
    }
    return !!el;
  }
}
