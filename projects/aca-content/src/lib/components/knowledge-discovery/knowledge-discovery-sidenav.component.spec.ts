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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KnowledgeDiscoverySidenavComponent } from './knowledge-discovery-sidenav.component';
import { AppTestingModule } from '../../testing/app-testing.module';
import { AppSettingsService } from '@alfresco/aca-shared';

describe('KnowledgeDiscoverySidenavComponent', () => {
  let fixture: ComponentFixture<KnowledgeDiscoverySidenavComponent>;
  let component: KnowledgeDiscoverySidenavComponent;
  let appSettings: AppSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule, KnowledgeDiscoverySidenavComponent]
    });

    appSettings = TestBed.inject(AppSettingsService);
    fixture = TestBed.createComponent(KnowledgeDiscoverySidenavComponent);
    component = fixture.componentInstance;
  });

  it('should set item with children using URL from config', () => {
    spyOnProperty(appSettings, 'knowledgeDiscoveryUrl', 'get').and.returnValue('https://discovery.example.com');

    fixture.detectChanges();

    expect(component.item).toEqual({
      id: 'app.knowledgeDiscovery.sidenav',
      icon: '',
      title: 'KNOWLEDGE_RETRIEVAL.SIDENAV.TITLE',
      route: '/',
      children: [
        {
          id: 'app.knowledgeDiscovery.sidenav.discovery',
          icon: '',
          title: 'KNOWLEDGE_RETRIEVAL.SIDENAV.DISCOVERY',
          route: 'https://discovery.example.com',
          url: 'https://discovery.example.com'
        }
      ]
    });
  });
});
