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

import { ToggleInfoDrawerComponent } from './toggle-info-drawer.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppTestingModule } from '../../../testing/app-testing.module';
import { Subject } from 'rxjs';

describe('ToggleInfoDrawerComponent', () => {
  let fixture: ComponentFixture<ToggleInfoDrawerComponent>;
  const mockStream = new Subject();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule, ToggleInfoDrawerComponent]
    });

    fixture = TestBed.createComponent(ToggleInfoDrawerComponent);
  });

  it('should show info drawer button', async () => {
    mockStream.next(true);
    fixture.detectChanges();
    await fixture.whenStable();

    const infoDrawerButton: HTMLButtonElement = fixture.nativeElement.querySelector('.app-toggle-info-drawer button');
    expect(infoDrawerButton).not.toBeNull();
  });
});
