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

export interface RuleAction {
  actionDefinitionId: string;
  params?: { [key: string]: unknown };
}

export const isRuleAction = (obj): obj is RuleAction =>
  typeof obj === 'object' && typeof obj.actionDefinitionId === 'string' && (obj.params === undefined || typeof obj.params === 'object');
export const isRuleActions = (obj): obj is RuleAction[] =>
  typeof obj === 'object' && obj instanceof Array && obj.reduce((acc, curr) => acc && isRuleAction(curr), true);

export interface ActionDefinitionTransformed {
  id: string;
  name: string;
  description: string;
  title: string;
  applicableTypes: string[];
  trackStatus: boolean;
  parameterDefinitions: ActionParameterDefinitionTransformed[];
}

export interface ActionParameterDefinitionTransformed {
  name: string;
  type: string;
  multiValued: boolean;
  mandatory: boolean;
  displayLabel: string;
  parameterConstraintName?: string;
}
