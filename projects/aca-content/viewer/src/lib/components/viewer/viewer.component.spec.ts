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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AcaViewerComponent } from '@alfresco/aca-content/viewer';
import { NodesApiService } from '@alfresco/adf-content-services';
import { RefreshPreviewAction } from '@alfresco/aca-shared/store';
import { Node } from '@alfresco/js-api';
import { EMPTY } from 'rxjs';
import { CoreTestingModule } from '@alfresco/adf-core';
import { Store, StoreModule } from '@ngrx/store';

describe('AcaViewerComponent', () => {
  let fixture: ComponentFixture<AcaViewerComponent>;
  let component: AcaViewerComponent;
  let nodesApiService: NodesApiService;
  let store: Store<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreTestingModule, StoreModule.forRoot({})]
    });

    store = TestBed.inject(Store);
    spyOn(store, 'select').and.returnValue(EMPTY);
    fixture = TestBed.createComponent(AcaViewerComponent);
    component = fixture.componentInstance;
    nodesApiService = TestBed.inject(NodesApiService);
  });

  describe('Load content', () => {
    it('should call node update after RefreshPreviewAction is triggered', () => {
      spyOn(nodesApiService.nodeUpdated, 'next');
      component.ngOnInit();
      const node = new Node();

      store.dispatch(new RefreshPreviewAction(node));
      expect(nodesApiService.nodeUpdated.next).toHaveBeenCalledWith(node);
    });
  });
});
