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

import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LottieModule } from 'ngx-lottie';
import { ContentActionRef, SelectionState } from '@alfresco/adf-extensions';
import { Store } from '@ngrx/store';
import { AppStore, getAppSelection } from '@alfresco/aca-shared/store';
import { NotificationService } from '@alfresco/adf-core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SearchAIService } from '../../../services/search-ai.service';
import { MatOptionModule } from '@angular/material/core';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: true,
  imports: [CommonModule, LottieModule, MatOptionModule, MatSelectModule, ReactiveFormsModule, MatCardModule],
  selector: 'aca-search-icon',
  templateUrl: './search-icon.component.html',
  styleUrls: ['./search-icon.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'aca-search-icon' }
})
export class SearchIconComponent implements OnInit, OnDestroy {
  @Input()
  data: { path: string; trigger: string };
  @Input()
  controlInputVisibility = true;

  @Input()
  actionRef: ContentActionRef;

  @ViewChild(MatSelect)
  agentSelect: MatSelect;

  agentControl = new FormControl('');
  mockedAgents = ['HR Agent', 'Policy Agent', 'Rules & Rates Agent'];
  doubleClickTimeout: number;

  destroyed$ = new Subject<void>();

  private selectedNodesState: SelectionState;

  constructor(
    private store: Store<AppStore>,
    private notificationService: NotificationService,
    private searchAIService: SearchAIService,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.store
      .select(getAppSelection)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((selection) => {
        this.selectedNodesState = selection;
      });

    this.agentControl.setValue(this.mockedAgents[0]);
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  showAiSearch(): void {
    if (this.controlInputVisibility) {
      const error = this.searchAIService.checkSearchAvailability(this.selectedNodesState);
      if (error) {
        this.notificationService.showInfo(error);
      } else {
        this.store.dispatch({ type: this.data.trigger });
      }
    }
  }

  onClick(): void {
    if (this.mockedAgents.length === 1 || this.doubleClickTimeout) {
      this.clearDoubleClickTimer();
      this.showAiSearch();
      this.changeDetector.detectChanges();
    } else {
      this.doubleClickTimeout = setTimeout(() => {
        this.agentSelect.disabled = false;
        this.agentSelect.open();
        this.clearDoubleClickTimer();
      }, 250);
    }
  }

  disable(opened: boolean): void {
    if (!opened) {
      this.agentSelect.disabled = true;
    }
  }

  private clearDoubleClickTimer(): void {
    clearTimeout(this.doubleClickTimeout);
    this.doubleClickTimeout = null;
  }
}
