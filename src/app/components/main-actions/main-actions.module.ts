/*
 * Copyright © 2005 - 2021 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { MainActionsComponent } from './main-actions.component';

@NgModule({
    imports: [
        CommonModule,
        MatButtonModule,
        TranslateModule.forRoot(),
    ],
    exports: [
        MainActionsComponent,
    ],
    declarations: [
        MainActionsComponent,
    ],
})
export class MainActionsModule {
}
