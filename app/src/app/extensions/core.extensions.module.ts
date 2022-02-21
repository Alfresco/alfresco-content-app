/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2020 Alfresco Software Limited
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

import { CoreModule, AuthGuardEcm, UserInfoComponent, NotificationHistoryComponent } from '@alfresco/adf-core';
import { CommonModule } from '@angular/common';
import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { AppLayoutComponent } from '../components/layout/app-layout/app-layout.component';
import { ExtensionsModule, ExtensionService, RuleContext } from '@alfresco/adf-extensions';
import { LanguagePickerComponent } from '../components/common/language-picker/language-picker.component';
import { LogoutComponent } from '../components/common/logout/logout.component';
import { AppExtensionService, ExtensionsDataLoaderGuard } from '@alfresco/aca-shared';
import { AcaRuleContext } from '@alfresco/aca-shared/rules';

export function setupExtensions(service: AppExtensionService): () => void {
  return () => service.load();
}

const isAdmin = (context: RuleContext): boolean => context.profile.isAdmin;
const canShowLogout = (context: AcaRuleContext): boolean => !context.withCredentials;

@NgModule({
  imports: [CommonModule, CoreModule.forChild(), ExtensionsModule]
})
export class CoreExtensionsModule {
  static forRoot(): ModuleWithProviders<CoreExtensionsModule> {
    return {
      ngModule: CoreExtensionsModule,
      providers: [
        {
          provide: APP_INITIALIZER,
          useFactory: setupExtensions,
          deps: [AppExtensionService],
          multi: true
        }
      ]
    };
  }

  static forChild(): ModuleWithProviders<CoreExtensionsModule> {
    return {
      ngModule: CoreExtensionsModule
    };
  }

  constructor(extensions: ExtensionService) {
    extensions.setComponents({
      'app.layout.main': AppLayoutComponent,
      'app.languagePicker': LanguagePickerComponent,
      'app.logout': LogoutComponent,
      'app.user': UserInfoComponent,
      'app.notification-center': NotificationHistoryComponent
    });

    extensions.setAuthGuards({
      'app.auth': AuthGuardEcm,
      'app.extensions.dataLoaderGuard': ExtensionsDataLoaderGuard
    });

    extensions.setEvaluators({
      'user.isAdmin': isAdmin,
      'app.canShowLogout': canShowLogout
    });
  }
}
