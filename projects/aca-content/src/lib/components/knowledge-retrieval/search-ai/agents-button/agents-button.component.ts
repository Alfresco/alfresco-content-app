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

import { ChangeDetectorRef, Component, DestroyRef, inject, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectionState } from '@alfresco/adf-extensions';
import { Store } from '@ngrx/store';
import { AppStore, getAppSelection } from '@alfresco/aca-shared/store';
import { AvatarComponent, IconComponent, NotificationService } from '@alfresco/adf-core';
import { forkJoin, throwError } from 'rxjs';
import { catchError, take } from 'rxjs/operators';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule, MatSelectionListChange } from '@angular/material/list';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Agent } from '@alfresco/js-api';
import { AgentService, SearchAiService } from '@alfresco/adf-content-services';
import { MatTooltipModule } from '@angular/material/tooltip';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  imports: [CommonModule, MatMenuModule, MatListModule, TranslatePipe, AvatarComponent, IconComponent, MatTooltipModule],
  selector: 'aca-agents-button',
  templateUrl: './agents-button.component.html',
  styleUrls: ['./agents-button.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'aca-agents-button' }
})
export class AgentsButtonComponent implements OnInit {
  @Input()
  data: { trigger: string };

  private selectedNodesState: SelectionState;
  private _agents: Agent[] = [];
  private _disabled = true;
  private _initialsByAgentId: { [key: string]: string } = {};
  private _hxInsightUrl: string;

  get agents(): Agent[] {
    return this._agents;
  }

  get disabled(): boolean {
    return this._disabled;
  }

  get initialsByAgentId(): { [key: string]: string } {
    return this._initialsByAgentId;
  }

  get hxInsightUrl(): string {
    return this._hxInsightUrl;
  }

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private store: Store<AppStore>,
    private notificationService: NotificationService,
    private searchAiService: SearchAiService,
    private agentService: AgentService,
    private translateService: TranslateService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.store
      .select(getAppSelection)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((selection) => {
        this.selectedNodesState = selection;
      });
    forkJoin({
      agents: this.agentService.getAgents().pipe(
        take(1),
        catchError(() => throwError('KNOWLEDGE_RETRIEVAL.SEARCH.ERRORS.AGENTS_FETCHING'))
      ),
      config: this.searchAiService.getConfig().pipe(catchError(() => throwError('KNOWLEDGE_RETRIEVAL.SEARCH.ERRORS.HX_INSIGHT_URL_FETCHING')))
    }).subscribe(
      (result) => {
        this._hxInsightUrl = result.config.entry.knowledgeRetrievalUrl;
        this._agents = result.agents;

        this.cd.detectChanges();

        if (this.agents.length) {
          this._initialsByAgentId = this.agents.reduce((initials, agent) => {
            const words = agent.name.split(' ').filter((word) => !word.match(/[^a-zA-Z]+/g));
            initials[agent.id] = `${words[0][0]}${words[1]?.[0] || ''}`;
            return initials;
          }, {});
        }
      },
      (error: string) => this.notificationService.showError(this.translateService.instant(error))
    );
  }

  onClick(): void {
    if (!this.selectedNodesState.isEmpty) {
      const message = this.searchAiService.checkSearchAvailability(this.selectedNodesState);
      if (message) {
        this.notificationService.showError(message);
      }
      this._disabled = !!message;
      return;
    }
    this._disabled = true;
    open(this.hxInsightUrl);
  }

  onAgentSelection(change: MatSelectionListChange): void {
    this.store.dispatch({
      type: this.data.trigger,
      agentId: change.options[0].value.id
    });
    change.source.deselectAll();
  }
}
