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

import { AcaRuleContext } from '@alfresco/aca-shared/rules';
import { canManageFolderRules, isFolderRulesEnabled } from './folder-rules.rules';
import { NodeEntry } from '@alfresco/js-api';

describe('Folder Rules Visibility Rules', () => {
  describe('isFolderRulesEnabled', () => {
    it('should have the feature enabled', () => {
      const context: any = {
        appConfig: {
          get: () => true
        }
      };

      const result = isFolderRulesEnabled(context);
      expect(result).toEqual(true);
    });

    it('should have the feature disabled', () => {
      const context: any = {
        appConfig: {
          get: () => false
        }
      };

      const result = isFolderRulesEnabled(context);
      expect(result).toEqual(false);
    });
  });

  describe('canManageFolderRules', () => {
    let context: AcaRuleContext;

    beforeEach(() => {
      context = {
        appConfig: {
          get: () => true
        },
        selection: {
          folder: {} as any
        },
        navigation: {
          url: '/personal-files'
        },
        permissions: {
          check: () => true
        }
      } as any;
    });

    it('should allow creating a rule for the selected folder', () => {
      const result = canManageFolderRules(context);
      expect(result).toEqual(true);
    });

    it('should not allow creating a rule if no folder selected', () => {
      context.selection.folder = null;

      const result = canManageFolderRules(context);
      expect(result).toEqual(false);
    });

    it('should not allow creating a rule if the selected node is a smart folder', () => {
      context.selection.first = { entry: { aspectNames: ['smf:customConfigSmartFolder'], isFolder: true } } as NodeEntry;
      const result = canManageFolderRules(context);

      expect(result).toBe(false);
    });
  });
});
