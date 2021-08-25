/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2020 Alfresco Software Limited
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

import { Component, Input, OnInit, ViewEncapsulation, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { MinimalNodeEntity } from '@alfresco/js-api';
import { ViewNodeAction, NavigateToFolder } from '@alfresco/aca-shared/store';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Subject } from 'rxjs';
import { AlfrescoApiService } from '@alfresco/adf-core';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'aca-search-results-row',
  templateUrl: './search-results-row.component.html',
  styleUrls: ['./search-results-row.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'aca-search-results-row' }
})
export class SearchResultsRowComponent implements OnInit, OnDestroy {
  private node: MinimalNodeEntity;
  private onDestroy$ = new Subject<boolean>();

  @Input()
  context: any;

  name$ = new BehaviorSubject<string>('');
  title$ = new BehaviorSubject<string>('');

  constructor(private store: Store<any>, private alfrescoApiService: AlfrescoApiService, private router: Router) {}

  ngOnInit() {
    this.updateValues();

    this.alfrescoApiService.nodeUpdated.pipe(takeUntil(this.onDestroy$)).subscribe((node) => {
      const row = this.context.row;
      if (row) {
        const { entry } = row.node;

        if (entry.id === node.id) {
          entry.name = node.name;
          entry.properties = Object.assign({}, node.properties);

          this.updateValues();
        }
      }
    });
  }

  private updateValues() {
    this.node = this.context.row.node;

    const { name, properties } = this.node.entry;
    const title = properties ? properties['cm:title'] : '';

    this.name$.next(name);

    if (title !== name) {
      this.title$.next(title ? `( ${title} )` : '');
    }
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  get isFile(): boolean {
    return this.node.entry.isFile;
  }

  showPreview(event: Event) {
    event.stopPropagation();
    this.store.dispatch(new ViewNodeAction(this.node.entry.id, { location: this.router.url }));
  }

  navigate(event: Event) {
    event.stopPropagation();
    this.store.dispatch(new NavigateToFolder(this.node));
  }
}
