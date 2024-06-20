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

import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimationOptions, LottieModule } from 'ngx-lottie';
import { AnimationItem } from 'lottie-web';
import { ContentActionRef } from '@alfresco/adf-extensions';
import { Store } from '@ngrx/store';
import { getAppSelection } from '@alfresco/aca-shared/store';
import { NotificationService } from '@alfresco/adf-core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  standalone: true,
  imports: [CommonModule, LottieModule],
  selector: 'aca-search-icon',
  templateUrl: './search-icon.component.html',
  styleUrls: ['./search-icon.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'aca-search-icon' }
})
export class SearchIconComponent implements OnInit, OnDestroy {
  @Input()
  data: { path: string; trigger: string };

  @Input()
  actionRef: ContentActionRef;

  options: AnimationOptions = {
    loop: true,
    autoplay: false
  };

  animationItem: AnimationItem | undefined;
  destroyed$ = new Subject<void>();

  constructor(private readonly store: Store, private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.options = { ...this.options, path: this.data.path };
    this.store
      .select(getAppSelection)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((selection) => {
        if (selection.count > 1) {
          this.notificationService.showInfo('Hiding Knowledge Retrieval icon. If you want to use it, please select no more than 100 files.');
        }
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  onAnimate(animationItem: AnimationItem): void {
    this.animationItem = animationItem;
  }

  onClick(): void {
    this.store.dispatch({ type: this.data.trigger });
  }

  onMouseEnter(): void {
    this.animationItem.play();
  }

  onMouseLeave(): void {
    this.animationItem.stop();
  }
}
