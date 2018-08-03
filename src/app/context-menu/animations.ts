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

import {
    state,
    style,
    animate,
    transition,
    query,
    group,
    sequence
} from '@angular/animations';

export const contextMenuAnimation = [
    state('void', style({
        opacity: 0,
        transform: 'scale(0.01, 0.01)'
    })),
    transition('void => *', sequence([
        query('.mat-menu-content', style({ opacity: 0 })),
        animate('100ms linear', style({ opacity: 1, transform: 'scale(1, 0.5)' })),
        group([
            query('.mat-menu-content', animate('400ms cubic-bezier(0.55, 0, 0.55, 0.2)',
                style({ opacity: 1 })
            )),
            animate('300ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({ transform: 'scale(1, 1)' })),
        ])
    ])),
    transition('* => void', animate('150ms 50ms linear', style({ opacity: 0 })))
];
