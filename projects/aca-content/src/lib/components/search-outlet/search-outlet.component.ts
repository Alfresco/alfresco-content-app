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

import { Component, ViewEncapsulation } from '@angular/core';
import { PageLayoutComponent } from '@alfresco/aca-shared';
import { MyFaComponentComponent } from '../aigen-search/my-component/my-fa-component.component';
import { AigenDashboardComponent, InfoData } from '../aigen-search/aigen-dashboard/aigen-dashboard.component';
import { Router } from '@angular/router';
import { AigenSearchService } from '../../services/aigen-search.service';
import { CommonModule } from '@angular/common';
import { AigenFilterComponent } from '../aigen-search/aigen-filter/aigen-filter.component';

@Component({
  standalone: true,
  imports: [PageLayoutComponent, MyFaComponentComponent, AigenDashboardComponent, AigenFilterComponent, CommonModule],
  encapsulation: ViewEncapsulation.None,
  selector: 'aca-search-outlet-component',
  templateUrl: './search-outlet.component.html',
  styleUrls: ['./search-outlet.component.css']
})
export class SearchOutletComponent {
  constructor(private router: Router, private aSearch: AigenSearchService) {}
  inputData: InfoData[] | null = null;
  isLoading = false;

  goToNormalMode() {
    this.router.navigate(['/search']);
  }

  handleInputChange(query: string) {
    this.isLoading = true;
    this.aSearch.getSearchResults(query).subscribe(
      (data) => {
        this.inputData = data;
        this.isLoading = false;
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
