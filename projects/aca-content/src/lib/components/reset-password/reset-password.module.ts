/*
 * Copyright © 2005 - 2021 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { MaterialModule } from '@alfresco/adf-core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ResetPasswordComponent } from './reset-password.component';

@NgModule({
  imports: [RouterModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, HttpClientModule, MaterialModule],
  declarations: [ResetPasswordComponent],
  exports: [ResetPasswordComponent]
})
export class ResetPasswordModule {}
