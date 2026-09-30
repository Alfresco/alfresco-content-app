/*!
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { TestBed } from '@angular/core/testing';
import { NoopTranslateModule, provideCoreAuthTesting } from '@alfresco/adf-core';
import { AlfrescoApiService, AlfrescoApiServiceMock } from '@alfresco/adf-content-services';
import { AssociationEntry, NodeAssociationPaging } from '@alfresco/js-api';
import { ContentApiService } from './content-api.service';

describe('ContentApiService', () => {
  it('should be defined', () => {
    expect(ContentApiService).toBeDefined();
  });

  describe('associations', () => {
    let service: ContentApiService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [NoopTranslateModule],
        providers: [provideCoreAuthTesting(), { provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock }]
      });
      service = TestBed.inject(ContentApiService);
    });

    it('should list target associations', (done) => {
      const paging = { list: { entries: [] } } as NodeAssociationPaging;
      spyOn(service.nodesApi, 'listTargetAssociations').and.returnValue(Promise.resolve(paging));

      service.getNodeTargetAssociations('node-1', { maxItems: 10 }).subscribe((result) => {
        expect(service.nodesApi.listTargetAssociations).toHaveBeenCalledWith('node-1', { maxItems: 10 });
        expect(result).toBe(paging);
        done();
      });
    });

    it('should create a target association', (done) => {
      const entry = { entry: {} } as AssociationEntry;
      spyOn(service.nodesApi, 'createAssociation').and.returnValue(Promise.resolve(entry));
      const body = { targetId: 'target-1', assocType: 'cm:references' };

      service.createNodeAssociation('node-1', body).subscribe((result) => {
        expect(service.nodesApi.createAssociation).toHaveBeenCalledWith('node-1', body);
        expect(result).toBe(entry);
        done();
      });
    });

    it('should delete a target association scoped by association type', (done) => {
      spyOn(service.nodesApi, 'deleteAssociation').and.returnValue(Promise.resolve());

      service.deleteNodeAssociation('node-1', 'target-1', 'cm:references').subscribe(() => {
        expect(service.nodesApi.deleteAssociation).toHaveBeenCalledWith('node-1', 'target-1', { assocType: 'cm:references' });
        done();
      });
    });
  });
});
