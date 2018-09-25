/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import { MinimalNodeEntryEntity } from 'alfresco-js-api';
import { Observable, Subscription } from 'rxjs';
import {
  CardViewItem,
  NodesApiService,
  LogService,
  CardViewUpdateService,
  AlfrescoApiService,
  AppConfigService,
  NotificationService
} from '@alfresco/adf-core';
import { switchMap } from 'rxjs/operators';
import { ContentMetadataService } from '@alfresco/adf-content-services';
import { CardViewGroup } from '@alfresco/adf-content-services/content-metadata/interfaces/card-view-group.interface';
import { AppExtensionService } from '../../../../extensions/extension.service';

@Component({
  selector: 'app-content-metadata',
  templateUrl: './content-metadata.component.html',
  styleUrls: ['./content-metadata.component.scss'],
  host: { class: 'app-content-metadata' },
  encapsulation: ViewEncapsulation.None
})
export class ContentMetadataComponent implements OnChanges, OnInit, OnDestroy {
  /** (required) The node entity to fetch metadata about */
  @Input()
  node: MinimalNodeEntryEntity;

  /** Toggles whether the edit button should be shown */
  @Input()
  editable = false;

  /** Toggles whether to display empty values in the card view */
  @Input()
  displayEmpty = false;

  /** Toggles between expanded (ie, full information) and collapsed
   * (ie, reduced information) in the display
   */
  @Input()
  expanded = false;

  /** The multi parameter of the underlying material expansion panel, set to true to allow multi accordion to be expanded at the same time */
  @Input()
  multi = false;

  /** Name of the metadata preset, which defines aspects and their properties */
  @Input()
  preset: string;

  /** Toggles whether the metadata properties should be shown */
  @Input()
  displayDefaultProperties = true;

  basicProperties$: Observable<CardViewItem[]>;
  groupedProperties$: Observable<CardViewGroup[]>;
  disposableNodeUpdate: Subscription;
  contentMetadataExtension: any;

  constructor(
    private contentMetadataService: ContentMetadataService,
    private cardViewUpdateService: CardViewUpdateService,
    private nodesApiService: NodesApiService,
    private logService: LogService,
    private alfrescoApiService: AlfrescoApiService,
    protected extensions: AppExtensionService,
    private appConfig: AppConfigService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.disposableNodeUpdate = this.cardViewUpdateService.itemUpdated$
      .pipe(switchMap(this.saveNode.bind(this)))
      .subscribe(
        updatedNode => {
          Object.assign(this.node, updatedNode);
          this.alfrescoApiService.nodeUpdated.next(this.node);
        },
        error => this.logService.error(error)
      );

    this.loadProperties(this.node);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.node && !changes.node.firstChange) {
      this.loadProperties(changes.node.currentValue);
    }
  }

  private loadProperties(node: MinimalNodeEntryEntity) {
    this.contentMetadataExtension = this.extensions.contentMetadata;
    if (node) {
      this.basicProperties$ = this.contentMetadataService.getBasicProperties(
        node
      );

      if (this.contentMetadataExtension) {
        try {
          this.appConfig.config[
            'content-metadata'
          ] = this.contentMetadataExtension;
        } catch (error) {
          this.notificationService.openSnackMessage(
            'Wrong metadata configuration',
            4000
          );
        }
      }

      this.groupedProperties$ = this.contentMetadataService.getGroupedProperties(
        node,
        this.preset
      );
    }
  }

  private saveNode({ changed: nodeBody }): Observable<MinimalNodeEntryEntity> {
    return this.nodesApiService.updateNode(this.node.id, nodeBody);
  }

  ngOnDestroy() {
    this.disposableNodeUpdate.unsubscribe();
  }
}
