/*!
* @license
* Alfresco Example Content Application
*
* Copyright (C) 2005 - 2020 Alfresco Software Limited
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
* along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
*/

import { CoreTestingModule } from '@alfresco/adf-core';
import { SecurityGroupPaging, SecurityMarkPaging } from '@alfresco/js-api';
import { TestBed } from '@angular/core/testing';
import { SecurityMarksService } from './security-marks.service';

fdescribe('SecurityMarksService', () => {
    let service: SecurityMarksService;
    let securityGroupId;

    beforeAll(() => {
        TestBed.configureTestingModule({
            imports: [CoreTestingModule],
        });

        service = TestBed.inject(SecurityMarksService);
    });

    it('should be able to get the list of Security groups', async () => {
        const getGroupSpy = spyOn(
            service.groupsApi,
            'getSecurityGroups'
        ).and.returnValue(Promise.resolve(fakeGroupsApiResponse));
        const groupPromise = service.getSecurityGroup('inUse', 0, 5);
        const group = await groupPromise;
        expect(getGroupSpy).toHaveBeenCalledWith({
            include: 'inUse',
            skipCount: 0,
            maxItems: 5,
        });

        expect(group.entries[0].id).toBe('classification');
        expect(group.entries[0].groupName).toBe('Classification');
        expect(group.entries[0].groupType).toBe('HIERARCHICAL');

        expect(group.entries[1].id).toBe(
            'd2b11d9f-2707-439f-a7c6-e7872f395553'
        );
        expect(group.entries[1].groupName).toBe('SG1');
        expect(group.entries[1].groupType).toBe('USER_REQUIRES_ALL');

        expect(group.entries[2].id).toBe(
            '1b77a32d-6b8b-4a37-b195-7f2ff2fe4ed3'
        );
        expect(group.entries[2].groupName).toBe('SG2');
        expect(group.entries[2].groupType).toBe('USER_REQUIRES_ALL');

        expect(group.entries[3].id).toBe(
            '709791f8-22dc-428a-82dd-daf3e1aa8a60'
        );
        expect(group.entries[3].groupName).toBe('SG3');
        expect(group.entries[3].groupType).toBe('USER_REQUIRES_ALL');
    });

    it('should be able to get the list of Security Marks', async () => {
      const getMarkSpy = spyOn(
          service.marksApi,
          'getSecurityMarks'
      ).and.returnValue(Promise.resolve(fakeMarksApiResponse));
      const markPromise = service.getSecurityMark(
          securityGroupId,
          'inUse',
          0,
          10
      );
      const mark = await markPromise;

      expect(getMarkSpy).toHaveBeenCalledWith(securityGroupId, {
          include: 'inUse',
          skipCount: 0,
          maxItems: 10,
      });

      expect(mark.entries[0].groupId).toBe(
          'eddf6269-ceba-42c6-b979-9ac445d29a94'
      );
      expect(mark.entries[0].name).toBe('securityMark1');
      expect(mark.entries[0].id).toBe('ffBOeOJJ');
  });

  const fakeMarksApiResponse: SecurityMarkPaging = {
    'list': {
          'pagination': {
              'count': 1,
              'hasMoreItems': false,
              'totalItems': 1,
              'skipCount': 0,
              'maxItems': 10
          },
          'entries': [
              {
                  'entry': {
                      'groupId': 'eddf6269-ceba-42c6-b979-9ac445d29a94',
                      'name': 'securityMark1',
                      'id': 'ffBOeOJJ'
                  }
              }
          ]
      }
  };

  const fakeGroupsApiResponse: SecurityGroupPaging = {
    list: {
        pagination: {
           count: 4,
           hasMoreItems: false,
           maxItems: 5,
           skipCount: 0,
           totalItems: 4,
        },

        entries: [
            {
              entry: {
                groupName: 'Classification',
                groupType: 'HIERARCHICAL',
                id: 'classification',
                inUse: true,
              },
            },
            {
              entry: {
                groupName: 'SG1',
                groupType: 'USER_REQUIRES_ALL',
                id: 'd2b11d9f-2707-439f-a7c6-e7872f395553',
                inUse: true,
              },
            },
            {
              entry: {
                groupName: 'SG2',
                groupType: 'USER_REQUIRES_ALL',
                id: '1b77a32d-6b8b-4a37-b195-7f2ff2fe4ed3',
                inUse: true,
              },
            },
            {
              entry: {
                groupName: 'SG3',
                groupType: 'USER_REQUIRES_ALL',
                id: '709791f8-22dc-428a-82dd-daf3e1aa8a60',
                inUse: true,
              },
            },
        ],
    },
  };
});
