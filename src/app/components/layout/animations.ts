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

import { trigger, transition, animate, style, state } from '@angular/animations';

export const sidenavAnimation = trigger('sidenavAnimation', [
    state('expanded', style({ width: '{{ width }}px' }), { params : { width: 0 } }),
    state('compact',  style({ width: '{{ width }}px' }), { params : { width: 0 } }),
    transition('compact <=> expanded', animate('0.4s cubic-bezier(0.25, 0.8, 0.25, 1)'))
]);

export const contentAnimation = trigger('contentAnimation', [
    state('expanded', style({ 'margin-left': '{{ marginLeft }}px' }), { params : { marginLeft: 0 } }),
    state('compact',  style({'margin-left': '{{ marginLeft }}px' }), { params : { marginLeft: 0 } }),
    transition('expanded <=> compact', animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)'))
]);
