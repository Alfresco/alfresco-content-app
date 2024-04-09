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

export interface RuleConditionComparator {
  name: string;
  labels: {
    [key: string]: string;
  };
}

export const ruleConditionComparators: RuleConditionComparator[] = [
  {
    name: 'equals',
    labels: {
      string: 'ACA_FOLDER_RULES.RULE_DETAILS.COMPARATORS.EQUALS',
      number: 'ACA_FOLDER_RULES.RULE_DETAILS.COMPARATORS.EQUALS',
      date: 'ACA_FOLDER_RULES.RULE_DETAILS.COMPARATORS.ON',
      special: ''
    }
  },
  {
    name: 'contains',
    labels: {
      string: 'ACA_FOLDER_RULES.RULE_DETAILS.COMPARATORS.CONTAINS'
    }
  },
  {
    name: 'begins',
    labels: {
      string: 'ACA_FOLDER_RULES.RULE_DETAILS.COMPARATORS.STARTS_WITH'
    }
  },
  {
    name: 'ends',
    labels: {
      string: 'ACA_FOLDER_RULES.RULE_DETAILS.COMPARATORS.ENDS_WITH'
    }
  },
  {
    name: 'greater_than',
    labels: {
      number: 'ACA_FOLDER_RULES.RULE_DETAILS.COMPARATORS.GREATER_THAN',
      date: 'ACA_FOLDER_RULES.RULE_DETAILS.COMPARATORS.AFTER'
    }
  },
  {
    name: 'less_than',
    labels: {
      number: 'ACA_FOLDER_RULES.RULE_DETAILS.COMPARATORS.LESS_THAN',
      date: 'ACA_FOLDER_RULES.RULE_DETAILS.COMPARATORS.BEFORE'
    }
  },
  {
    name: 'greater_than_equal',
    labels: {
      number: 'ACA_FOLDER_RULES.RULE_DETAILS.COMPARATORS.GREATER_THAN_OR_EQUAL',
      date: 'ACA_FOLDER_RULES.RULE_DETAILS.COMPARATORS.ON_OR_AFTER'
    }
  },
  {
    name: 'less_than_equal',
    labels: {
      number: 'ACA_FOLDER_RULES.RULE_DETAILS.COMPARATORS.LESS_THAN_OR_EQUAL',
      date: 'ACA_FOLDER_RULES.RULE_DETAILS.COMPARATORS.ON_OR_BEFORE'
    }
  },
  {
    name: 'instance_of',
    labels: {
      type: 'ACA_FOLDER_RULES.RULE_DETAILS.COMPARATORS.INSTANCE_OF'
    }
  }
];
