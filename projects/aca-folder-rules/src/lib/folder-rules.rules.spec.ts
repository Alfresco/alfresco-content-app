/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2020 Alfresco Software Limited
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

import { AcaRuleContext } from '@alfresco/aca-shared/rules';
import { isFolderRulesEnabled, canCreateFolderRule, canLinkFolderRule } from './folder-rules.rules';

describe('Folder Rules', () => {
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

  describe('canCreateFolderRule', () => {
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
      const result = canCreateFolderRule(context);
      expect(result).toEqual(true);
    });

    it('should not allow creating a rule if no folder selected', () => {
      context.selection.folder = null;

      const result = canCreateFolderRule(context);
      expect(result).toEqual(false);
    });
  });

  describe('canLinkFolderRule', () => {
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

    it('should allow linking rule for the selected folder', () => {
      const result = canLinkFolderRule(context);
      expect(result).toEqual(true);
    });

    it('should not allow linking rule if no folder selected', () => {
      context.selection.folder = null;

      const result = canLinkFolderRule(context);
      expect(result).toEqual(false);
    });
  });
});
