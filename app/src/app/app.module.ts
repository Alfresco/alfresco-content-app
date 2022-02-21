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

import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TRANSLATION_PROVIDER, CoreModule, AppConfigService, DebugAppConfigService } from '@alfresco/adf-core';
import { ContentModule } from '@alfresco/adf-content-services';
import { SharedModule } from '@alfresco/aca-shared';

import { AppComponent } from './app.component';
import { APP_ROUTES } from './app.routes';

import { AppStoreModule } from './store/app-store.module';
import { MaterialModule } from './material.module';
import { AppExtensionsModule } from './extensions.module';
import { CoreExtensionsModule } from './extensions/core.extensions.module';
import { ExtensionsModule } from '@alfresco/adf-extensions';
import { AppSidenavModule } from './components/sidenav/sidenav.module';
import { AppCommonModule } from './components/common/common.module';
import { AppLayoutModule } from './components/layout/layout.module';
import { AppLoginModule } from './components/login/login.module';
import { AppHeaderModule } from './components/header/header.module';
import { environment } from '../environments/environment';

import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import localeDe from '@angular/common/locales/de';
import localeIt from '@angular/common/locales/it';
import localeEs from '@angular/common/locales/es';
import localeJa from '@angular/common/locales/ja';
import localeNl from '@angular/common/locales/nl';
import localePt from '@angular/common/locales/pt';
import localeNb from '@angular/common/locales/nb';
import localeRu from '@angular/common/locales/ru';
import localeCh from '@angular/common/locales/zh';
import localeAr from '@angular/common/locales/ar';
import localeCs from '@angular/common/locales/cs';
import localePl from '@angular/common/locales/pl';
import localeFi from '@angular/common/locales/fi';
import localeDa from '@angular/common/locales/da';
import localeSv from '@angular/common/locales/sv';

registerLocaleData(localeFr);
registerLocaleData(localeDe);
registerLocaleData(localeIt);
registerLocaleData(localeEs);
registerLocaleData(localeJa);
registerLocaleData(localeNl);
registerLocaleData(localePt);
registerLocaleData(localeNb);
registerLocaleData(localeRu);
registerLocaleData(localeCh);
registerLocaleData(localeAr);
registerLocaleData(localeCs);
registerLocaleData(localePl);
registerLocaleData(localeFi);
registerLocaleData(localeDa);
registerLocaleData(localeSv);

@NgModule({
  imports: [
    BrowserModule,
    environment.e2e ? NoopAnimationsModule : BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(APP_ROUTES, {
      useHash: true,
      enableTracing: false // enable for debug only
    }),
    MaterialModule,
    CoreModule.forRoot(),
    ContentModule.forRoot(),
    SharedModule.forRoot(),
    AppStoreModule,
    CoreExtensionsModule.forRoot(),
    ExtensionsModule.forRoot(),
    AppExtensionsModule,
    AppLoginModule,
    AppCommonModule,
    AppLayoutModule,
    AppSidenavModule,
    AppHeaderModule,
    HammerModule
  ],
  declarations: [AppComponent],
  providers: [
    { provide: AppConfigService, useClass: DebugAppConfigService },
    {
      provide: TRANSLATION_PROVIDER,
      multi: true,
      useValue: {
        name: 'app',
        source: 'assets'
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
