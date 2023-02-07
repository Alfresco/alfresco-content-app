/*
 * Copyright © 2005 - 2021 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ContentApiService } from '@alfresco/aca-shared';

@Component({
  selector: 'app-navigation-menu',
  templateUrl: './navigation-menu.component.html',
  styleUrls: ['./navigation-menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NavigationMenuComponent implements OnInit {
  userName = '';
  userEmail = '';

  constructor(private contentApi: ContentApiService) {}

  ngOnInit() {
    this.contentApi.getPerson('-me-').subscribe((person) => {
      const personDetails = person?.entry;
      this.userName = personDetails.displayName;
      this.userEmail = personDetails.email;
    });
  }
}
