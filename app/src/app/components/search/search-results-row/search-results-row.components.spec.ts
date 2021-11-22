/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2020 Alfresco Software Limited
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail.  Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

import { NodeEntry } from '@alfresco/js-api';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { AppTestingModule } from '../../../testing/app-testing.module';
import { AppSearchResultsModule } from '../search-results.module';
import { SearchResultsRowComponent } from './search-results-row.component';

describe('SearchResultsRowComponent', () => {
  let component: SearchResultsRowComponent;
  let fixture: ComponentFixture<SearchResultsRowComponent>;
  const nodeEntry: NodeEntry = {
    entry: {
      id: 'fake-node-entry',
      modifiedByUser: { displayName: 'IChangeThings' },
      modifiedAt: new Date(),
      isFile: true,
      properties: { 'cm:title': 'BananaRama' }
    }
  } as NodeEntry;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), CoreModule, AppTestingModule, AppSearchResultsModule]
    });

    fixture = TestBed.createComponent(SearchResultsRowComponent);
    component = fixture.componentInstance;
  });

  it('should show the current node', () => {
    component.context = { row: { node: nodeEntry } };
    fixture.detectChanges();

    const element = fixture.nativeElement.querySelector('div');
    expect(element).not.toBeNull();
  });
});
