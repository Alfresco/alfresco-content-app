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

import { TestBed } from '@angular/core/testing';
import { AppTestingModule } from '../../testing/app-testing.module';
import { AppConfigService } from '@alfresco/adf-core';
import { RuleService } from './rule.service';

describe('RuleService', () => {
    let config: AppConfigService;
    let ruleService: RuleService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AppTestingModule]
        });

        config = TestBed.get(AppConfigService);
        config.config['extensions'] = {};

        ruleService = TestBed.get(RuleService);
    });

    beforeEach(() => {
        config.config['extensions'] = {
            core: {
                rules: [
                    {
                        id: 'aca:isFolder',
                        type: 'core.rules/nodes.isFolder'
                    },
                    {
                        id: 'aca:rules/can-edit-folder',
                        type: 'core.rules/every',
                        parameters: [
                            {
                                type: 'rule',
                                value: 'core.rules/nodes.isFolder'
                            },
                            {
                                type: 'rule',
                                value: 'core.rules/nodes.canUpdate'
                            }
                        ]
                    }
                ]
            }
        };

        ruleService.init();
    });

    it('should evaluate simple rule', () => {
        const node = {
            entry: {
                allowableOperations: ['update'],
                isFolder: true
            }
        };

        const context: any = {
            selection: {
                nodes: [node],
                first: node
            }
        };

        const result = ruleService.evaluateRule('aca:isFolder', context);
        expect(result).toBeTruthy();
    });

    it('should evaluate composite rule', () => {
        const node = {
            entry: {
                isFolder: true,
                allowableOperations: ['update']
            }
        };

        const context: any = {
            selection: {
                nodes: [node],
                first: node
            }
        };

        const result = ruleService.evaluateRule(
            'aca:rules/can-edit-folder',
            context
        );
        expect(result).toBeTruthy();
    });
});
