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

import { searchAiMarkedOptions } from './search-ai-marked-options';

describe('SearchAiMarkedOptions', () => {
  let link = '';

  beforeEach(() => {
    link = searchAiMarkedOptions.renderer.link({
      raw: '',
      text: 'Example Link',
      type: 'link',
      href: 'https://example.com',
      title: 'Example',
      tokens: []
    });
  });

  it('should return a element', () => {
    expect(link).toContain('<a');
  });

  it('should returned link contain correct href', () => {
    expect(link).toContain('href="https://example.com"');
  });

  it('should returned link contain correct target', () => {
    expect(link).toContain('target="_blank"');
  });

  it('should returned link contain correct rel', () => {
    expect(link).toContain('rel="noopener noreferrer"');
  });

  it('should returned link contain correct title', () => {
    expect(link).toContain('title="Example"');
  });

  it('should returned link contain correct text', () => {
    expect(link).toContain('>Example Link</a>');
  });

  it('should returned link contain correct title if title is null', () => {
    expect(
      searchAiMarkedOptions.renderer.link({
        raw: '',
        text: 'Example Link',
        type: 'link',
        href: 'https://example.com',
        title: '',
        tokens: []
      })
    ).toContain('title=""');
  });
});
