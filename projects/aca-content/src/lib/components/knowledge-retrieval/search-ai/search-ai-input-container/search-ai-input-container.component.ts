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

import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SearchAiInputComponent } from '../search-ai-input/search-ai-input.component';
import { MatDividerModule } from '@angular/material/divider';
import { SearchAiNavigationService } from '../../../../services/search-ai-navigation.service';
import { NavigationStart, Router } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { SearchAiService } from '@alfresco/adf-content-services';
import { TranslateModule } from '@ngx-translate/core';
import { Subject } from 'rxjs';

@Component({
  standalone: true,
  imports: [SearchAiInputComponent, MatIconModule, MatDividerModule, MatButtonModule, TranslateModule],
  selector: 'aca-search-ai-input-container',
  templateUrl: './search-ai-input-container.component.html',
  styleUrls: ['./search-ai-input-container.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SearchAiInputContainerComponent implements OnInit, OnDestroy {
  @Input()
  placeholder = 'KNOWLEDGE_RETRIEVAL.SEARCH.SEARCH_INPUT.DEFAULT_PLACEHOLDER';
  @Input()
  agentId: string;
  @Input()
  useStoredNodes: boolean;

  private onDestroy$ = new Subject<void>();

  constructor(private searchAiService: SearchAiService, private searchNavigationService: SearchAiNavigationService, private router: Router) {}

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationStart),
        takeUntil(this.onDestroy$)
      )
      .subscribe(() => this.hideSearchInput());
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  hideSearchInput(): void {
    this.searchAiService.updateSearchAiInputState({
      active: false
    });
  }

  leaveSearchInput(): void {
    this.searchNavigationService.navigateToPreviousRoute();
    this.hideSearchInput();
  }
}