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

import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { trigger } from '@angular/animations';

import { ExtensionService } from '../extensions/extension.service';
import { AppStore, SelectionState } from '../store/states';
import { appSelection } from '../store/selectors/app.selectors';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs/Rx';
import { takeUntil } from 'rxjs/operators';

import { ContextmenuOverlayRef } from './contextmenu-overlay';
import { ContentActionRef } from '../extensions/action.extensions';
import { contextmenuAnimation } from './animations';

@Component({
    selector: 'aca-contextmenu',
    templateUrl: './contextmenu.component.html',
    host: { 'role': 'menu' },
    encapsulation: ViewEncapsulation.None,
    animations: [
        trigger('panelAnimation', contextmenuAnimation)
    ]
})
export class ContextmenuComponent implements OnInit, OnDestroy {
    private onDestroy$: Subject<boolean> = new Subject<boolean>();
    private selection: SelectionState;
    actions: Array<ContentActionRef> = [];

    constructor(
        public contextmenuOverlayRef: ContextmenuOverlayRef,
        private extensions: ExtensionService,
        protected store: Store<AppStore>,
    ) { }

    runAction(actionId: string) {
        const context = {
            selection: this.selection
        };

        this.extensions.runActionById(actionId, context);
        this.contextmenuOverlayRef.close();
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
                    this.actions = this.extensions.getAllowedContentContextActions();
                }
            });
    }
}
