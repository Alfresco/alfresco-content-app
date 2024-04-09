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

import { isLibrary, isLocked } from './node.utils';

describe('NodeUtils', () => {
  describe('isLocked', () => {
    it('should return [false] if entry is not defined', () => {
      expect(isLocked(null)).toBeFalse();
      expect(isLocked({ entry: null })).toBeFalse();
    });

    it('should return [true] if entry is locked', () => {
      expect(
        isLocked({
          entry: {
            isLocked: true
          } as any
        })
      ).toBeTrue();
    });

    it('should return [true] for [READ_ONLY_LOCK] type', () => {
      expect(
        isLocked({
          entry: {
            isLocked: false,
            properties: {
              'cm:lockType': 'READ_ONLY_LOCK'
            }
          } as any
        })
      ).toBeTrue();
    });

    it('should return [true] for [WRITE_LOCK] type', () => {
      expect(
        isLocked({
          entry: {
            isLocked: false,
            properties: {
              'cm:lockType': 'WRITE_LOCK'
            }
          } as any
        })
      ).toBeTrue();
    });

    it('should return [false] for unknown lock type', () => {
      expect(
        isLocked({
          entry: {
            isLocked: false,
            properties: {
              'cm:lockType': 'UNKNOWN'
            }
          } as any
        })
      ).toBeFalse();
    });
  });

  describe('isLibrary', () => {
    it('should return [false] if entry is not defined', () => {
      expect(isLibrary(null)).toBeFalse();
      expect(isLibrary({ entry: null })).toBeFalse();
    });

    it('should detect library by [st:site] node type', () => {
      expect(
        isLibrary({
          entry: {
            nodeType: 'st:site'
          }
        })
      ).toBeTrue();
    });

    it('should detect library by common properties', () => {
      expect(
        isLibrary({
          entry: {
            guid: '<guid>',
            id: '<id>',
            preset: '<preset>',
            title: '<title>',
            visibility: '<visibility>'
          }
        })
      ).toBeTrue();
    });
  });
});
