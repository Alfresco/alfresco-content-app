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

export type RuleConditionFieldType = 'string' | 'number' | 'date' | 'type' | 'special' | 'mimeType' | 'auto-complete';

export interface RuleConditionField {
  name: string;
  label: string;
  type: RuleConditionFieldType;
}

export const comparatorHiddenForConditionFieldType: string[] = ['special', 'mimeType', 'auto-complete'];

export const ruleConditionFields: RuleConditionField[] = [
  {
    name: 'cm:name',
    label: 'ACA_FOLDER_RULES.RULE_DETAILS.FIELDS.NAME',
    type: 'string'
  },
  {
    name: 'size',
    label: 'ACA_FOLDER_RULES.RULE_DETAILS.FIELDS.SIZE',
    type: 'number'
  },
  {
    name: 'mimetype',
    label: 'ACA_FOLDER_RULES.RULE_DETAILS.FIELDS.MIMETYPE',
    type: 'mimeType'
  },
  {
    name: 'encoding',
    label: 'ACA_FOLDER_RULES.RULE_DETAILS.FIELDS.ENCODING',
    type: 'special'
  },
  {
    name: 'category',
    label: 'ACA_FOLDER_RULES.RULE_DETAILS.FIELDS.HAS_CATEGORY',
    type: 'auto-complete'
  },
  {
    name: 'tag',
    label: 'ACA_FOLDER_RULES.RULE_DETAILS.FIELDS.HAS_TAG',
    type: 'special'
  },
  {
    name: 'aspect',
    label: 'ACA_FOLDER_RULES.RULE_DETAILS.FIELDS.HAS_ASPECT',
    type: 'special'
  }
];
