/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2019 Alfresco Software Limited
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
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';
import { MinimalNodeEntity } from '@alfresco/js-api';
import { ViewFileAction } from '../../../store/actions';
import { Store } from '@ngrx/store';
import { AppStore } from '../../../store/states/app.state';
import { NavigateToFolder } from '../../../store/actions';

@Component({
  selector: 'aca-search-results-row',
  templateUrl: './search-results-row.component.html',
  styleUrls: ['./search-results-row.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'aca-search-results-row' }
})
export class SearchResultsRowComponent implements OnInit {
  private node: MinimalNodeEntity;

  @Input()
  context: any;

  constructor(private store: Store<AppStore>) {}

  ngOnInit() {
    this.node = this.context.row.node;
  }

  get name() {
    return this.getValue('name');
  }

  get title() {
    return this.getValue('properties["cm:title"]');
  }

  get description() {
    return this.getValue('properties["cm:description"]');
  }

  get modifiedAt() {
    return this.getValue('modifiedAt');
  }

  get size() {
    return this.getValue('content.sizeInBytes');
  }

  get user() {
    return this.getValue('modifiedByUser.displayName');
  }

  get hasDescription() {
    return this.description;
  }

  get hasTitle() {
    return this.title;
  }

  get showTitle() {
    return this.name !== this.title;
  }

  get hasSize() {
    return this.size;
  }

  get isFile() {
    return this.getValue('isFile');
  }

  showPreview() {
    this.store.dispatch(new ViewFileAction(this.node));
  }

  navigate() {
    this.store.dispatch(new NavigateToFolder(this.node));
  }

  private getValue(path) {
    return path
      .replace('["', '.')
      .replace('"]', '')
      .replace('[', '.')
      .replace(']', '')
      .split('.')
      .reduce((acc, part) => (acc ? acc[part] : null), this.node.entry);
  }
}
