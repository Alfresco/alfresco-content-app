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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LockIconComponent } from './lock-icon.component';
import { NoopTranslateModule } from '@alfresco/adf-core';
import { NodeEntry } from '@alfresco/js-api';
import { TranslateService } from '@ngx-translate/core';

const lockOwner = { id: 'jdoe', displayName: 'Jane Doe' };
const workingCopyOwner = { id: 'jsmith', displayName: 'John Smith' };

function makeNode(aspectNames: string[], properties: Record<string, unknown> = {}): { node: NodeEntry } {
  return {
    node: {
      entry: {
        isFile: true,
        id: 'node-id',
        aspectNames,
        properties
      }
    } as NodeEntry
  };
}

describe('LockIconComponent', () => {
  let fixture: ComponentFixture<LockIconComponent>;
  let component: LockIconComponent;
  let translate: TranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NoopTranslateModule, LockIconComponent]
    });

    fixture = TestBed.createComponent(LockIconComponent);
    component = fixture.componentInstance;
    translate = TestBed.inject(TranslateService);
    spyOn(translate, 'instant').and.callFake((key: string, params?: Record<string, string>) => `${key}:${params?.owner ?? ''}`);
  });

  describe('working copy (cm:workingcopy aspect)', () => {
    beforeEach(() => {
      component.data = makeNode(['cm:workingcopy'], { 'cm:workingCopyOwner': workingCopyOwner });
      component.ngOnInit();
    });

    it('should use WORKING_COPY_BADGE translation key', () => {
      expect(translate.instant).toHaveBeenCalledWith('APP.TOOLTIPS.WORKING_COPY_BADGE', { owner: workingCopyOwner.displayName });
    });

    it('should set tooltip with working copy owner name', () => {
      expect(component.tooltip).toBe(`APP.TOOLTIPS.WORKING_COPY_BADGE:${workingCopyOwner.displayName}`);
    });
  });

  describe('checked-out original (cm:checkedOut aspect)', () => {
    beforeEach(() => {
      component.data = makeNode(['cm:checkedOut'], { 'cm:lockOwner': lockOwner });
      component.ngOnInit();
    });

    it('should use LOCK_BADGE translation key', () => {
      expect(translate.instant).toHaveBeenCalledWith('APP.TOOLTIPS.LOCK_BADGE', { owner: lockOwner.displayName });
    });

    it('should set tooltip with lock owner name', () => {
      expect(component.tooltip).toBe(`APP.TOOLTIPS.LOCK_BADGE:${lockOwner.displayName}`);
    });
  });

  describe('generic lock (no checkout aspects)', () => {
    beforeEach(() => {
      component.data = makeNode([], { 'cm:lockOwner': lockOwner });
      component.ngOnInit();
    });

    it('should use LOCK_BADGE translation key', () => {
      expect(translate.instant).toHaveBeenCalledWith('APP.TOOLTIPS.LOCK_BADGE', { owner: lockOwner.displayName });
    });

    it('should set tooltip with lock owner name', () => {
      expect(component.tooltip).toBe(`APP.TOOLTIPS.LOCK_BADGE:${lockOwner.displayName}`);
    });
  });

  describe('fallback when owner has no displayName', () => {
    it('should fall back to owner id when displayName is absent', () => {
      component.data = makeNode([], { 'cm:lockOwner': { id: 'admin' } });
      component.ngOnInit();
      expect(translate.instant).toHaveBeenCalledWith('APP.TOOLTIPS.LOCK_BADGE', { owner: 'admin' });
    });

    it('should use empty string when owner property is absent', () => {
      component.data = makeNode([], {});
      component.ngOnInit();
      expect(translate.instant).toHaveBeenCalledWith('APP.TOOLTIPS.LOCK_BADGE', { owner: '' });
    });
  });

  describe('missing data', () => {
    it('should not throw when data is undefined', () => {
      component.data = undefined;
      expect(() => component.ngOnInit()).not.toThrow();
    });
  });
});
