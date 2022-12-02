/*
 * Copyright © 2005 - 2021 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { Component, OnInit } from '@angular/core';
import { ContentApiService } from '../../../../../../../projects/aca-shared/src/public-api';

@Component({
  selector: 'app-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.scss']
})
export class HeaderMenuComponent implements OnInit {
  personDetails;
  userName = '';
  userMail = '';

  constructor(private contentApi: ContentApiService) {}

  ngOnInit() {
    this.contentApi.getPerson('-me-').subscribe((person) => {
      this.personDetails = person?.entry;
      this.userName = this.personDetails.displayName;
      this.userMail = this.personDetails.email;
    });
  }
}
