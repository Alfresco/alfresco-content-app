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
  Component,
  ViewEncapsulation,
  OnInit,
  OnDestroy,
  HostListener,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';

import { AppExtensionService } from '../../extensions/extension.service';
import { AppStore } from '../../store/states';
import { appSelection } from '../../store/selectors/app.selectors';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ContentActionRef } from '@alfresco/adf-extensions';
import { ContextMenuOverlayRef } from './context-menu-overlay';

@Component({
  selector: 'aca-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.theme.scss'],
  host: {
    class: 'aca-context-menu-holder'
  },
  encapsulation: ViewEncapsulation.None
})
export class ContextMenuComponent implements OnInit, OnDestroy, AfterViewInit {
  private onDestroy$: Subject<boolean> = new Subject<boolean>();
  actions: Array<ContentActionRef> = [];

  @ViewChild(MatMenuTrigger)
  trigger: MatMenuTrigger;

  @HostListener('document:keydown.Escape', ['$event'])
  handleKeydownEscape(event: KeyboardEvent) {
    if (event) {
      if (this.contextMenuOverlayRef) {
        this.contextMenuOverlayRef.close();
      }
    }
  }

  constructor(
    private contextMenuOverlayRef: ContextMenuOverlayRef,
    private extensions: AppExtensionService,
    private store: Store<AppStore>
  ) {}

  onClickOutsideEvent() {
    if (this.contextMenuOverlayRef) {
      this.contextMenuOverlayRef.close();
    }
  }

  runAction(actionId: string) {
    this.extensions.runActionById(actionId);
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  ngOnInit() {
    this.store
      .select(appSelection)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(selection => {
        if (selection.count) {
          this.actions = this.extensions.getAllowedContextMenuActions();
        }
      });
  }

  ngAfterViewInit() {
    setTimeout(() => this.trigger.openMenu(), 0);
  }

  trackById(_: number, obj: { id: string }) {
    return obj.id;
  }
}
