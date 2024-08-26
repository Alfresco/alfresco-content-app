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
import { ThumbnailColumnComponent } from './thumbnail-column.component';
import { TranslationService } from '@alfresco/adf-core';

describe('ThumbnailColumnComponent', () => {
  let component: ThumbnailColumnComponent;
  let fixture: ComponentFixture<ThumbnailColumnComponent>;
  let translationServiceMock: any;

  beforeEach(() => {
    translationServiceMock = {
      instant: jasmine.createSpy('instant').and.returnValue('Locked by')
    };

    TestBed.configureTestingModule({
      imports: [ThumbnailColumnComponent],
      providers: [{ provide: TranslationService, useValue: translationServiceMock }]
    });

    fixture = TestBed.createComponent(ThumbnailColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should update thumbnailUrl and tooltip on context change', () => {
    const context = {
      row: { isSelected: true, node: { entry: { properties: { 'cm:lockOwner': { displayName: 'John Doe' } } } } },
      data: { getValue: () => 'material-icons://icon_name' },
      col: {}
    };

    component.ngOnChanges({ context: { currentValue: context, previousValue: null, firstChange: true, isFirstChange: () => true } });

    expect(component.isIcon).toBeTrue();
    expect(component.thumbnailUrl).toBe('icon_name');
    expect(component.tooltip).toBe('Locked by John Doe');
  });

  it('should handle non-icon thumbnails', () => {
    const context = {
      row: { isSelected: true, node: { entry: { properties: { 'cm:lockOwner': { displayName: 'John Doe' } } } } },
      data: { getValue: () => 'https://example.com/thumbnail.jpg' },
      col: {}
    };

    component.ngOnChanges({ context: { currentValue: context, previousValue: null, firstChange: true, isFirstChange: () => true } });

    expect(component.isIcon).toBeFalse();
    expect(component.thumbnailUrl).toBe('https://example.com/thumbnail.jpg');
    expect(component.tooltip).toBe('Locked by John Doe');
  });

  it('should clear thumbnailUrl and tooltip if context is null', () => {
    component.ngOnChanges({ context: { currentValue: null, previousValue: {}, firstChange: false, isFirstChange: () => false } });

    expect(component.thumbnailUrl).toBeNull();
    expect(component.tooltip).toBeNull();
  });

  it('should return correct thumbnail from getThumbnail', () => {
    const context = {
      data: { getValue: () => 'thumbnail_url' },
      row: {},
      col: {}
    };

    const thumbnail = component['getThumbnail'](context);
    expect(thumbnail).toBe('thumbnail_url');
  });

  it('should return correct tooltip from getToolTip', () => {
    const context = {
      row: { node: { entry: { properties: { 'cm:lockOwner': { displayName: 'John Doe' } } } } }
    };

    const tooltip = component.getToolTip(context);
    expect(tooltip).toBe('Locked by John Doe');
  });

  it('should return empty tooltip if lockOwner is not present', () => {
    const context = {
      row: { node: { entry: { properties: {} } } }
    };

    const tooltip = component.getToolTip(context);
    expect(tooltip).toBe('');
  });
});
