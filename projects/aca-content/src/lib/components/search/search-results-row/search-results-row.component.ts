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

import { Component, Input, OnInit, ViewEncapsulation, ChangeDetectionStrategy, OnDestroy, inject } from '@angular/core';
import { NodeEntry, SearchEntryHighlight } from '@alfresco/js-api';
import { NavigateToFolder, ViewNodeAction } from '@alfresco/aca-shared/store';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Subject } from 'rxjs';
import { NodesApiService } from '@alfresco/adf-content-services';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AutoDownloadService, AppSettingsService } from '@alfresco/aca-shared';
import { CommonModule } from '@angular/common';
import { LocationLinkComponent } from '../../common/location-link/location-link.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DatatableCellBadgesComponent } from '../../dl-custom-components/datatable-cell-badges/datatable-cell-badges.component';

@Component({
  standalone: true,
  imports: [CommonModule, LocationLinkComponent, MatDialogModule, DatatableCellBadgesComponent],
  selector: 'aca-search-results-row',
  templateUrl: './search-results-row.component.html',
  styleUrls: ['./search-results-row.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'aca-search-results-row' }
})
export class SearchResultsRowComponent implements OnInit, OnDestroy {
  private settings = inject(AppSettingsService);

  private readonly highlightPrefix = "<span class='aca-highlight'>";
  private readonly highlightPostfix = '</span>';

  private node: NodeEntry;
  private onDestroy$ = new Subject<boolean>();

  @Input()
  context: any;

  name$ = new BehaviorSubject<string>('');
  title$ = new BehaviorSubject<string>('');
  description$ = new BehaviorSubject<string>('');
  content$ = new BehaviorSubject<string>('');
  nameStripped = '';
  titleStripped = '';
  descriptionStripped = '';
  contentStripped = '';
  isFile = false;

  constructor(
    private store: Store<any>,
    private nodesApiService: NodesApiService,
    private router: Router,
    private autoDownloadService: AutoDownloadService
  ) {}

  ngOnInit() {
    this.updateValues();

    this.nodesApiService.nodeUpdated.pipe(takeUntil(this.onDestroy$)).subscribe((node) => {
      const row = this.context.row;
      if (row) {
        const { entry } = row.node;

        if (entry.id === node.id) {
          entry.name = node.name;
          entry.properties = { ...node.properties };

          this.updateValues();
        }
      }
    });
  }

  private updateValues() {
    this.node = this.context.row.node;
    this.isFile = this.node.entry.isFile;

    const highlights: SearchEntryHighlight[] = this.node.entry['search']?.['highlight'];
    let name = this.node.entry.name;
    const properties = this.node.entry.properties;
    let title = properties?.['cm:title'] || '';
    let description = properties?.['cm:description'] || '';
    let content = '';

    highlights?.forEach((highlight) => {
      switch (highlight.field) {
        case 'cm:name':
          name = highlight.snippets[0];
          break;
        case 'cm:title':
          title = highlight.snippets[0];
          break;
        case 'cm:description':
          description = highlight.snippets[0];
          break;
        case 'cm:content':
          content = `...${highlight.snippets[0]}...`;
          break;
        default:
          break;
      }
    });
    this.name$.next(name);
    this.description$.next(description);
    this.content$.next(content);

    this.nameStripped = this.stripHighlighting(name);
    this.descriptionStripped = this.stripHighlighting(description);
    this.contentStripped = this.stripHighlighting(content);

    if (title !== name) {
      this.title$.next(title ? ` ( ${title} )` : '');
      this.titleStripped = this.stripHighlighting(title);
    }
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  showPreview(event: Event) {
    event.stopPropagation();

    if (!this.settings.autoDownloadEnabled || !this.autoDownloadService.tryDownload(this.node, this.settings.authDownloadThreshold)) {
      this.store.dispatch(new ViewNodeAction(this.node.entry.id, { location: this.router.url }));
    }
  }

  navigate(event: Event) {
    event.stopPropagation();
    this.store.dispatch(new NavigateToFolder(this.node));
  }

  private stripHighlighting(highlightedContent: string): string {
    return highlightedContent
      ? highlightedContent.replace(new RegExp(this.highlightPrefix, 'g'), '').replace(new RegExp(this.highlightPostfix, 'g'), '')
      : '';
  }
}
