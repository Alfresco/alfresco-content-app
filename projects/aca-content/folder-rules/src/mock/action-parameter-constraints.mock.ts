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

import { ActionParameterConstraint } from '../model/action-parameter-constraint.model';

export const dummyConstraints: ActionParameterConstraint[] = [
  {
    name: 'aspect-name',
    constraints: [
      {
        value: 'cm:aspect1',
        label: 'Label 1'
      },
      {
        value: 'cm:aspect2',
        label: 'Label 2'
      },
      {
        value: 'cm:aspect3',
        label: ''
      }
    ]
  }
];

export const rawConstraints = {
  entry: {
    constraintValues: [
      {
        value: 'cm:aspect1',
        label: 'Label 1'
      },
      {
        value: 'cm:aspect2',
        label: 'Label 2'
      },
      {
        value: 'cm:aspect3'
      }
    ],
    constraintName: 'ac-aspects'
  }
};

export const dummyTagsConstraints: ActionParameterConstraint[] = [
  {
    name: 'aspect-name',
    constraints: [
      {
        value: 'cm:tagscope',
        label: 'Label 1'
      },
      {
        value: 'cm:tagScopeCache',
        label: 'Label 2'
      },
      {
        value: 'cm:notTagRelated',
        label: 'Label 3'
      },
      {
        value: 'cm:taggable',
        label: 'Label 4'
      }
    ]
  }
];

export const dummyCategoriesConstraints: ActionParameterConstraint[] = [
  {
    name: 'aspect-name',
    constraints: [
      {
        value: 'cm:categories',
        label: 'Label 1'
      },
      {
        value: 'cm:notCategoryRelated',
        label: 'Label 2'
      },
      {
        value: 'cm:generalclassifiable',
        label: 'Label 3'
      }
    ]
  }
];
