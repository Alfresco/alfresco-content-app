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
import { CommonModule } from '@angular/common';
import { AnimationOptions, LottieModule } from 'ngx-lottie';
import { SelectionState } from '@alfresco/adf-extensions';
import { Store } from '@ngrx/store';
import { AppStore, getAppSelection } from '@alfresco/aca-shared/store';
import { NotificationService } from '@alfresco/adf-core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AnimationItem } from 'lottie-web';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule, MatSelectionListChange } from '@angular/material/list';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Agent } from '@alfresco/js-api';
import { AgentService, SearchAiService } from '@alfresco/adf-content-services';

@Component({
  standalone: true,
  imports: [CommonModule, LottieModule, MatMenuModule, MatListModule, TranslateModule],
  selector: 'aca-agents-button',
  templateUrl: './agents-button.component.html',
  styleUrls: ['./agents-button.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'aca-agents-button' }
})
export class AgentsButtonComponent implements OnInit, OnDestroy {
  @Input()
  data: { path: string; trigger: string };

  private selectedNodesState: SelectionState;
  private _agents: Agent[] = [];
  private _options: AnimationOptions = {
    loop: true,
    autoplay: false
  };
  private animationItem?: AnimationItem;
  private onDestroy$ = new Subject<void>();
  private _disabled = true;

  get agents(): Agent[] {
    return this._agents;
  }

  get options(): AnimationOptions {
    return this._options;
  }

  get disabled(): boolean {
    return this._disabled;
  }

  constructor(
    private store: Store<AppStore>,
    private notificationService: NotificationService,
    private searchAiService: SearchAiService,
    private translateService: TranslateService,
    private agentService: AgentService
  ) {}

  ngOnInit(): void {
    this._options = { ...this.options, path: this.data.path };
    this.store
      .select(getAppSelection)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((selection) => {
        this.selectedNodesState = selection;
      });
    this.agentService
      .getAgents()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(
        (paging) => {
          this._agents = paging.list.entries.map((agentEntry) => agentEntry.entry);
        },
        () => this.notificationService.showError(this.translateService.instant('KNOWLEDGE_RETRIEVAL.SEARCH.ERRORS.AGENTS_FETCHING'))
      );
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  onAnimate(animationItem: AnimationItem): void {
    this.animationItem = animationItem;
  }

  onClick(): void {
    const error = this.searchAiService.checkSearchAvailability(this.selectedNodesState);
    if (error) {
      this.notificationService.showInfo(error);
    }
    this._disabled = !!error;
  }

  onMouseEnter(): void {
    this.animationItem?.play();
  }

  onMouseLeave(): void {
    this.animationItem?.stop();
  }

  onAgentSelection(change: MatSelectionListChange): void {
    this.store.dispatch({
      type: this.data.trigger,
      agentId: change.options[0].value.id
    });
    change.source.deselectAll();
  }
}
