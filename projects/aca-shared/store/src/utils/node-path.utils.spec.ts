/*!
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { PathInfo } from '@alfresco/js-api';
import { getNodeContentSource } from './node-path.utils';

describe('getNodeContentSource', () => {
  it('should return [personal-files] when no path information is available', () => {
    expect(getNodeContentSource(undefined)).toBe('personal-files');
    expect(getNodeContentSource({} as PathInfo)).toBe('personal-files');
    expect(getNodeContentSource({ elements: [] } as PathInfo)).toBe('personal-files');
  });

  it('should return [personal-files] when User Homes is the second path element', () => {
    const path = {
      name: '/Company Home/User Homes/user1',
      elements: [{ name: 'Company Home' }, { name: 'User Homes' }, { name: 'user1' }]
    } as PathInfo;
    expect(getNodeContentSource(path)).toBe('personal-files');
  });

  it('should return [personal-files] when User Homes is present in the path name', () => {
    const path = { name: '/Company Home/User Homes/user1/folder', elements: [{ name: 'Company Home' }, { name: 'User Homes' }] } as PathInfo;
    expect(getNodeContentSource(path)).toBe('personal-files');
  });

  it('should return [libraries] for a site path', () => {
    const path = { name: '/Company Home/Sites/my-site', elements: [{ name: 'Company Home' }, { name: 'Sites' }, { name: 'my-site' }] } as PathInfo;
    expect(getNodeContentSource(path)).toBe('libraries');
  });

  it('should return [repository] when only the repository root is present', () => {
    const path = { name: '/Company Home', elements: [{ name: 'Company Home' }] } as PathInfo;
    expect(getNodeContentSource(path)).toBe('repository');
  });

  it('should return [repository] for any other path nested under the repository root', () => {
    const path = { name: '/Company Home/Some Folder', elements: [{ name: 'Company Home' }, { name: 'Some Folder' }] } as PathInfo;
    expect(getNodeContentSource(path)).toBe('repository');
  });
});
