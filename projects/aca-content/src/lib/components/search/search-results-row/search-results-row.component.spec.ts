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
import { By } from '@angular/platform-browser';
import { first } from 'rxjs/operators';
import { AppTestingModule } from '../../../testing/app-testing.module';
import { SearchResultsRowComponent } from './search-results-row.component';
import { Component, Input } from '@angular/core';

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
      properties: { 'cm:title': 'Random  title', 'cm:description': 'some random description' },
      search: {
        score: 10,
        highlight: [
          {
            field: 'cm:content',
            snippets: [`Interesting <span class='aca-highlight'>random</span> content`]
          },
          {
            field: 'cm:name',
            snippets: [`<span class='aca-highlight'>Random</span>`]
          },
          {
            field: 'cm:title',
            snippets: [`<span class='aca-highlight'>Random</span> title`]
          },
          {
            field: 'cm:description',
            snippets: [`some <span class='aca-highlight'>random</span> description`]
          }
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
  });

  it('should show the current node', () => {
    component.context = { row: { node: nodeEntry } };
    fixture.detectChanges();

    const element = fixture.nativeElement.querySelector('div');
    expect(element).not.toBeNull();
  });

  it('should correctly parse highlights', (done) => {
    component.context = { row: { node: resultEntry } };
    component.content$
      .asObservable()
      .pipe(first())
      .subscribe(() => {
        fixture.detectChanges();

        const nameElement: HTMLSpanElement = fixture.debugElement.query(By.css('.aca-link.aca-crop-text')).nativeElement;
        expect(nameElement.innerHTML).toBe('<span class="aca-highlight">Random</span>');
        expect(nameElement.title).toBe('Random');

        const titleElement: HTMLSpanElement = fixture.debugElement.query(By.css('[data-automation-id="search-results-entry-title"]')).nativeElement;
        expect(titleElement.innerHTML).toBe(' ( <span class="aca-highlight">Random</span> title )');
        expect(titleElement.title).toBe('Random title');

        const descriptionElement: HTMLDivElement = fixture.debugElement.query(
          By.css('[data-automation-id="search-results-entry-description"]')
        ).nativeElement;
        expect(descriptionElement.innerHTML).toBe('some <span class="aca-highlight">random</span> description');
        expect(descriptionElement.title).toBe('some random description');

        const contentElement: HTMLDivElement = fixture.debugElement.query(By.css('.aca-result-content.aca-crop-text')).nativeElement;
        expect(contentElement.innerHTML).toBe('...Interesting <span class="aca-highlight">random</span> content...');
        expect(contentElement.title).toBe('...Interesting random content...');
        done();
      });
    fixture.detectChanges();
  });

  it('should pass node to badge component', () => {
    component.context = { row: { node: nodeEntry } };
    const badgeElement = fixture.debugElement.query(By.css('aca-datatable-cell-badges'));
    expect(badgeElement).not.toBe(null);
    expect(badgeElement.componentInstance.node).toBe(component.context.node);
  });

  describe('XSS Prevention', () => {
    it('should sanitize malicious scripts in name field', (done) => {
      const maliciousEntry = createMaliciousEntry({
        name: 'Test<script>alert("xss")</script>Name'
      });

      component.context = { row: { node: maliciousEntry } };

      component.name$
        .asObservable()
        .pipe(first())
        .subscribe((sanitizedName) => {
          expect(sanitizedName).toBe('');
          expect(sanitizedName).not.toContain('<script>');
          done();
        });
      fixture.detectChanges();
    });

    it('should sanitize malicious event handlers in title field', (done) => {
      const maliciousEntry = createMaliciousEntry({
        properties: {
          'cm:title': 'Title<img src=x onerror=alert("xss")>End'
        }
      });

      component.context = { row: { node: maliciousEntry } };

      component.title$
        .asObservable()
        .pipe(first())
        .subscribe((sanitizedTitle) => {
          expect(sanitizedTitle).not.toContain('onerror');
          expect(sanitizedTitle).not.toContain('alert');
          done();
        });
      fixture.detectChanges();
    });

    it('should sanitize malicious content in description field', (done) => {
      const maliciousEntry = createMaliciousEntry({
        properties: {
          'cm:description': 'Description<script>document.cookie</script>End'
        }
      });

      component.context = { row: { node: maliciousEntry } };

      component.description$
        .asObservable()
        .pipe(first())
        .subscribe((sanitizedDescription) => {
          expect(sanitizedDescription).toBe('');
          expect(sanitizedDescription).not.toContain('<script>');
          done();
        });
      fixture.detectChanges();
    });

    it('should sanitize malicious content field', (done) => {
      const maliciousEntry = createMaliciousEntry({
        search: {
          score: 10,
          highlight: [
            {
              field: 'cm:content',
              snippets: ['Content<script>alert("xss")</script>End']
            }
          ]
        }
      });

      component.context = { row: { node: maliciousEntry } };

      component.content$
        .asObservable()
        .pipe(first())
        .subscribe((sanitizedContent) => {
          expect(sanitizedContent).toBe('');
          expect(sanitizedContent).not.toContain('<script>');
          done();
        });
      fixture.detectChanges();
    });

    it('should preserve safe HTML while removing malicious content', (done) => {
      const mixedEntry = createMaliciousEntry({
        name: 'Test<b>Bold</b><script>alert("xss")</script>End'
      });

      component.context = { row: { node: mixedEntry } };

      component.name$
        .asObservable()
        .pipe(first())
        .subscribe((sanitizedName) => {
          expect(sanitizedName).toContain('');
          expect(sanitizedName).not.toContain('<script>');
          done();
        });
      fixture.detectChanges();
    });
  });

  function createMaliciousEntry(overrides: any): ResultSetRowEntry {
    return {
      entry: {
        id: 'test-entry',
        modifiedAt: new Date(),
        isFile: true,
        name: 'Default Name',
        properties: { 'cm:title': 'Default Title', 'cm:description': 'Default Description' },
        search: { score: 10, highlight: [] },
        ...overrides
      }
    } as ResultSetRowEntry;
  }
});
