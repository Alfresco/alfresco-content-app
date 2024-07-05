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

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { A11yModule } from '@angular/cdk/a11y';
import { IconComponent, NotificationService } from '@alfresco/adf-core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AiSearchByTermPayload, AppStore, getAppSelection, SearchByTermAiAction, SnackbarErrorAction } from '@alfresco/aca-shared/store';
import { takeUntil } from 'rxjs/operators';
import { SearchAiService } from '../../../../services/search-ai.service';
import { SelectionState } from '@alfresco/adf-extensions';
import { MatSelectModule } from '@angular/material/select';
import { Agent } from '@alfresco/js-api';
import { AgentService } from '@alfresco/adf-content-services';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    A11yModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    IconComponent
  ],
  selector: 'aca-search-ai-input',
  templateUrl: './search-ai-input.component.html',
  styleUrls: ['./search-ai-input.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SearchAiInputComponent implements OnInit, OnDestroy {
  @Input()
  placeholder: string;
  @Input()
  agentId: string;

  @Output()
  searchSubmitted = new EventEmitter<void>();

  private _agentControl = new FormControl<Agent>(null);
  private _agents: Agent[] = [];
  private onDestroy$ = new Subject<void>();
  private restrictionQuery = '';
  private selectedNodesState: SelectionState;
  private _queryControl = new FormControl('');

  get agentControl(): FormControl<Agent> {
    return this._agentControl;
  }

  get agents(): Agent[] {
    return this._agents;
  }

  get queryControl(): FormControl<string> {
    return this._queryControl;
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private store: Store<AppStore>,
    private searchAiService: SearchAiService,
    private notificationService: NotificationService,
    private agentService: AgentService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.store
      .select(getAppSelection)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((selection) => {
        if (selection) {
          this.restrictionQuery = selection.nodes?.[0]?.entry?.id;
        }
        this.selectedNodesState = selection;
      });

    this.activatedRoute.queryParams.pipe(takeUntil(this.onDestroy$)).subscribe((params) => {
      const restrictionQuery = params['restrictionQuery'];
      if (restrictionQuery) {
        this.restrictionQuery = restrictionQuery;
      }
    });
    this.agentService
      .getAgents()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(
        (paging) => {
          this._agents = paging.list.entries.map((agentEntry) => agentEntry.entry);
          this.agentControl.setValue(this.agents.find((agent) => agent.id === this.agentId));
        },
        () => this.notificationService.showError(this.translateService.instant('KNOWLEDGE_RETRIEVAL.SEARCH.ERRORS.AGENTS_FETCHING'))
      );
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  onSearchSubmit(): void {
    const error = this.searchAiService.checkSearchAvailability(this.selectedNodesState);
    if (error) {
      this.notificationService.showInfo(error);
    } else {
      const payload = new AiSearchByTermPayload();
      payload.searchTerm = this.queryControl.value;
      payload.agentId = this.agentControl.value.id;
      payload.restrictionQuery = this.restrictionQuery;
      if (payload.searchTerm) {
        this.store.dispatch(new SearchByTermAiAction(payload));
      } else {
        this.store.dispatch(new SnackbarErrorAction('APP.BROWSE.SEARCH.EMPTY_SEARCH'));
      }
      this.searchSubmitted.emit();
    }
  }
}
