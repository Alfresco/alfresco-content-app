/*!
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component, DestroyRef, inject, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { A11yModule } from '@angular/cdk/a11y';
import { AvatarComponent, IconComponent, NotificationService, UserPreferencesService } from '@alfresco/adf-core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AiSearchByTermPayload, AppStore, getAppSelection, SearchByTermAiAction, ToggleAISearchInput } from '@alfresco/aca-shared/store';
import { SelectionState } from '@alfresco/adf-extensions';
import { MatSelectModule } from '@angular/material/select';
import { AgentService, SearchAiService } from '@alfresco/adf-content-services';
import { MatCardModule } from '@angular/material/card';
import {
  MAT_TOOLTIP_DEFAULT_OPTIONS,
  MAT_TOOLTIP_DEFAULT_OPTIONS_FACTORY,
  MatTooltipDefaultOptions,
  MatTooltipModule
} from '@angular/material/tooltip';
import { ModalAiService } from '../../../../services/modal-ai.service';
import { Agent } from '@alfresco/js-api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

const MatTooltipOptions: MatTooltipDefaultOptions = {
  ...MAT_TOOLTIP_DEFAULT_OPTIONS_FACTORY(),
  disableTooltipInteractivity: true
};

@Component({
  imports: [
    CommonModule,
    TranslatePipe,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    A11yModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    IconComponent,
    AvatarComponent,
    MatCardModule,
    MatTooltipModule
  ],
  selector: 'aca-search-ai-input',
  templateUrl: './search-ai-input.component.html',
  styleUrls: ['./search-ai-input.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: MatTooltipOptions }]
})
export class SearchAiInputComponent implements OnInit {
  @Input()
  placeholder: string;

  @Input()
  agentId: string;

  @Input()
  usedInAiResultsPage: boolean;

  @Input()
  searchTerm: string;

  private readonly storedNodesKey = 'knowledgeRetrievalNodes';

  private _agentControl = new FormControl<Agent>(null);
  private _agents: Agent[] = [];
  private selectedNodesState: SelectionState;
  private _queryControl = new FormControl('');
  private _initialsByAgentId: { [key: string]: string } = {};

  get agentControl(): FormControl<Agent> {
    return this._agentControl;
  }

  get agents(): Agent[] {
    return this._agents;
  }

  get queryControl(): FormControl<string> {
    return this._queryControl;
  }

  get initialsByAgentId(): { [key: string]: string } {
    return this._initialsByAgentId;
  }

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private store: Store<AppStore>,
    private searchAiService: SearchAiService,
    private notificationService: NotificationService,
    private agentService: AgentService,
    private userPreferencesService: UserPreferencesService,
    private translateService: TranslateService,
    private modalAiService: ModalAiService
  ) {}

  ngOnInit(): void {
    const queryValue = this.usedInAiResultsPage ? '' : this.searchTerm || '';
    this.queryControl.setValue(queryValue);

    if (!this.usedInAiResultsPage) {
      this.store
        .select(getAppSelection)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((selection) => {
          this.selectedNodesState = selection;
        });
    } else {
      this.selectedNodesState = JSON.parse(this.userPreferencesService.get(this.storedNodesKey));
    }

    this.agentService
      .getAgents()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(
        (agents) => {
          this._agents = agents;

          this.agentControl.setValue(this._agents.find((agent) => agent.id === this.agentId));
          this._initialsByAgentId = this.agents.reduce((initials, agent) => {
            const words = agent.name.split(' ').filter((word) => !word.match(/[^a-zA-Z]+/g));
            initials[agent.id] = `${words[0][0]}${words[1]?.[0] || ''}`;
            return initials;
          }, {});
        },
        () => this.notificationService.showError(this.translateService.instant('KNOWLEDGE_RETRIEVAL.SEARCH.ERRORS.AGENTS_FETCHING'))
      );
  }

  onSearchSubmit() {
    this.modalAiService.openUnsavedChangesModal(() => this.search());
  }

  private search(): void {
    const error = this.searchAiService.checkSearchAvailability(this.selectedNodesState);
    if (error) {
      this.notificationService.showError(error);
    } else {
      const payload: AiSearchByTermPayload = {
        searchTerm: this.queryControl.value,
        agentId: this.agentControl.value.id
      };
      this.userPreferencesService.set(this.storedNodesKey, JSON.stringify(this.selectedNodesState));
      this.store.dispatch(new SearchByTermAiAction(payload));
      this.store.dispatch(new ToggleAISearchInput(this.agentControl.value.id, this.queryControl.value));
      this.queryControl.reset();
    }
  }
}
