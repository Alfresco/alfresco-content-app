/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2018 Alfresco Software Limited
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

import { TrashcanNameColumnComponent } from './trashcan-name-column.component';

describe('TrashcanNameColumnComponent', () => {
  let component;

  beforeEach(() => {
    component = new TrashcanNameColumnComponent();
  });

  it('should set displayText for content files', () => {
    const context = {
      data: { rows: [] },
      row: {
        node: {
          entry: {
            name: 'contentName',
            nodeType: 'content'
          }
        }
      }
    };

    component.context = context;
    component.ngOnInit();

    expect(component.displayText).toBe('contentName');
  });

  it('should set displayText for library', () => {
    const context = {
      data: {
        rows: []
      },
      row: {
        node: {
          entry: {
            nodeType: 'st:site',
            properties: {
              'cm:title': 'libraryTitle'
            }
          }
        }
      }
    };

    component.context = context;
    component.ngOnInit();

    expect(component.displayText).toBe('libraryTitle');
  });

  it('should set custom displayText for libraries with same name', () => {
    const context = {
      data: {
        rows: [
          {
            node: {
              entry: {
                id: 'id1',
                name: 'name1',
                nodeType: 'st:site',
                properties: {
                  'cm:title': 'bogus'
                }
              }
            }
          }
        ]
      },
      row: {
        node: {
          entry: {
            id: 'id2',
            name: 'name1',
            nodeType: 'st:site',
            properties: {
              'cm:title': 'bogus'
            }
          }
        }
      }
    };

    component.context = context;
    component.ngOnInit();

    expect(component.displayText).toBe('bogus (name1)');
  });
});
