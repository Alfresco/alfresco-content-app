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

import { Directive, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { SiteEntry, SiteMembershipRequestBody, SiteMemberEntry, SiteMembershipRequestEntry } from '@alfresco/js-api';
import { AlfrescoApiService, SitesService, VersionCompatibilityService } from '@alfresco/adf-core';
import { BehaviorSubject, from, Observable } from 'rxjs';

export interface LibraryMembershipToggleEvent {
  updatedEntry?: any;
  shouldReload: boolean;
  i18nKey: string;
}

export interface LibraryMembershipErrorEvent {
  error: any;
  i18nKey: string;
}

@Directive({
  selector: '[acaLibraryMembership]',
  exportAs: 'libraryMembership'
})
export class LibraryMembershipDirective implements OnChanges {
  targetSite: any = null;

  isJoinRequested: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /** Site for which to toggle the membership request. */
  @Input('acaLibraryMembership')
  selection: SiteEntry = null;

  /** Site for which to toggle the membership request. */
  @Input()
  isAdmin = false;

  @Output()
  toggle = new EventEmitter<LibraryMembershipToggleEvent>();

  // tslint:disable-next-line: no-output-native
  @Output()
  error = new EventEmitter<LibraryMembershipErrorEvent>();

  @HostListener('click')
  onClick() {
    this.toggleMembershipRequest();
  }

  constructor(
    private alfrescoApiService: AlfrescoApiService,
    private sitesService: SitesService,
    private versionCompatibilityService: VersionCompatibilityService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.selection.currentValue || !changes.selection.currentValue.entry) {
      this.targetSite = null;

      return;
    }
    this.targetSite = changes.selection.currentValue.entry;
    this.markMembershipRequest();
  }

  toggleMembershipRequest() {
    if (!this.targetSite) {
      return;
    }

    if (this.targetSite.joinRequested) {
      this.cancelJoinRequest().subscribe(
        () => {
          this.targetSite.joinRequested = false;
          this.isJoinRequested.next(false);
          const info = {
            updatedEntry: this.targetSite,
            shouldReload: false,
            i18nKey: 'APP.MESSAGES.INFO.JOIN_CANCELED'
          };
          this.toggle.emit(info);
        },
        (error) => {
          const errWithMessage = {
            error,
            i18nKey: 'APP.MESSAGES.ERRORS.JOIN_CANCEL_FAILED'
          };
          this.error.emit(errWithMessage);
        }
      );
    }

    if (!this.targetSite.joinRequested && !this.isAdmin) {
      this.joinLibraryRequest().subscribe(
        (createdMembership) => {
          this.targetSite.joinRequested = true;
          this.isJoinRequested.next(true);

          if (createdMembership.entry && createdMembership.entry.site && createdMembership.entry.site.role) {
            const info = {
              shouldReload: true,
              i18nKey: 'APP.MESSAGES.INFO.JOINED'
            };
            this.toggle.emit(info);
          } else {
            const info = {
              updatedEntry: this.targetSite,
              shouldReload: false,
              i18nKey: 'APP.MESSAGES.INFO.JOIN_REQUESTED'
            };
            this.toggle.emit(info);
          }
        },
        (error) => {
          const errWithMessage = {
            error,
            i18nKey: 'APP.MESSAGES.ERRORS.JOIN_REQUEST_FAILED'
          };

          const senderEmailCheck = 'Failed to resolve sender mail address';
          const receiverEmailCheck = 'All recipients for the mail action were invalid';

          if (error.message) {
            if (error.message.includes(senderEmailCheck)) {
              errWithMessage.i18nKey = 'APP.MESSAGES.ERRORS.INVALID_SENDER_EMAIL';
            } else if (error.message.includes(receiverEmailCheck)) {
              errWithMessage.i18nKey = 'APP.MESSAGES.ERRORS.INVALID_RECEIVER_EMAIL';
            }
          }

          this.error.emit(errWithMessage);
        }
      );
    }

    if (this.isAdmin) {
      this.joinLibrary().subscribe(
        (createdMembership: SiteMemberEntry) => {
          if (createdMembership.entry && createdMembership.entry.role) {
            const info = {
              shouldReload: true,
              i18nKey: 'APP.MESSAGES.INFO.JOINED'
            };
            this.toggle.emit(info);
          }
        },
        (error) => {
          const errWithMessage = {
            error,
            i18nKey: 'APP.MESSAGES.ERRORS.JOIN_REQUEST_FAILED'
          };

          const senderEmailCheck = 'Failed to resolve sender mail address';
          const receiverEmailCheck = 'All recipients for the mail action were invalid';

          if (error.message) {
            if (error.message.includes(senderEmailCheck)) {
              errWithMessage.i18nKey = 'APP.MESSAGES.ERRORS.INVALID_SENDER_EMAIL';
            } else if (error.message.includes(receiverEmailCheck)) {
              errWithMessage.i18nKey = 'APP.MESSAGES.ERRORS.INVALID_RECEIVER_EMAIL';
            }
          }

          this.error.emit(errWithMessage);
        }
      );
    }
  }

  markMembershipRequest() {
    if (!this.targetSite) {
      return;
    }

    this.getMembershipRequest().subscribe(
      (data) => {
        if (data.entry.id === this.targetSite.id) {
          this.targetSite.joinRequested = true;
          this.isJoinRequested.next(true);
        }
      },
      () => {
        this.targetSite.joinRequested = false;
        this.isJoinRequested.next(false);
      }
    );
  }

  private joinLibraryRequest(): Observable<SiteMembershipRequestEntry> {
    const memberBody = {
      id: this.targetSite.id
    } as SiteMembershipRequestBody;

    if (this.versionCompatibilityService.isVersionSupported('7.0.0')) {
      memberBody.client = 'workspace';
    }
    return from(this.alfrescoApiService.peopleApi.addSiteMembershipRequest('-me-', memberBody));
  }

  private joinLibrary() {
    return this.sitesService.createSiteMembership(this.targetSite.id, {
      role: 'SiteConsumer',
      id: '-me-'
    });
  }

  private cancelJoinRequest() {
    return from(this.alfrescoApiService.peopleApi.removeSiteMembershipRequest('-me-', this.targetSite.id));
  }

  private getMembershipRequest() {
    return from(this.alfrescoApiService.peopleApi.getSiteMembershipRequest('-me-', this.targetSite.id));
  }
}
