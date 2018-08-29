/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2018 Alfresco Software Limited
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
    Component, ViewEncapsulation, OnInit, OnDestroy, HostListener,
    ViewChildren, QueryList, AfterViewInit
} from '@angular/core';
import { trigger } from '@angular/animations';
import { FocusKeyManager } from '@angular/cdk/a11y';
import { DOWN_ARROW, UP_ARROW } from '@angular/cdk/keycodes';

import { AppExtensionService } from '../../extensions/extension.service';
import { AppStore } from '../../store/states';
import { appSelection } from '../../store/selectors/app.selectors';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SelectionState, ContentActionRef } from '@alfresco/adf-extensions';

import { ContextMenuOverlayRef } from './context-menu-overlay';
import { contextMenuAnimation } from './animations';
import { ContextMenuItemDirective } from './context-menu-item.directive';

@Component({
    selector: 'aca-context-menu',
    templateUrl: './context-menu.component.html',
    styleUrls: [
        './context-menu.component.scss',
        './context-menu.component.theme.scss'
    ],
    host: {
        role: 'menu',
        class: 'aca-context-menu'
    },
    encapsulation: ViewEncapsulation.None,
    animations: [
        trigger('panelAnimation', contextMenuAnimation)
    ]
})
export class ContextMenuComponent implements OnInit, OnDestroy, AfterViewInit {
    private onDestroy$: Subject<boolean> = new Subject<boolean>();
    private selection: SelectionState;
    private _keyManager: FocusKeyManager<ContextMenuItemDirective>;
    actions: Array<ContentActionRef> = [];

    @ViewChildren(ContextMenuItemDirective)
    private contextMenuItems: QueryList<ContextMenuItemDirective>;

    @HostListener('contextmenu', ['$event'])
    handleContextMenu(event: MouseEvent) {
        if (event) {
            event.preventDefault();
            if (this.contextMenuOverlayRef) {
                this.contextMenuOverlayRef.close();
            }
        }
    }

    @HostListener('document:keydown.Escape', ['$event'])
    handleKeydownEscape(event: KeyboardEvent) {
        if (event) {
            if (this.contextMenuOverlayRef) {
                this.contextMenuOverlayRef.close();
            }
        }
    }

    @HostListener('document:keydown', ['$event'])
    handleKeydownEvent(event: KeyboardEvent) {
        if (event) {
            const keyCode = event.keyCode;
            if (keyCode === UP_ARROW || keyCode === DOWN_ARROW) {
                this._keyManager.onKeydown(event);
            }
        }
    }

    constructor(
        private contextMenuOverlayRef: ContextMenuOverlayRef,
        private extensions: AppExtensionService,
        private store: Store<AppStore>,
    ) { }

    onClickOutsideEvent() {
        if (this.contextMenuOverlayRef) {
            this.contextMenuOverlayRef.close();
        }
    }

    runAction(actionId: string) {
        const context = {
            selection: this.selection
        };

        this.extensions.runActionById(actionId, context);
        this.contextMenuOverlayRef.close();
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
                    this.selection = selection;
                    this.actions = this.extensions.getAllowedContextMenuActions();
                }
            });
    }

    ngAfterViewInit() {
        this._keyManager = new FocusKeyManager<ContextMenuItemDirective>(this.contextMenuItems);
        this._keyManager.setFirstItemActive();
    }
}
