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
import * as user from './user.rules';
describe('evaluators', function() {
  describe('isAdmin', function() {
    it('should return [true] if user is admin', function() {
      var context = {
        profile: {
          isAdmin: true
        }
      };
      expect(user.isAdmin(context)).toBe(true);
    });
    it('should return [false] if user is not an admin', function() {
      var context = {
        profile: {
          isAdmin: false
        }
      };
      expect(user.isAdmin(context)).toBe(false);
    });
  });
});
//# sourceMappingURL=user.rules.spec.js.map
