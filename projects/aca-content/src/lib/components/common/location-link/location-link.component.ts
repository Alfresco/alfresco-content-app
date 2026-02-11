/*!
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component, Input, ChangeDetectionStrategy, OnInit, ViewEncapsulation, HostListener, inject } from '@angular/core';
import { PathInfo, NodeEntry } from '@alfresco/js-api';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { NavigateToParentFolder } from '@alfresco/aca-shared/store';
import { ContentApiService } from '@alfresco/aca-shared';
import { DialogComponent, DialogSize, TranslationService } from '@alfresco/adf-core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { NodeLocationReferencesComponent } from '../../../dialogs/node-location-references/node-location-references.component';

@Component({
  imports: [CommonModule, TranslatePipe, MatIcon, MatButtonModule],
  selector: 'aca-location-link',
  templateUrl: './location-link.component.html',
  styleUrls: ['./location-link.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'aca-location-link adf-location-cell adf-datatable-content-cell'
  }
})
export class LocationLinkComponent implements OnInit {
  private store = inject(Store);
  private contentApi = inject(ContentApiService);
  private translationService = inject(TranslationService);
  private _path: PathInfo;

  private readonly dialogRef = inject(MatDialog);

  nodeLocation$ = new BehaviorSubject('');
  displayText: Observable<string>;
  hasPrimaryParentPath = false;

  @Input()
  context: any;

  @Input()
  showLocation = false;

  @HostListener('mouseenter')
  onMouseEnter() {
    this.getTooltip(this._path);
  }

  goToLocation(event: Event) {
    event.preventDefault();
    if (this.context) {
      const node: NodeEntry = this.context.row.node;
      this.store.dispatch(new NavigateToParentFolder(node));
    }
  }

  ngOnInit() {
    if (this.context) {
      const node: NodeEntry = this.context.row.node;
      if (node?.entry?.path) {
        const path = node.entry.path;

        if (path?.name && path?.elements) {
          if (this.showLocation) {
            this.displayText = of(path.name.substring(1).replace(/\//g, ' &#8250; '));
          } else {
            this.displayText = this.getDisplayText(path);
          }
          this._path = path;
          this.hasPrimaryParentPath = true;
        } else {
          this.hasPrimaryParentPath = false;
        }
      }
    }
  }

  openAdditionalLocationReferencesDialog() {
    if (this.context.row.node) {
      this.dialogRef.open(DialogComponent, {
        data: {
          title: 'APP.ADDITIONAL_REFERENCES_DIALOG.TITLE',
          confirmButtonTitle: 'APP.ADDITIONAL_REFERENCES_DIALOG.CLOSE',
          isCancelButtonHidden: true,
          isCloseButtonHidden: false,
          dialogSize: DialogSize.Medium,
          contentComponent: NodeLocationReferencesComponent,
          componentData: this.context.row.node.entry
        },
        width: '600px',
        restoreFocus: true
      });
    }
  }

  // todo: review once 5.2.3 is out
  private getDisplayText(path: PathInfo): Observable<string> {
    const elements = path.elements.map((e) => e.name);

    // for admin users
    if (elements.length === 1 && elements[0] === 'Company Home') {
      return of('APP.BROWSE.PERSONAL.TITLE');
    }

    // for non-admin users
    if (elements.length === 3 && elements[0] === 'Company Home' && elements[1] === 'User Homes') {
      return of('APP.BROWSE.PERSONAL.TITLE');
    }

    const result = elements[elements.length - 1];

    if (result === 'documentLibrary') {
      const fragment = path.elements[path.elements.length - 2];

      return new Observable<string>((observer) => {
        this.contentApi.getNodeInfo(fragment.id).subscribe(
          (node) => {
            observer.next(node.properties['cm:title'] || node.name || fragment.name);
            observer.complete();
          },
          () => {
            observer.next(fragment.name);
            observer.complete();
          }
        );
      });
    }

    return of(result);
  }

  // todo: review once 5.2.3 is out
  private getTooltip(path: PathInfo) {
    if (!path) {
      return;
    }

    let result: string = null;

    const elements = path.elements.map((e) => {
      return { ...e };
    });
    const personalFiles = this.translationService.instant('APP.BROWSE.PERSONAL.TITLE');
    const fileLibraries = this.translationService.instant('APP.BROWSE.LIBRARIES.TITLE');

    if (elements[0].name === 'Company Home') {
      elements[0].name = personalFiles;

      if (elements.length > 2) {
        if (elements[1].name === 'Sites') {
          const fragment = elements[2];
          this.contentApi.getNodeInfo(fragment.id).subscribe(
            (node) => {
              elements.splice(0, 2);
              elements[0].name = node.properties['cm:title'] || node.name || fragment.name;
              elements.splice(1, 1);
              elements.unshift({ id: null, name: fileLibraries });

              result = elements.map((e) => e.name).join('/');
              this.nodeLocation$.next(result);
            },
            () => {
              elements.splice(0, 2);
              elements.unshift({ id: null, name: fileLibraries });
              elements.splice(2, 1);

              result = elements.map((e) => e.name).join('/');
              this.nodeLocation$.next(result);
            }
          );
        }

        if (elements[1].name === 'User Homes') {
          elements.splice(0, 3);
          elements.unshift({ id: null, name: personalFiles });
        }
      }
    }

    result = elements.map((e) => e.name).join('/');
    this.nodeLocation$.next(result);
  }
}
