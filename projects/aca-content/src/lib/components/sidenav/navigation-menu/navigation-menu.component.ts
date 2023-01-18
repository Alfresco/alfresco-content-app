/*
 * Copyright © 2005 - 2021 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { AlfrescoApiService } from '@alfresco/adf-core';
import { PeopleApi } from '@alfresco/js-api';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-navigation-menu',
  templateUrl: './navigation-menu.component.html',
  styleUrls: ['./navigation-menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NavigationMenuComponent implements OnInit {
  peopleApi: PeopleApi;
  personDetails;
  userName = '';
  userMail = '';

  constructor(apiService: AlfrescoApiService) {
    this.peopleApi = new PeopleApi(apiService.getInstance());
  }

  ngOnInit() {
    this.peopleApi.getPerson('-me-').then((userInfo) => {
      this.personDetails = userInfo?.entry;
      this.userName = this.personDetails.displayName;
      this.userMail = this.personDetails.email;
    });
  }
}
