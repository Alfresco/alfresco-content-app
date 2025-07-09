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

import { SearchAiNavigationService } from './search-ai-navigation.service';
import { Params, Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { SearchAiService } from '@alfresco/adf-content-services';
import { NoopTranslateModule } from '@alfresco/adf-core';

describe('SearchAiNavigationService', () => {
  let service: SearchAiNavigationService;
  let router: Router;
  let searchAiService: SearchAiService;

  const knowledgeRetrievalUrl = '/knowledge-retrieval';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NoopTranslateModule]
    });
    service = TestBed.inject(SearchAiNavigationService);
    router = TestBed.inject(Router);
    searchAiService = TestBed.inject(SearchAiService);
  });

  describe('navigateToPreviousRoute', () => {
    let urlSpy: jasmine.Spy<() => string>;
    let navigateByUrlSpy: jasmine.Spy<(url: string) => Promise<boolean>>;

    const sourceUrl = '/some-url';
    const personalFilesUrl = '/personal-files';

    beforeEach(() => {
      navigateByUrlSpy = spyOn(router, 'navigateByUrl');
      urlSpy = spyOnProperty(router, 'url');
    });

    it('should navigate to personal files if there is not previous route and actual route is knowledge retrieval', () => {
      urlSpy.and.returnValue(knowledgeRetrievalUrl);
      service.navigateToPreviousRouteOrCloseInput();

      expect(navigateByUrlSpy).toHaveBeenCalledWith(personalFilesUrl);
    });

    it('should not navigate if there is not previous route and actual route is not knowledge retrieval but should updateSearchAiInputState', () => {
      spyOn(searchAiService, 'updateSearchAiInputState');
      urlSpy.and.returnValue('/some-url');
      service.navigateToPreviousRouteOrCloseInput();

      expect(navigateByUrlSpy).not.toHaveBeenCalled();
      expect(searchAiService.updateSearchAiInputState).toHaveBeenCalledWith({ active: false });
    });

    it('should navigate to previous route if there is some previous route and actual route is knowledge retrieval', () => {
      urlSpy.and.returnValue(sourceUrl);
      service.navigateToSearchAi({
        agentId: 'some agent id'
      });
      urlSpy.and.returnValue(knowledgeRetrievalUrl);
      navigateByUrlSpy.calls.reset();
      service.navigateToPreviousRouteOrCloseInput();

      expect(navigateByUrlSpy).toHaveBeenCalledWith(sourceUrl);
    });

    it('should not navigate to previous route if there is some previous route but actual route is not knowledge retrieval', () => {
      urlSpy.and.returnValue(sourceUrl);
      service.navigateToSearchAi({
        agentId: 'some agent id'
      });
      urlSpy.and.returnValue('/some-different-url');
      navigateByUrlSpy.calls.reset();
      service.navigateToPreviousRouteOrCloseInput();

      expect(navigateByUrlSpy).not.toHaveBeenCalled();
    });

    it('should navigate to personal files if previous route is knowledge retrieval and actual route is knowledge retrieval', () => {
      urlSpy.and.returnValue(knowledgeRetrievalUrl);
      service.navigateToSearchAi({
        agentId: 'some agent id'
      });
      navigateByUrlSpy.calls.reset();
      service.navigateToPreviousRouteOrCloseInput();

      expect(navigateByUrlSpy).toHaveBeenCalledWith(personalFilesUrl);
    });

    it('should not navigate if previous route is knowledge retrieval and actual route is different than knowledge retrieval', () => {
      urlSpy.and.returnValue(knowledgeRetrievalUrl);
      service.navigateToSearchAi({
        agentId: 'some agent id'
      });
      urlSpy.and.returnValue(sourceUrl);
      navigateByUrlSpy.calls.reset();
      service.navigateToPreviousRouteOrCloseInput();

      expect(navigateByUrlSpy).not.toHaveBeenCalled();
    });
  });

  describe('navigateToSearchAi', () => {
    beforeEach(() => {
      spyOn(router, 'navigate');
    });

    it('should navigate to search ai results page', () => {
      const queryParams: Params = {
        agentId: 'some agent id'
      };
      service.navigateToSearchAi(queryParams);

      expect(router.navigate).toHaveBeenCalledWith([knowledgeRetrievalUrl], {
        queryParams
      });
    });
  });
});
