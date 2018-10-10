/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2018 Alfresco Software Limited
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

import { LibraryNameColumnComponent } from './library-name-column.component';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppTestingModule } from '../../../testing/app-testing.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('LibraryNameColumnComponent', () => {
  let fixture: ComponentFixture<LibraryNameColumnComponent>;
  let component: LibraryNameColumnComponent;
  let node;

  beforeEach(() => {
    node = <any>{
      id: 'nodeId',
      path: {
        elements: []
      }
    };
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      declarations: [LibraryNameColumnComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(LibraryNameColumnComponent);
    component = fixture.componentInstance;
  });

  describe('makeLibraryTooltip()', () => {
    it('maps tooltip to description', () => {
      node.description = 'description';
      const tooltip = component.makeLibraryTooltip(node);

      expect(tooltip).toBe(node.description);
    });

    it('maps tooltip to description', () => {
      node.title = 'title';
      const tooltip = component.makeLibraryTooltip(node);

      expect(tooltip).toBe(node.title);
    });

    it('sets tooltip to empty string', () => {
      const tooltip = component.makeLibraryTooltip(node);

      expect(tooltip).toBe('');
    });
  });

  describe('makeLibraryTitle()', () => {
    it('sets title with id when duplicate nodes title exists in list', () => {
      node.title = 'title';

      const rows = [
        <any>{ node: { entry: { id: 'some-id', title: 'title' } } }
      ];

      const title = component.makeLibraryTitle(node, rows);
      expect(title).toContain('nodeId');
    });

    it('sets title when no duplicate nodes title exists in list', () => {
      node.title = 'title';

      const rows = [
        <any>{ node: { entry: { id: 'some-id', title: 'title-some-id' } } }
      ];

      const title = component.makeLibraryTitle(node, rows);

      expect(title).toBe('title');
    });
  });
});
