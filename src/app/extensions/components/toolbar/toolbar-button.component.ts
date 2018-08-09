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

import { Component, Input } from '@angular/core';
import { ContentActionRef } from '../../action.extensions';
import { ExtensionService } from '../../extension.service';
import { Store } from '@ngrx/store';
import { AppStore } from '../../../store/states';
import { appSelection } from '../../../store/selectors/app.selectors';
import { take } from 'rxjs/operators';

export enum ToolbarButtonType {
    ICON_BUTTON = 'icon-button',
    MENU_ITEM = 'menu-item'
}

@Component({
    selector: 'app-toolbar-button',
    template: `
        <ng-container [ngSwitch]="type">
            <ng-container *ngSwitchCase="'icon-button'">
                <button
                    [id]="actionRef.id"
                    mat-icon-button
                    color="primary"
                    [attr.title]="(actionRef.description || actionRef.title) | translate"
                    (click)="runAction()">
                    <mat-icon>{{ actionRef.icon }}</mat-icon>
                </button>
            </ng-container>
            <ng-container *ngSwitchCase="'menu-item'">
                <button
                    [id]="actionRef.id"
                    mat-menu-item
                    color="primary"
                    [disabled]="actionRef.disabled"
                    [attr.title]="(
                        actionRef.disabled
                        ? actionRef['description-disabled']
                        : actionRef.description || actionRef.title
                    ) | translate"
                    (click)="runAction()">
                    <mat-icon>{{ actionRef.icon }}</mat-icon>
                    <span>{{ actionRef.title | translate }}</span>
                </button>
            </ng-container>
        </ng-container>
    `
})
export class ToolbarButtonComponent {
    @Input() type: ToolbarButtonType = ToolbarButtonType.ICON_BUTTON;
    @Input() actionRef: ContentActionRef;

    constructor(
        protected store: Store<AppStore>,
        private extensions: ExtensionService
    ) {}

    runAction() {
        this.store
            .select(appSelection)
            .pipe(take(1))
            .subscribe(selection => {
                this.extensions.runActionById(this.actionRef.actions.click, {
                    selection
                });
            });
    }
}
