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

import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { SearchAiResultsComponent } from './search-ai-results.component';
import { ClipboardService, CoreTestingModule, PageTitleService } from '@alfresco/adf-core';
import { ActivatedRoute, Router, RouterEvent } from '@angular/router';
import { of, ReplaySubject, Subject } from 'rxjs';
import { By } from '@angular/platform-browser';
import { SearchAiNavigationService } from '../search-ai-navigation.service';
import { DocumentBasePageService } from '@alfresco/aca-shared';
import { STORE_INITIAL_APP_DATA } from '@alfresco/aca-shared/store';
import { SearchQueryBuilderService } from '@alfresco/adf-content-services';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { Store } from '@ngrx/store';
import { delay } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { SearchAIService } from '../../../../services/search-ai.service';
import { AiSearchResultModel } from '../../../../services/ai-search-result.model';

class DocumentBasePageServiceMock extends DocumentBasePageService {
  canUpdateNode(): boolean {
    return true;
  }
  canUploadContent(): boolean {
    return true;
  }
}

describe('SearchAiResultsComponent', () => {
  let fixture: ComponentFixture<SearchAiResultsComponent>;
  let component: SearchAiResultsComponent;
  let searchAiService: SearchAIService;
  let searchNavigationService: SearchAiNavigationService;
  let clipboardService: ClipboardService;

  let executeAiSearchSpy: jasmine.Spy;

  const eventSubject = new ReplaySubject<RouterEvent>(1);
  const routerMock = {
    navigate: jasmine.createSpy('navigate'),
    events: eventSubject.asObservable(),
    url: '/test/search-ai'
  };
  const mockRouterParams = new Subject();
  const mockDialogRef = {
    open: jasmine.createSpy('open')
  };

  const getElementBySelector = (selector: string) => fixture.debugElement.query(By.css(selector))?.nativeElement;

  const mockAISearchResponse: AiSearchResultModel = {
    aiResponse: 'Mock AI response for unit tests',
    searchResult: {
      list: {
        entries: [
          {
            entry: {
              id: 'node1',
              name: 'node 1',
              modifiedAt: new Date(2),
              isFolder: false,
              isFile: true,
              nodeType: 'cm:content',
              path: {
                name: 'some/test/path/for/node/1'
              },
              search: {
                highlight: [
                  {
                    snippets: ['This is a [b]test[/b] snippet for content for node 1']
                  }
                ]
              }
            }
          },
          {
            entry: {
              id: 'node2',
              name: 'node 2',
              modifiedAt: new Date(2),
              isFolder: false,
              isFile: true,
              nodeType: 'cm:content',
              path: {
                name: 'some/test/path/for/node/2'
              },
              search: {
                highlight: [
                  {
                    snippets: ['This is a [b]test[/b] snippet for content for node 2']
                  }
                ]
              }
            }
          }
        ],
        pagination: { count: 2, hasMoreItems: false, totalItems: 2, skipCount: 0, maxItems: 20 },
        context: {
          consistency: { lastTxId: 122854 }
        }
      }
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [/* ContentServicesTestingModule */ CoreTestingModule, MatIconTestingModule],
      providers: [
        SearchQueryBuilderService,
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: { queryParams: mockRouterParams } },
        {
          provide: PageTitleService,
          useValue: {}
        },
        {
          provide: DocumentBasePageService,
          useClass: DocumentBasePageServiceMock
        },
        {
          provide: STORE_INITIAL_APP_DATA,
          useValue: {}
        },
        {
          provide: Store,
          useValue: { dispatch: () => null, select: () => of([]) }
        },
        { provide: MatDialog, useValue: mockDialogRef }
      ]
    });

    searchAiService = TestBed.inject(SearchAIService);
    searchNavigationService = TestBed.inject(SearchAiNavigationService);
    clipboardService = TestBed.inject(ClipboardService);
    executeAiSearchSpy = spyOn(searchAiService, 'executeAISearch').and.returnValue(of(null));

    fixture = TestBed.createComponent(SearchAiResultsComponent);
    component = fixture.componentInstance;
    mockRouterParams.next({ q: 'mock-search-term', hideAiToggle: false });
    fixture.detectChanges();
  });

  it('should trigger another AI search when regenerate response icon is clicked', () => {
    executeAiSearchSpy.and.returnValue(of(mockAISearchResponse));
    mockRouterParams.next({ q: 'test-search-term' });
    fixture.detectChanges();
    const regenerateResponseButton = getElementBySelector('[data-automation-id=regenerate-response-button]');
    regenerateResponseButton.click();
    expect(executeAiSearchSpy).toHaveBeenCalledWith('test-search-term', '');
  });

  it('should trigger ai search with restriction query, if one was provided in the route', () => {
    executeAiSearchSpy.and.returnValue(of(mockAISearchResponse));
    mockRouterParams.next({ q: 'test-search-term', restrictionQuery: 'test-restriction-query' });
    fixture.detectChanges();
    expect(executeAiSearchSpy).toHaveBeenCalledWith('test-search-term', 'test-restriction-query');
  });

  it('should copy ai response to clipboard when copy to clipboard icon is clicked', () => {
    spyOn(clipboardService, 'copyContentToClipboard');
    executeAiSearchSpy.and.returnValue(of(mockAISearchResponse));
    mockRouterParams.next({ q: 'test-search-term' });
    fixture.detectChanges();
    const copyToClipboardButton = getElementBySelector('[data-automation-id=copy-response-button]');
    copyToClipboardButton.click();
    expect(clipboardService.copyContentToClipboard).toHaveBeenCalledWith('Mock AI response for unit tests', 'Copied response to clipboard');
  });

  it('should extract search term from url, and call AI search API on init', () => {
    mockRouterParams.next({ q: 'test-search-term' });
    fixture.detectChanges();
    expect(component.searchQuery).toEqual('test-search-term');
    expect(searchAiService.executeAISearch).toHaveBeenCalledWith('test-search-term', '');
  });

  it('should show default search starting screen when no AI response is available', () => {
    executeAiSearchSpy.and.returnValue(of(null));
    mockRouterParams.next({ q: 'test-search-term' });
    fixture.detectChanges();
    const defaultAIStartScreen = getElementBySelector('[data-automation-id=default-ai-screen-container]');
    expect(defaultAIStartScreen).toBeDefined();
  });

  it('should exit search screen when close button is clicked', () => {
    spyOn(searchNavigationService, 'navigateBack');
    const closeSearchButton = getElementBySelector('[data-automation-id=close-search-button]');
    closeSearchButton.click();
    fixture.detectChanges();
    expect(searchNavigationService.navigateBack).toHaveBeenCalled();
  });

  it('should show blinking cursor animation while API response is being fetched, and remove it after it has been fetched', fakeAsync(() => {
    executeAiSearchSpy.and.returnValue(of(mockAISearchResponse).pipe(delay(1000)));
    mockRouterParams.next({ q: 'test-search-term' });
    fixture.detectChanges();
    let blinkingCursorElement = getElementBySelector('.app-blinking-cursor');
    expect(blinkingCursorElement).not.toBeUndefined();
    tick(1000);
    fixture.detectChanges();
    blinkingCursorElement = getElementBySelector('.app-blinking-cursor');
    expect(blinkingCursorElement).toBeUndefined();
  }));

  it('should show AI generated text response once AI response is received', () => {
    executeAiSearchSpy.and.returnValue(of(mockAISearchResponse));
    mockRouterParams.next({ q: 'test-search-term' });
    fixture.detectChanges();

    const aiResponseBody = getElementBySelector('[data-automation-id=ai-response-body]');
    expect(aiResponseBody).toBeDefined();
    expect(aiResponseBody.innerHTML).toEqual('Mock AI response for unit tests');
  });

  it('should show file icon, name, path and content snippet when AI response is received', () => {
    executeAiSearchSpy.and.returnValue(of(mockAISearchResponse));
    mockRouterParams.next({ q: 'test-search-term' });
    fixture.detectChanges();

    let nodeIcon = getElementBySelector('[data-automation-id=node1-file-icon]');
    let nodeName = getElementBySelector('[data-automation-id=node1-file-name]');
    let nodePath = getElementBySelector('[data-automation-id=node1-file-path]');
    let nodeContent = getElementBySelector('[data-automation-id=node1-file-content-0]');
    expect(nodeIcon).toBeDefined();
    expect(nodeName).toBeDefined();
    expect(nodeName.innerHTML).toEqual('node 1');
    expect(nodePath).toBeDefined();
    expect(nodePath.innerHTML).toEqual('some/test/path/for/node/1');
    expect(nodeContent).toBeDefined();
    expect(nodeContent.innerHTML).toEqual('This is a <b>test</b> snippet for content for node 1');

    nodeIcon = getElementBySelector('[data-automation-id=node2-file-icon]');
    nodeName = getElementBySelector('[data-automation-id=node2-file-name]');
    nodePath = getElementBySelector('[data-automation-id=node2-file-path]');
    nodeContent = getElementBySelector('[data-automation-id=node2-file-content-0]');

    expect(nodeIcon).toBeDefined();
    expect(nodeName).toBeDefined();
    expect(nodeName.innerHTML).toEqual('node 2');
    expect(nodePath).toBeDefined();
    expect(nodePath.innerHTML).toEqual('some/test/path/for/node/2');
    expect(nodeContent).toBeDefined();
    expect(nodeContent.innerHTML).toEqual('This is a <b>test</b> snippet for content for node 2');
  });

  it('should ask for confirmation when clicking on regenerate button', () => {
    spyOn(searchNavigationService, 'openConfirmDialog').and.returnValue(of(true));
    executeAiSearchSpy.and.returnValue(of(mockAISearchResponse));
    mockRouterParams.next({ q: 'test-search-term' });
    fixture.detectChanges();
    const regenerateResponseButton = getElementBySelector('[data-automation-id=regenerate-response-button]');
    regenerateResponseButton.click();
    expect(searchNavigationService.openConfirmDialog).toHaveBeenCalled();
  });
});
