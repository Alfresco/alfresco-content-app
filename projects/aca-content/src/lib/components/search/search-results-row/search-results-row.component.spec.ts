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

import { NodeEntry, ResultSetRowEntry } from '@alfresco/js-api';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { first } from 'rxjs/operators';
import { AppTestingModule } from '../../../testing/app-testing.module';
import { SearchResultsRowComponent } from './search-results-row.component';
import { Component, Input } from '@angular/core';
import { UnitTestingUtils } from '@alfresco/adf-core';

@Component({
  selector: 'aca-datatable-cell-badges',
  standalone: true,
  template: ''
})
class MockDatatableCellBadgesComponent {
  @Input() node: NodeEntry;
}

describe('SearchResultsRowComponent', () => {
  let component: SearchResultsRowComponent;
  let fixture: ComponentFixture<SearchResultsRowComponent>;
  let utils: UnitTestingUtils;

  const nodeEntry: NodeEntry = {
    entry: {
      id: 'fake-node-entry',
      modifiedByUser: { displayName: 'IChangeThings' },
      modifiedAt: new Date(),
      isFile: true,
      properties: { 'cm:title': 'BananaRama' }
    }
  } as NodeEntry;

  const resultEntry: ResultSetRowEntry = {
    entry: {
      id: 'fake-node-entry',
      modifiedAt: new Date(),
      isFile: true,
      name: 'Random name',
      properties: {
        'cm:title': 'Random  title',
        'cm:description': 'some random description'
      },
      search: {
        score: 10,
        highlight: [
          { field: 'cm:content', snippets: [`Interesting <span class='aca-highlight'>random</span> content`] },
          { field: 'cm:name', snippets: [`<span class='aca-highlight'>Random</span>`] },
          { field: 'cm:title', snippets: [`<span class='aca-highlight'>Random</span> title`] },
          { field: 'cm:description', snippets: [`some <span class='aca-highlight'>random</span> description`] }
        ]
      }
    }
  } as ResultSetRowEntry;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule, SearchResultsRowComponent, MockDatatableCellBadgesComponent]
    });

    fixture = TestBed.createComponent(SearchResultsRowComponent);
    component = fixture.componentInstance;
    utils = new UnitTestingUtils(fixture.debugElement);
  });

  const getNameEl = (): HTMLSpanElement => utils.getByCSS('.aca-link.aca-crop-text').nativeElement;
  const getTitleEl = (): HTMLSpanElement => utils.getByDataAutomationId('search-results-entry-title').nativeElement;
  const getDescriptionEl = (): HTMLDivElement => utils.getByDataAutomationId('search-results-entry-description').nativeElement;
  const getContentEl = (): HTMLDivElement => utils.getByCSS('.aca-result-content.aca-crop-text').nativeElement;

  it('should show the current node', () => {
    component.context = { row: { node: nodeEntry } };
    fixture.detectChanges();

    expect(utils.getByCSS('div')).not.toBeNull();
  });

  it('should correctly parse highlights', (done) => {
    component.context = { row: { node: resultEntry } };
    component.content$.pipe(first()).subscribe(() => {
      fixture.detectChanges();

      expect(getNameEl().innerHTML).toBe('<span class="aca-highlight">Random</span>');
      expect(getNameEl().title).toBe('Random');

      expect(getTitleEl().innerHTML).toBe(' ( <span class="aca-highlight">Random</span> title )');
      expect(getTitleEl().title).toBe('Random title');

      expect(getDescriptionEl().innerHTML).toBe('some <span class="aca-highlight">random</span> description');
      expect(getDescriptionEl().title).toBe('some random description');

      expect(getContentEl().innerHTML).toBe('...Interesting <span class="aca-highlight">random</span> content...');
      expect(getContentEl().title).toBe('...Interesting random content...');
      done();
    });
    fixture.detectChanges();
  });

  it('should pass node to badge component', () => {
    component.context = { row: { node: nodeEntry } };
    fixture.detectChanges();

    const badgeElement = utils.getByCSS('aca-datatable-cell-badges').componentInstance;
    expect(badgeElement).not.toBe(null);
    expect(badgeElement.node).toBe(component.context.row.node);
  });

  it('should escape plain < and > in values', (done) => {
    const customEntry: ResultSetRowEntry = {
      entry: { ...nodeEntry.entry, name: '2 < 5 > 3', search: { score: 5 } }
    } as ResultSetRowEntry;

    component.context = { row: { node: customEntry } };
    component.name$.pipe(first()).subscribe(() => {
      fixture.detectChanges();

      expect(getNameEl().innerHTML).toBe('2 &lt; 5 &gt; 3');
      expect(getNameEl().textContent).toBe('2 < 5 > 3');
      done();
    });
    fixture.detectChanges();
  });

  it('should not render script tags as HTML', (done) => {
    const customEntry: ResultSetRowEntry = {
      entry: { ...nodeEntry.entry, name: '<script>alert("xss")</script>', search: { score: 5 } }
    } as ResultSetRowEntry;

    component.context = { row: { node: customEntry } };
    component.name$.pipe(first()).subscribe(() => {
      fixture.detectChanges();

      expect(getNameEl().innerHTML).toContain('&lt;script&gt;alert("xss")&lt;/script&gt;');
      expect(getNameEl().textContent).toBe('<script>alert("xss")</script>');
      done();
    });
    fixture.detectChanges();
  });

  it('should allow highlight spans but escape other tags', (done) => {
    const customEntry: ResultSetRowEntry = {
      entry: { ...nodeEntry.entry, name: '<b><span class="aca-highlight">BoldHighlight</span></b>', search: { score: 5 } }
    } as ResultSetRowEntry;

    component.context = { row: { node: customEntry } };
    component.name$.pipe(first()).subscribe(() => {
      fixture.detectChanges();

      expect(getNameEl().innerHTML).toBe('&lt;b&gt;<span class="aca-highlight">BoldHighlight</span>&lt;/b&gt;');
      expect(getNameEl().textContent).toBe('<b>BoldHighlight</b>');
      done();
    });
    fixture.detectChanges();
  });
});
