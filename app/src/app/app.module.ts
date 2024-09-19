/*!
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Alfresco Example Content Application
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail. Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * from Hyland Software. If not, see <http://www.gnu.org/licenses/>.
 */

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TRANSLATION_PROVIDER, CoreModule, AuthGuard, AuthModule } from '@alfresco/adf-core';
import { AppService } from '@alfresco/aca-shared';

import { AppExtensionsModule } from './extensions.module';
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
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.components';
import { ContentUrlService, CONTENT_LAYOUT_ROUTES, ContentServiceExtensionModule, CoreExtensionsModule } from '@alfresco/aca-content';
import { ContentVersionService } from '@alfresco/adf-content-services';
import { ShellModule, SHELL_APP_SERVICE, SHELL_AUTH_TOKEN } from '@alfresco/adf-core/shell';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { APP_ROUTES } from './app.routes';
import { MatIconRegistry } from '@angular/material/icon';

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
    TranslateModule.forRoot(),
    CoreModule.forRoot(),
    CoreExtensionsModule.forRoot(),
    environment.e2e ? NoopAnimationsModule : BrowserAnimationsModule,
    !environment.production ? StoreDevtoolsModule.instrument({ maxAge: 25 }) : [],
    RouterModule.forRoot(APP_ROUTES, {
      useHash: true,
      enableTracing: false // enable for debug only
    }),
    AppExtensionsModule,
    ShellModule.withRoutes({
      shellChildren: [CONTENT_LAYOUT_ROUTES]
    }),
    ContentServiceExtensionModule,
    AuthModule.forRoot({ useHash: true })
  ],
  providers: [
    { provide: ContentVersionService, useClass: ContentUrlService },
    {
      provide: SHELL_APP_SERVICE,
      useClass: AppService
    },
    {
      provide: SHELL_AUTH_TOKEN,
      useValue: AuthGuard
    },
    {
      provide: TRANSLATION_PROVIDER,
      multi: true,
      useValue: {
        name: 'app',
        source: 'assets'
      }
    }
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(matIconRegistry: MatIconRegistry) {
    matIconRegistry.setDefaultFontSetClass('material-icons-outlined');
  }
}
