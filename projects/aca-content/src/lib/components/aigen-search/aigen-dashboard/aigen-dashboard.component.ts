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

import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';

export interface InfoData {
  hero: string;
  detail: string;
  source: string;
}

@Component({
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  selector: 'aca-aigen-dashboard',
  templateUrl: './aigen-dashboard.component.html',
  styleUrls: ['./aigen-dashboard.component.css'],
  imports: [CommonModule]
})
export class AigenDashboardComponent implements OnChanges {
  @Input() inputData: InfoData[] | null = null;
  data: InfoData[];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['inputData']) {
      this.data = changes['inputData'].currentValue;
    }
  }

  highlightKeyword(text: string, keyword: string): string {
    if (!keyword) {
      return text;
    }
    const regex = new RegExp(`(${keyword})`, 'gi'); // Create a case-insensitive regex
    return text.replace(regex, '<span class="text-highlight">$1</span>');
  }
}
