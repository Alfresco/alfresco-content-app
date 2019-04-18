/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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
  Inject,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  OnDestroy
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog
} from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';
import { Subscription, Observable, throwError } from 'rxjs';
import { SnackbarErrorAction } from '../../../store/actions';
import { AppStore } from '../../../store/states/app.state';
import { Store } from '@ngrx/store';
import {
  skip,
  mergeMap,
  catchError,
  distinctUntilChanged
} from 'rxjs/operators';
import { SharedLinksApiService, NodesApiService } from '@alfresco/adf-core';
import { SharedLinkEntry, MinimalNodeEntryEntity } from '@alfresco/js-api';
import { ConfirmDialogComponent } from '@alfresco/adf-content-services';
import * as moment from 'moment';

@Component({
  selector: 'aca-share-dialog',
  templateUrl: './content-node-share.dialog.html',
  styleUrls: ['./content-node-share.dialog.scss'],
  host: { class: 'adf-share-dialog' },
  encapsulation: ViewEncapsulation.None
})
export class ShareDialogComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  minDate = moment().add(1, 'd');
  sharedId: string;
  fileName: string;
  baseShareUrl: string;
  isFileShared = false;
  isDisabled = false;
  form: FormGroup = new FormGroup({
    sharedUrl: new FormControl(''),
    time: new FormControl({ value: '', disabled: false })
  });

  @ViewChild('matDatetimepickerToggle')
  matDatetimepickerToggle;

  @ViewChild('slideToggleExpirationDate')
  slideToggleExpirationDate;

  @ViewChild('dateTimePickerInput')
  dateTimePickerInput;

  constructor(
    private sharedLinksApiService: SharedLinksApiService,
    private dialogRef: MatDialogRef<ShareDialogComponent>,
    private dialog: MatDialog,
    private nodesApiService: NodesApiService,
    private store: Store<AppStore>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    if (!this.canUpdate) {
      this.form.controls['time'].disable();
    }

    this.subscriptions.push(
      this.form.controls.time.valueChanges
        .pipe(
          skip(1),
          distinctUntilChanged(),
          mergeMap(
            updates => this.updateNode(updates),
            formUpdates => formUpdates
          ),
          catchError(error => {
            return throwError(error);
          })
        )
        .subscribe(updates => {
          this.updateEntryExpiryDate(updates);
        })
    );

    if (this.data.node && this.data.node.entry) {
      this.fileName = this.data.node.entry.name;
      this.baseShareUrl = this.data.baseShareUrl;
      const properties = this.data.node.entry.properties;

      if (!properties || !properties['qshare:sharedId']) {
        this.createSharedLinks(this.data.node.entry.id);
      } else {
        this.sharedId = properties['qshare:sharedId'];
        this.isFileShared = true;

        this.updateForm();
      }
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe);
  }

  onSlideShareChange() {
    this.openConfirmationDialog();
  }

  get canUpdate() {
    return this.data.permission;
  }

  onToggleExpirationDate(slideToggle) {
    if (slideToggle.checked) {
      this.matDatetimepickerToggle.datetimepicker.open();
    } else {
      this.matDatetimepickerToggle.datetimepicker.close();
      this.form.controls.time.setValue(null);
    }
  }

  onDatetimepickerClosed() {
    this.dateTimePickerInput.nativeElement.blur();

    if (!this.form.controls.time.value) {
      this.slideToggleExpirationDate.checked = false;
    }
  }

  private openConfirmationDialog() {
    this.isFileShared = false;

    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          title: 'SHARE.CONFIRMATION.DIALOG-TITLE',
          message: 'SHARE.CONFIRMATION.MESSAGE',
          yesLabel: 'SHARE.CONFIRMATION.REMOVE',
          noLabel: 'SHARE.CONFIRMATION.CANCEL'
        },
        minWidth: '250px',
        closeOnNavigation: true
      })
      .beforeClose()
      .subscribe(deleteSharedLink => {
        if (deleteSharedLink) {
          this.deleteSharedLink(this.sharedId);
        } else {
          this.isFileShared = true;
        }
      });
  }

  private createSharedLinks(nodeId: string) {
    this.isDisabled = true;

    this.sharedLinksApiService.createSharedLinks(nodeId).subscribe(
      (sharedLink: SharedLinkEntry) => {
        if (sharedLink.entry) {
          this.sharedId = sharedLink.entry.id;
          if (this.data.node.entry.properties) {
            this.data.node.entry.properties['qshare:sharedId'] = this.sharedId;
          } else {
            this.data.node.entry.properties = {
              'qshare:sharedId': this.sharedId
            };
          }
          this.isDisabled = false;
          this.isFileShared = true;

          this.updateForm();
        }
      },
      () => {
        this.isDisabled = false;
        this.isFileShared = false;
      }
    );
  }

  private deleteSharedLink(sharedId: string) {
    this.isDisabled = true;

    this.sharedLinksApiService
      .deleteSharedLink(sharedId)
      .subscribe((response: any) => {
        if (response instanceof Error) {
          this.isDisabled = false;
          this.isFileShared = true;
          this.showError(response);
        } else {
          this.data.node.entry.properties['qshare:sharedId'] = null;
          this.data.node.entry.properties['qshare:expiryDate'] = null;
          this.dialogRef.close(this.data.node);
        }
      });
  }

  private updateForm() {
    const { entry } = this.data.node;
    const expiryDate = entry.properties['qshare:expiryDate'];

    this.form.setValue({
      sharedUrl: `${this.baseShareUrl}${this.sharedId}`,
      time: expiryDate ? expiryDate : null
    });
  }

  private updateNode(date: moment.Moment): Observable<MinimalNodeEntryEntity> {
    return this.nodesApiService.updateNode(this.data.node.entry.id, {
      properties: {
        'qshare:expiryDate': date ? date.endOf('day') : null
      }
    });
  }

  private updateEntryExpiryDate(date: moment.Moment) {
    const { properties } = this.data.node.entry;

    properties['qshare:expiryDate'] = date ? date.toDate() : null;
  }

  private showError(response: { message: any }) {
    let message;
    const statusCode = JSON.parse(response.message).error.statusCode;
    if (statusCode === 403) {
      message = 'SHARED_LINK.UNSHARE_PERMISSION_ERROR';
    }

    this.store.dispatch(new SnackbarErrorAction(message));
  }
}
