/*
 * Copyright © 2005 - 2021 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { AppExtensionService } from '@alfresco/aca-shared';
import { ContentActionRef, ContentActionType } from '@alfresco/adf-extensions';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export const START_PROCESS_ACTION_ID = 'alfresco.app.start.process';

@Component({
    selector: 'app-main-actions',
    templateUrl: './main-actions.component.html',
    styleUrls: ['./main-actions.component.scss'],
})
export class MainActionsComponent implements OnInit, OnDestroy {
    mainActions$: Observable<ContentActionRef[]>;

    actionTypes = ContentActionType;

    private onDestroy$ = new Subject<boolean>();

    constructor(
        private extensions: AppExtensionService,
    ) {}

    ngOnDestroy(): void {
        this.onDestroy$.next(true);
    }

    ngOnInit(): void {
        this.mainActions$ = this.extensions.getMainActions().pipe(
            takeUntil(this.onDestroy$)
        );
    }

    runAction(action: string): void {
        this.extensions.runActionById(action);
    }
}
