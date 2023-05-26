/*!
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { TagsColumnComponent } from './tags-column.component';
import { ChangeDetectorRef } from '@angular/core';
import { AppTestingModule } from '../../../testing/app-testing.module';

describe('TagsColumnComponent', () => {
  let fixture: ComponentFixture<TagsColumnComponent>;
  let component: TagsColumnComponent;
  let changeDetector: ChangeDetectorRef;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule, TagsColumnComponent],
      providers: [{ provide: ChangeDetectorRef, useValue: { detectChanges() {} } }]
    });

    changeDetector = TestBed.inject(ChangeDetectorRef);
    fixture = TestBed.createComponent(TagsColumnComponent);
    component = fixture.componentInstance;
    component.context = { row: { id: '0' } };
  });

  it('should return nodeId from the row', () => {
    const row: any = { id: 'test1' };
    expect(component.getNodeId(row)).toBe('test1');
  });

  it('should force change detection on tags loading', () => {
    spyOn(changeDetector, 'detectChanges');
    component = new TagsColumnComponent(changeDetector);
    component.onTagsLoaded();
    expect(changeDetector.detectChanges).toHaveBeenCalled();
  });
});
