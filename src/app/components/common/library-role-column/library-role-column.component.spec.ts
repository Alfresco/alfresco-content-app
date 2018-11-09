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

import { LibraryRoleColumnComponent } from './library-role-column.component';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppTestingModule } from '../../../testing/app-testing.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('LibraryNameColumnComponent', () => {
  let fixture: ComponentFixture<LibraryRoleColumnComponent>;
  let component: LibraryRoleColumnComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      declarations: [LibraryRoleColumnComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(LibraryRoleColumnComponent);
    component = fixture.componentInstance;
  });

  it('should render Manager', () => {
    component.context = { row: { node: { entry: { role: 'SiteManager' } } } };
    fixture.detectChanges();
    expect(component.displayText).toBe('APP.SITES_ROLE.MANAGER');
  });

  it('should render Collaborator', () => {
    component.context = {
      row: { node: { entry: { role: 'SiteCollaborator' } } }
    };
    fixture.detectChanges();
    expect(component.displayText).toBe('APP.SITES_ROLE.COLLABORATOR');
  });

  it('should render Contributor', () => {
    component.context = {
      row: { node: { entry: { role: 'SiteContributor' } } }
    };
    fixture.detectChanges();
    expect(component.displayText).toBe('APP.SITES_ROLE.CONTRIBUTOR');
  });

  it('should render Consumer', () => {
    component.context = {
      row: { node: { entry: { role: 'SiteConsumer' } } }
    };
    fixture.detectChanges();
    expect(component.displayText).toBe('APP.SITES_ROLE.CONSUMER');
  });

  it('should not render text for unknown', () => {
    component.context = {
      row: { node: { entry: { role: 'ROLE' } } }
    };
    fixture.detectChanges();
    expect(component.displayText).toBe('');
  });
});
