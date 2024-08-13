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

import { Component, Input, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { DynamicExtensionComponent, NavBarGroupRef, NavBarLinkRef } from '@alfresco/adf-extensions';
import { Store } from '@ngrx/store';
import { AppStore, getSideNavState } from '@alfresco/aca-shared/store';
import { of, Subject } from 'rxjs';
import { takeUntil, distinctUntilChanged, debounceTime, switchMap } from 'rxjs/operators';
import { AppExtensionService, AppService } from '@alfresco/aca-shared';
import { AppConfigService, SidenavLayoutComponent } from '@alfresco/adf-core';
import { CommonModule } from '@angular/common';
import { SidenavHeaderComponent } from './components/sidenav-header.component';
import { MatListModule } from '@angular/material/list';
import { ExpandMenuComponent } from './components/expand-menu.component';
import { AgentService } from '@alfresco/adf-content-services';
import { AgentWithAvatar } from '@alfresco/js-api/typings';

@Component({
  standalone: true,
  imports: [CommonModule, SidenavHeaderComponent, MatListModule, ExpandMenuComponent, DynamicExtensionComponent],
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-sidenav' }
})
export class SidenavComponent implements OnInit, OnDestroy {
  @Input()
  data: {
    layout?: SidenavLayoutComponent;
    mode?: 'collapsed' | 'expanded';
  } = {};

  groups: Array<NavBarGroupRef> = [];
  private onDestroy$ = new Subject<boolean>();

  constructor(
    private store: Store<AppStore>,
    private extensions: AppExtensionService,
    private appService: AppService,
    private agentService: AgentService,
    private appConfigService: AppConfigService
  ) {}

  ngOnInit() {
    this.store
      .select(getSideNavState)
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(() => {
          const isKnowledgeRetrievalEnabled = this.appConfigService.get('plugins.knowledgeRetrievalEnabled', true);
          return isKnowledgeRetrievalEnabled ? this.agentService.getAgents() : of([]);
        }),
        takeUntil(this.onDestroy$)
      )
      .subscribe((agents: AgentWithAvatar[]) => {
        this.groups = this.extensions.getApplicationNavigation(this.extensions.navbar);
        this.setAgentLinks(agents);
      });

    this.appService.setAppNavbarMode(this.data.mode);
    this.appService.toggleAppNavBar$.pipe(takeUntil(this.onDestroy$)).subscribe(() => this.toggleNavBar());
    this.data.layout.expanded.pipe(takeUntil(this.onDestroy$)).subscribe(() => this.setNavBarMode());
  }

  trackByGroupId(_: number, obj: NavBarGroupRef): string {
    return obj.id;
  }

  trackByLinkId(_: number, obj: NavBarLinkRef): string {
    return obj.id;
  }

  toggleClick() {
    this.toggleNavBar();
  }

  private getAgentLinks(agents: AgentWithAvatar[]): NavBarLinkRef[] {
    return agents.map((agent) => {
      return {
        id: agent.id,
        order: 100,
        title: agent.name,
        description: agent.name,
        icon: '',
        externalUrl: 'https://www.google.com'
      };
    });
  }

  private setNavBarMode() {
    this.appService.setAppNavbarMode(this.data.layout.isMenuMinimized || this.data.layout.isHeaderInside ? 'collapsed' : 'expanded');
  }

  private toggleNavBar() {
    this.data.layout.toggleMenu();
    this.setNavBarMode();
  }

  private setAgentLinks(agents: AgentWithAvatar[]) {
    if (agents.length > 0) {
      const aiGroupIndex = this.groups.findIndex((group) => group.id === 'app.navbar.primary');
      this.groups[aiGroupIndex].items.push({
        children: this.getAgentLinks(agents),
        id: 'app.navbar.AiAgents',
        order: 100,
        title: 'AI Agents',
        description: 'AI Agents',
        icon: ''
      });
    }
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }
}
