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
    Component,
    ViewEncapsulation,
    ChangeDetectionStrategy,
    Input,
    OnInit,
    OnDestroy
} from '@angular/core';
import { AppStore, SelectionState } from '../../../store/states';
import { Store } from '@ngrx/store';
import { ExtensionService } from '../../extension.service';
import { appSelection } from '../../../store/selectors/app.selectors';
import { Subject } from 'rxjs/Rx';
import { takeUntil } from 'rxjs/operators';
import { ContentActionRef } from '../../action.extensions';

@Component({
    selector: 'aca-toolbar-action',
    templateUrl: './toolbar-action.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: { class: 'aca-toolbar-action' }
})
export class ToolbarActionComponent implements OnInit, OnDestroy {
    @Input() entry: ContentActionRef;

    selection: SelectionState;
    onDestroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        protected store: Store<AppStore>,
        protected extensions: ExtensionService
    ) {}

    ngOnInit() {
        this.store
            .select(appSelection)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(selection => {
                this.selection = selection;
            });
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    runAction(actionId: string) {
        const context = {
            selection: this.selection
        };

        this.extensions.runActionById(actionId, context);
    }

    trackByActionId(index: number, action: ContentActionRef) {
        return action.id;
    }
}
