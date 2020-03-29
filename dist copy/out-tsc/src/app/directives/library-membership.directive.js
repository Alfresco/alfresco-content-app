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
import * as tslib_1 from 'tslib';
import {
  Directive,
  EventEmitter,
  HostListener,
  Input,
  Output
} from '@angular/core';
import { SiteEntry } from '@alfresco/js-api';
import { AlfrescoApiService } from '@alfresco/adf-core';
import { BehaviorSubject, from } from 'rxjs';
var LibraryMembershipDirective = /** @class */ (function() {
  function LibraryMembershipDirective(alfrescoApiService) {
    this.alfrescoApiService = alfrescoApiService;
    this.targetSite = null;
    this.isJoinRequested = new BehaviorSubject(false);
    /** Site for which to toggle the membership request. */
    this.selection = null;
    this.toggle = new EventEmitter();
    this.error = new EventEmitter();
  }
  LibraryMembershipDirective.prototype.onClick = function() {
    this.toggleMembershipRequest();
  };
  LibraryMembershipDirective.prototype.ngOnChanges = function(changes) {
    if (
      !changes.selection.currentValue ||
      !changes.selection.currentValue.entry
    ) {
      this.targetSite = null;
      return;
    }
    this.targetSite = changes.selection.currentValue.entry;
    this.markMembershipRequest();
  };
  LibraryMembershipDirective.prototype.toggleMembershipRequest = function() {
    var _this = this;
    if (!this.targetSite) {
      return;
    }
    if (this.targetSite.joinRequested) {
      this.cancelJoinRequest().subscribe(
        function() {
          _this.targetSite.joinRequested = false;
          _this.isJoinRequested.next(false);
          var info = {
            updatedEntry: _this.targetSite,
            shouldReload: false,
            i18nKey: 'APP.MESSAGES.INFO.JOIN_CANCELED'
          };
          _this.toggle.emit(info);
        },
        function(error) {
          var errWithMessage = {
            error: error,
            i18nKey: 'APP.MESSAGES.ERRORS.JOIN_CANCEL_FAILED'
          };
          _this.error.emit(errWithMessage);
        }
      );
    }
    if (!this.targetSite.joinRequested) {
      this.joinLibraryRequest().subscribe(
        function(createdMembership) {
          _this.targetSite.joinRequested = true;
          _this.isJoinRequested.next(true);
          if (
            createdMembership.entry &&
            createdMembership.entry.site &&
            createdMembership.entry.site.role
          ) {
            var info = {
              shouldReload: true,
              i18nKey: 'APP.MESSAGES.INFO.JOINED'
            };
            _this.toggle.emit(info);
          } else {
            var info = {
              updatedEntry: _this.targetSite,
              shouldReload: false,
              i18nKey: 'APP.MESSAGES.INFO.JOIN_REQUESTED'
            };
            _this.toggle.emit(info);
          }
        },
        function(error) {
          var errWithMessage = {
            error: error,
            i18nKey: 'APP.MESSAGES.ERRORS.JOIN_REQUEST_FAILED'
          };
          var senderEmailCheck = 'Failed to resolve sender mail address';
          var receiverEmailCheck =
            'All recipients for the mail action were invalid';
          if (error.message) {
            if (error.message.includes(senderEmailCheck)) {
              errWithMessage.i18nKey =
                'APP.MESSAGES.ERRORS.INVALID_SENDER_EMAIL';
            } else if (error.message.includes(receiverEmailCheck)) {
              errWithMessage.i18nKey =
                'APP.MESSAGES.ERRORS.INVALID_RECEIVER_EMAIL';
            }
          }
          _this.error.emit(errWithMessage);
        }
      );
    }
  };
  LibraryMembershipDirective.prototype.markMembershipRequest = function() {
    var _this = this;
    if (!this.targetSite) {
      return;
    }
    this.getMembershipRequest().subscribe(
      function(data) {
        if (data.entry.id === _this.targetSite.id) {
          _this.targetSite.joinRequested = true;
          _this.isJoinRequested.next(true);
        }
      },
      function() {
        _this.targetSite.joinRequested = false;
        _this.isJoinRequested.next(false);
      }
    );
  };
  LibraryMembershipDirective.prototype.joinLibraryRequest = function() {
    var memberBody = {
      id: this.targetSite.id
    };
    return from(
      this.alfrescoApiService.peopleApi.addSiteMembershipRequest(
        '-me-',
        memberBody
      )
    );
  };
  LibraryMembershipDirective.prototype.cancelJoinRequest = function() {
    return from(
      this.alfrescoApiService.peopleApi.removeSiteMembershipRequest(
        '-me-',
        this.targetSite.id
      )
    );
  };
  LibraryMembershipDirective.prototype.getMembershipRequest = function() {
    return from(
      this.alfrescoApiService.peopleApi.getSiteMembershipRequest(
        '-me-',
        this.targetSite.id
      )
    );
  };
  tslib_1.__decorate(
    [
      Input('acaLibraryMembership'),
      tslib_1.__metadata('design:type', SiteEntry)
    ],
    LibraryMembershipDirective.prototype,
    'selection',
    void 0
  );
  tslib_1.__decorate(
    [Output(), tslib_1.__metadata('design:type', EventEmitter)],
    LibraryMembershipDirective.prototype,
    'toggle',
    void 0
  );
  tslib_1.__decorate(
    [Output(), tslib_1.__metadata('design:type', EventEmitter)],
    LibraryMembershipDirective.prototype,
    'error',
    void 0
  );
  tslib_1.__decorate(
    [
      HostListener('click'),
      tslib_1.__metadata('design:type', Function),
      tslib_1.__metadata('design:paramtypes', []),
      tslib_1.__metadata('design:returntype', void 0)
    ],
    LibraryMembershipDirective.prototype,
    'onClick',
    null
  );
  LibraryMembershipDirective = tslib_1.__decorate(
    [
      Directive({
        selector: '[acaLibraryMembership]',
        exportAs: 'libraryMembership'
      }),
      tslib_1.__metadata('design:paramtypes', [AlfrescoApiService])
    ],
    LibraryMembershipDirective
  );
  return LibraryMembershipDirective;
})();
export { LibraryMembershipDirective };
//# sourceMappingURL=library-membership.directive.js.map
