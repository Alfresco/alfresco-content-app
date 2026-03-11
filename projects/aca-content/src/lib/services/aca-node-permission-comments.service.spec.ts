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

import { Node } from '@alfresco/js-api';
import { AcaNodePermissionCommentsService } from './aca-node-permission-comments.service';

describe('AcaNodePermissionCommentsService', () => {
  let service: AcaNodePermissionCommentsService;

  beforeEach(() => {
    service = new AcaNodePermissionCommentsService();
  });

  it('should return false when node type is blacklisted', () => {
    const node = { nodeType: 'rma:hold', aspectNames: [] } as Node;

    expect(service.canAddComments(node)).toBeFalse();
  });

  it('should return false when node has a blacklisted aspect', () => {
    const node = { nodeType: 'cm:content', aspectNames: ['rma:frozen'] } as Node;

    expect(service.canAddComments(node)).toBeFalse();
  });

  it('should return false when node has both blacklisted type and aspect', () => {
    const node = { nodeType: 'rma:hold', aspectNames: ['rma:frozen'] } as Node;

    expect(service.canAddComments(node)).toBeFalse();
  });

  it('should return true when node type and aspects are not blacklisted', () => {
    const node = { nodeType: 'cm:content', aspectNames: ['cm:titled'] } as Node;

    expect(service.canAddComments(node)).toBeTrue();
  });

  it('should return true when aspectNames is missing and node type is allowed', () => {
    const node = { nodeType: 'cm:content' } as Node;

    expect(service.canAddComments(node)).toBeTrue();
  });
});
