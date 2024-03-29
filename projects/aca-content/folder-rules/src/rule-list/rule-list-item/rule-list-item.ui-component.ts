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

import { Component, EventEmitter, HostBinding, Input, Output, ViewEncapsulation } from '@angular/core';
import { Rule } from '../../model/rule.model';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  standalone: true,
  imports: [CommonModule, MatSlideToggleModule],
  selector: 'aca-rule-list-item',
  templateUrl: 'rule-list-item.ui-component.html',
  styleUrls: ['rule-list-item.ui-component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'aca-rule-list-item' }
})
export class RuleListItemUiComponent {
  @Input()
  rule: Rule;
  @Input()
  @HostBinding('class.aca-selected')
  isSelected: boolean;
  @Input()
  showEnabledToggle = false;

  @Output()
  enabledChanged = new EventEmitter<boolean>();

  onToggleClick(isEnabled: boolean, event: Event) {
    event.stopPropagation();
    this.rule.isEnabled = !this.rule.isEnabled;
    this.enabledChanged.emit(isEnabled);
  }
}
