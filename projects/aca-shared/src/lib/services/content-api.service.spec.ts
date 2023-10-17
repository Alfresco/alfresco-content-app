/*!
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { ThumbnailService } from '@alfresco/adf-core';
import { ContentApiService } from './content-api.service';
import { TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';

describe('ContentApiService', () => {
  it('should be defined', () => {
    expect(ContentApiService).toBeDefined();
  });

  describe('Info Drawer header Icon', () => {
    let thumbnailService: ThumbnailService;
    let service: any;

    const mockNode = {
      isFile: false,
      createdByUser: { id: 'admin', displayName: 'Administrator' },
      modifiedAt: new Date('2017-05-24T15:08:55.640Z'),
      nodeType: 'cm:content',
      content: {
        mimeType: 'application/rtf',
        mimeTypeName: 'Rich Text Format',
        sizeInBytes: 14530,
        encoding: 'UTF-8'
      },
      parentId: 'd124de26-6ba0-4f40-8d98-4907da2d337a',
      createdAt: new Date('2017-05-24T15:08:55.640Z'),
      path: {
        name: '/Company Home/Guest Home',
        isComplete: true,
        elements: [
          {
            id: '94acfc73-7014-4475-9bd9-93a2162f0f8c',
            name: 'Company Home'
          },
          { id: 'd124de26-6ba0-4f40-8d98-4907da2d337a', name: 'Guest Home' }
        ]
      },
      isFolder: true,
      modifiedByUser: { id: 'admin', displayName: 'Administrator' },
      name: 'b_txt_file.rtf',
      id: '70e1cc6a-6918-468a-b84a-1048093b06fd',
      properties: { 'cm:versionLabel': '1.0', 'cm:versionType': 'MAJOR' },
      allowableOperations: ['delete', 'update']
    };

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientModule, TranslateModule.forRoot()],
        providers: [TranslateService]
      });
      thumbnailService = TestBed.inject(ThumbnailService);
      service = TestBed.inject(ContentApiService);
    });

    function testNodeIcon(iconPath: string, isFoldeType: boolean, isFileType: boolean) {
      spyOn(thumbnailService, 'getMimeTypeIcon').and.returnValue(iconPath);
      mockNode.isFolder = isFoldeType;
      mockNode.isFile = isFileType;
      const value = service.getNodeIcon(mockNode);
      expect(value).toContain(iconPath);
    }

    it('should resolve folder icon', () => {
      testNodeIcon('assets/images/ft_ic_folder.svg', true, false);
    });

    it('should resolve smart folder icon', () => {
      testNodeIcon('assets/images/ft_ic_smart_folder.svg', true, false);
    });

    it('should resolve link folder icon', () => {
      testNodeIcon('assets/images/ft_ic_folder_shortcut_link.svg', true, false);
    });

    it('should resolve rule folder icon', () => {
      testNodeIcon('assets/images/ft_ic_folder_rule.svg', true, false);
    });

    it('should resolve file icon for content type', () => {
      testNodeIcon('assets/images/ft_ic_raster_image.svg', false, true);
    });

    it('should resolve fallback file icon for unknown node', () => {
      spyOn(thumbnailService, 'getDefaultMimeTypeIcon').and.returnValue(`assets/images/ft_ic_miscellaneous.svg`);
      mockNode.isFile = false;
      mockNode.isFolder = false;
      const value = service.getNodeIcon(mockNode);
      expect(value).toContain(`assets/images/ft_ic_miscellaneous`);
    });
  });
});
