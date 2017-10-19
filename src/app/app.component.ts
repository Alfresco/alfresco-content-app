/*!
 * @license
 * Copyright 2017 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { TranslationService, PageTitleService } from 'ng2-alfresco-core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pageTitle: PageTitleService,
    private translateService: TranslationService) {
  }

  ngOnInit() {
    const { router, pageTitle, route, translateService } = this;

    router
      .events
      .filter(event => event instanceof NavigationEnd)
      .subscribe(() => {
        let currentRoute = route.root;

        while (currentRoute.firstChild) {
          currentRoute = currentRoute.firstChild;
        }

        const snapshot: any = currentRoute.snapshot || {};
        const data: any = snapshot.data || {};

        if (data.i18nTitle) {
          translateService.get(data.i18nTitle).subscribe(title => {
            pageTitle.setTitle(title);
          });
        } else {
          pageTitle.setTitle(data.title || '');
        }
      });
  }
}
