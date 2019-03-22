/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2019 Alfresco Software Limited
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

import { NodePermissionService } from './node-permission.service';

describe('NodePermissionService', () => {
  let permission: NodePermissionService;

  beforeEach(() => {
    permission = new NodePermissionService();
  });

  it('should return false when source is null', () => {
    const source = null;

    expect(permission.check(source, ['update'])).toBe(false);
  });

  describe('Multiple source permission', () => {
    it('should return true when source has allowableOperations permission', () => {
      const source = [
        { entry: { allowableOperations: ['update'] } },
        { entry: { allowableOperations: ['update'] } },
        { entry: { allowableOperations: ['update'] } }
      ];

      expect(permission.check(source, ['update'])).toBe(true);
    });

    it('should return true when source has allowableOperationsOnTarget permission', () => {
      const source = [
        { entry: { allowableOperationsOnTarget: ['update'] } },
        { entry: { allowableOperationsOnTarget: ['update'] } },
        { entry: { allowableOperationsOnTarget: ['update'] } }
      ];

      expect(
        permission.check(source, ['update'], {
          target: 'allowableOperationsOnTarget'
        })
      ).toBe(true);
    });

    it('should return false when source does not have allowableOperations permission', () => {
      const source = [
        { entry: { allowableOperations: ['update'] } },
        { entry: { allowableOperations: ['update'] } },
        { entry: { allowableOperations: ['delete'] } }
      ];

      expect(
        permission.check(source, ['update'], {
          target: 'allowableOperationsOnTarget'
        })
      ).toBe(false);
    });

    it('should return false when source does not have allowableOperationsOnTarget permission', () => {
      const source = [
        { entry: { allowableOperationsOnTarget: ['update'] } },
        { entry: { allowableOperationsOnTarget: ['update'] } },
        { entry: { allowableOperationsOnTarget: ['delete'] } }
      ];

      expect(
        permission.check(source, ['update'], {
          target: 'allowableOperationsOnTarget'
        })
      ).toBe(false);
    });

    it('should return true when source has `OR` allowableOperations permission', () => {
      const source = [
        { entry: { allowableOperations: ['update', 'delete'] } },
        { entry: { allowableOperations: ['update', 'create'] } },
        { entry: { allowableOperations: ['update', 'updatePermissions'] } }
      ];

      expect(permission.check(source, ['update', 'create'])).toBe(true);
    });

    it('should return true when source has `AND` allowableOperations permission', () => {
      const source = [
        { entry: { allowableOperations: ['update', 'delete', 'other'] } },
        { entry: { allowableOperations: ['update', 'create', 'other'] } },
        {
          entry: {
            allowableOperations: ['update', 'updatePermissions', 'other']
          }
        }
      ];

      expect(
        permission.check(source, ['update', 'other'], { operation: 'AND' })
      ).toBe(true);
    });

    it('should return false when source has no `AND` allowableOperations permission', () => {
      const source = [
        { entry: { allowableOperations: ['update', 'delete', 'other'] } },
        { entry: { allowableOperations: ['update', 'create', 'other'] } },
        {
          entry: {
            allowableOperations: ['update', 'updatePermissions', 'other']
          }
        }
      ];

      expect(
        permission.check(source, ['update', 'bogus'], { operation: 'AND' })
      ).toBe(false);
    });

    it('should return false when source has no allowableOperations', () => {
      const source = [
        { entry: { allowableOperations: [] } },
        { entry: { allowableOperations: [] } },
        { entry: { allowableOperations: ['update'] } }
      ];

      expect(permission.check(source, ['update'])).toBe(false);
    });

    it('should return false when source has no allowableOperations property', () => {
      const source = [
        { entry: {} },
        { entry: {} },
        { entry: { allowableOperations: ['update'] } }
      ];

      expect(permission.check(source, ['update'])).toBe(false);
    });
  });

  describe('Single source permission', () => {
    it('should return true when source has allowableOperations permission', () => {
      const source = { entry: { allowableOperations: ['update'] } };

      expect(permission.check(source, ['update'])).toBe(true);
    });

    it('should return true when source has allowableOperationsOnTarget permission', () => {
      const source = { entry: { allowableOperationsOnTarget: ['update'] } };

      expect(
        permission.check(source, ['update'], {
          target: 'allowableOperationsOnTarget'
        })
      ).toBe(true);
    });

    it('should return false when source does not have allowableOperations permission', () => {
      const source = { entry: { allowableOperations: ['delete'] } };

      expect(permission.check(source, ['update'])).toBe(false);
    });

    it('should return false when source does not have allowableOperationsOnTarget permission', () => {
      const source = { entry: { allowableOperationsOnTarget: ['delete'] } };

      expect(
        permission.check(source, ['update'], {
          target: 'allowableOperationsOnTarget'
        })
      ).toBe(false);
    });

    it('should return true when source has `OR` allowableOperations permission', () => {
      const source = { entry: { allowableOperations: ['update'] } };

      expect(permission.check(source, ['update', 'create'])).toBe(true);
    });

    it('should return true when source has `AND` allowableOperations permission', () => {
      const source = { entry: { allowableOperations: ['update', 'other'] } };

      expect(
        permission.check(source, ['update', 'other'], { operation: 'AND' })
      ).toBe(true);
    });

    it('should return false when source has no `AND` allowableOperations permission', () => {
      const source = {
        entry: { allowableOperations: ['update', 'updatePermissions', 'other'] }
      };

      expect(
        permission.check(source, ['update', 'bogus'], { operation: 'AND' })
      ).toBe(false);
    });

    it('should return false when source has no allowableOperations', () => {
      const source = { entry: { allowableOperations: [] } };

      expect(permission.check(source, ['update'])).toBe(false);
    });

    it('should return false when source has no allowableOperations property', () => {
      const source = { entry: {} };

      expect(permission.check(source, ['update'])).toBe(false);
    });
  });
});
