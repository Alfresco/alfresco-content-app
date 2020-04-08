/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
import { Component, Input, ViewEncapsulation, ViewChild } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { BpmUserService } from '../../services/bpm-user.service';
import { EcmUserService } from '../../services/ecm-user.service';
import { IdentityUserService } from '../../services/identity-user.service';
import { of } from 'rxjs';
import { MatMenuTrigger } from '@angular/material';
export class UserInfoComponent {
  /**
   * @param {?} ecmUserService
   * @param {?} bpmUserService
   * @param {?} identityUserService
   * @param {?} authService
   */
  constructor(
    ecmUserService,
    bpmUserService,
    identityUserService,
    authService
  ) {
    this.ecmUserService = ecmUserService;
    this.bpmUserService = bpmUserService;
    this.identityUserService = identityUserService;
    this.authService = authService;
    /**
     * Custom path for the background banner image for ACS users.
     */
    this.ecmBackgroundImage = './assets/images/ecm-background.png';
    /**
     * Custom path for the background banner image for APS users.
     */
    this.bpmBackgroundImage = './assets/images/bpm-background.png';
    /**
     * Custom choice for opening the menu at the bottom. Can be `before` or `after`.
     */
    this.menuPositionX = 'after';
    /**
     * Custom choice for opening the menu at the bottom. Can be `above` or `below`.
     */
    this.menuPositionY = 'below';
    /**
     * Shows/hides the username next to the user info button.
     */
    this.showName = true;
    /**
     * When the username is shown, this defines its position relative to the user info button.
     * Can be `right` or `left`.
     */
    this.namePosition = 'right';
  }
  /**
   * @return {?}
   */
  ngOnInit() {
    this.getUserInfo();
  }
  /**
   * @return {?}
   */
  getUserInfo() {
    if (this.authService.isOauth()) {
      this.loadIdentityUserInfo();
      this.mode = 'SSO';
    } else if (
      this.authService.isEcmLoggedIn() &&
      this.authService.isBpmLoggedIn()
    ) {
      this.loadEcmUserInfo();
      this.loadBpmUserInfo();
      this.mode = 'ALL';
    } else if (this.authService.isEcmLoggedIn()) {
      this.loadEcmUserInfo();
      this.mode = 'CONTENT';
    } else if (this.authService.isBpmLoggedIn()) {
      this.loadBpmUserInfo();
      this.mode = 'PROCESS';
    }
  }
  /**
   * @param {?} event
   * @return {?}
   */
  onKeyPress(event) {
    this.closeUserModal(event);
  }
  /**
   * @private
   * @param {?} $event
   * @return {?}
   */
  closeUserModal($event) {
    if ($event.keyCode === 27) {
      this.trigger.closeMenu();
    }
  }
  /**
   * @return {?}
   */
  get isLoggedIn() {
    return this.authService.isLoggedIn();
  }
  /**
   * @private
   * @return {?}
   */
  loadEcmUserInfo() {
    this.ecmUser$ = this.ecmUserService.getCurrentUserInfo();
  }
  /**
   * @private
   * @return {?}
   */
  loadBpmUserInfo() {
    this.bpmUser$ = this.bpmUserService.getCurrentUserInfo();
  }
  /**
   * @private
   * @return {?}
   */
  loadIdentityUserInfo() {
    this.identityUser$ = of(this.identityUserService.getCurrentUserInfo());
  }
  /**
   * @param {?} event
   * @return {?}
   */
  stopClosing(event) {
    event.stopPropagation();
  }
  /**
   * @param {?} avatarId
   * @return {?}
   */
  getEcmAvatar(avatarId) {
    return this.ecmUserService.getUserProfileImage(avatarId);
  }
  /**
   * @return {?}
   */
  getBpmUserImage() {
    return this.bpmUserService.getCurrentUserProfileImage();
  }
  /**
   * @return {?}
   */
  get showOnRight() {
    return this.namePosition === 'right';
  }
}
UserInfoComponent.decorators = [
  {
    type: Component,
    args: [
      {
        selector: 'adf-userinfo',
        template:
          '<div id="userinfo_container" [class.adf-userinfo-name-right]="showOnRight" (keyup)="onKeyPress($event)"\n     class="adf-userinfo-container" *ngIf="isLoggedIn">\n\n    <ng-container *ngIf="showName">\n        <span *ngIf="identityUser$ | async as identityUser; else showBpmAndEcmUserFullNames"\n              id="adf-userinfo-identity-name-display"\n              class="adf-userinfo-name">{{identityUser | fullName}}</span>\n        <ng-template #showBpmAndEcmUserFullNames>\n            <span *ngIf="ecmUser$ | async as ecmUser; else showBpmUserFullName" id="adf-userinfo-ecm-name-display"\n                  class="adf-userinfo-name">{{ecmUser | fullName}}</span>\n            <ng-template #showBpmUserFullName>\n                <span *ngIf="bpmUser$ | async as bpmUser" id="adf-userinfo-bpm-name-display"\n                      class="adf-userinfo-name">{{bpmUser | fullName}}</span>\n            </ng-template>\n        </ng-template>\n    </ng-container>\n\n    <button mat-button [matMenuTriggerFor]="menu" class="adf-userinfo-menu_button"\n            data-automation-id="adf-user-profile">\n        <div class="adf-userinfo-button-profile" id="user-profile">\n            <div *ngIf="identityUser$ | async as identityUser; else showBpmAndEcmUserImage" id="identity-user-image">\n                <div [outerHTML]="identityUser | usernameInitials:\'adf-userinfo-pic\'"></div>\n            </div>\n            <ng-template #showBpmAndEcmUserImage>\n                <div *ngIf="ecmUser$ | async as ecmUser; else showBpmUserImage" id="ecm-user-image">\n                    <div *ngIf="ecmUser.avatarId; else initialTemplate" class="adf-userinfo-profile-container">\n                        <img id="logged-user-img" [src]="getEcmAvatar(ecmUser.avatarId)" alt="user-info-profile-button"\n                             class="adf-userinfo-profile-image"/>\n                    </div>\n                    <ng-template #initialTemplate>\n                        <div [outerHTML]="ecmUser | usernameInitials:\'adf-userinfo-pic\'"></div>\n                    </ng-template>\n                </div>\n                <ng-template #showBpmUserImage>\n                    <div *ngIf="bpmUser$ | async as bpmUser" id="bpm-user-image">\n                        <div *ngIf="bpmUser.pictureId; else initialTemplate" class="adf-userinfo-profile-container">\n                            <img id="logged-user-img" [src]="getBpmUserImage()" alt="user-info-profile-button"\n                                 class="adf-userinfo-profile-image"/>\n                        </div>\n                        <ng-template #initialTemplate>\n                            <div [outerHTML]="bpmUser | usernameInitials:\'adf-userinfo-pic\'"></div>\n                        </ng-template>\n                    </div>\n                </ng-template>\n            </ng-template>\n        </div>\n    </button>\n    <mat-menu #menu="matMenu" id="user-profile-lists" [xPosition]="menuPositionX" [yPosition]="menuPositionY"\n              [overlapTrigger]="false" class="adf-userinfo-menu">\n        <mat-tab-group id="tab-group-env" (click)="stopClosing($event)" selectedIndex="0"\n                       class="adf-userinfo-tab" [class.adf-hide-tab]="!(bpmUser$ | async) || !(ecmUser$ | async)">\n            <mat-tab id="ecm-panel" label="{{ \'USER_PROFILE.TAB.CS\' | translate }}"\n                *ngIf="mode===\'CONTENT\' || mode===\'ALL\'">\n                <mat-card class="adf-userinfo-card" *ngIf="ecmUser$ | async as ecmUser">\n                    <mat-card-header class="adf-userinfo-card-header"\n                                     [style.background-image]="\'url(\' + ecmBackgroundImage + \')\'">\n                        <div *ngIf="ecmUser.avatarId; else initialTemplate"\n                             class="adf-userinfo-profile-container adf-hide-small">\n                            <img class="adf-userinfo-profile-picture" id="ecm-user-detail-image"\n                                 alt="ecm-profile-image" [src]="getEcmAvatar(ecmUser.avatarId)"/>\n                        </div>\n                        <ng-template #initialTemplate>\n                            <div\n                                [outerHTML]="ecmUser | usernameInitials:\'adf-userinfo-profile-initials adf-hide-small\'"></div>\n                        </ng-template>\n\n                        <div class="adf-userinfo-title" id="ecm-username">{{ecmUser | fullName}}</div>\n                    </mat-card-header>\n                    <mat-card-content>\n                        <div class="adf-userinfo-supporting-text">\n                            <div class="adf-userinfo-detail">\n                                <span id="ecm-full-name"\n                                      class="adf-userinfo__detail-title">{{ecmUser | fullName}}</span>\n                                <span class="adf-userinfo__detail-profile" id="ecm-email"> {{ecmUser.email}} </span>\n                            </div>\n                            <div class="adf-userinfo-detail">\n                                    <span class="adf-userinfo__secondary-info" id="ecm-job-title-label">\n                                        {{ \'USER_PROFILE.LABELS.ECM.JOB_TITLE\' | translate }}\n                                        <span id="ecm-job-title" class="adf-userinfo__detail-profile"> {{ ecmUser.jobTitle ? ecmUser.jobTitle : \'N/A\' }} </span>\n                                    </span>\n                            </div>\n                        </div>\n                    </mat-card-content>\n                </mat-card>\n            </mat-tab>\n            <mat-tab id="bpm-panel" label="{{ \'USER_PROFILE.TAB.PS\' | translate }}"\n                     *ngIf="mode===\'PROCESS\' || mode===\'ALL\'">\n                <mat-card class="adf-userinfo-card" *ngIf="bpmUser$ | async as bpmUser">\n                    <mat-card-header class="adf-userinfo-card-header"\n                                     [style.background-image]="\'url(\' + bpmBackgroundImage + \')\'">\n                        <img *ngIf="bpmUser.pictureId; else initialTemplate"\n                             class="adf-userinfo-profile-picture adf-hide-small" id="bpm-user-detail-image"\n                             alt="bpm-profile-image" [src]="getBpmUserImage()"/>\n                        <ng-template #initialTemplate>\n                            <div\n                                [outerHTML]="bpmUser | usernameInitials:\'adf-userinfo-profile-initials adf-hide-small\'"></div>\n                        </ng-template>\n                        <div class="adf-userinfo-title" id="bpm-username">{{bpmUser | fullName}}</div>\n                    </mat-card-header>\n                    <mat-card-content>\n                        <div class="adf-userinfo-supporting-text">\n                            <div class="adf-userinfo-detail">\n                                <span id="bpm-full-name"\n                                      class="adf-userinfo__detail-title">{{ bpmUser | fullName }}</span>\n                                <span class="adf-userinfo__detail-profile" id="bpm-email"> {{bpmUser.email}} </span>\n                            </div>\n                            <div class="adf-userinfo-detail">\n                                <span id="bpm-tenant" class="adf-userinfo__secondary-info">\n                                    {{ \'USER_PROFILE.LABELS.BPM.TENANT\' | translate }}\n                                    <span class="adf-userinfo__detail-profile">{{ bpmUser.tenantName ? bpmUser.tenantName : \'\' }}</span>\n                                </span>\n                            </div>\n                        </div>\n                    </mat-card-content>\n                </mat-card>\n            </mat-tab>\n            <mat-tab id="identity-panel" *ngIf="mode===\'SSO\'">\n                <mat-card class="adf-userinfo-card" *ngIf="identityUser$ | async as identityUser">\n                    <mat-card-header class="adf-userinfo-card-header"\n                                     [style.background-image]="\'url(\' + bpmBackgroundImage + \')\'">\n                        <div\n                            [outerHTML]="identityUser | usernameInitials:\'adf-userinfo-profile-initials adf-hide-small\'">\n                        </div>\n                        <div class="adf-userinfo-title" id="identity-username">{{identityUser | fullName}}</div>\n                    </mat-card-header>\n                    <mat-card-content>\n                        <div class="adf-userinfo-supporting-text">\n                            <div class="adf-userinfo-detail">\n                                <span id="identity-full-name" class="adf-userinfo__detail-title">{{identityUser | fullName}}</span>\n                                <span class="adf-userinfo__detail-profile"\n                                      id="identity-email"> {{identityUser.email}} </span>\n                            </div>\n                        </div>\n                    </mat-card-content>\n                </mat-card>\n            </mat-tab>\n        </mat-tab-group>\n    </mat-menu>\n</div>\n',
        encapsulation: ViewEncapsulation.None,
        styles: ['']
      }
    ]
  }
];
/** @nocollapse */
UserInfoComponent.ctorParameters = () => [
  { type: EcmUserService },
  { type: BpmUserService },
  { type: IdentityUserService },
  { type: AuthenticationService }
];
UserInfoComponent.propDecorators = {
  trigger: [{ type: ViewChild, args: [MatMenuTrigger] }],
  ecmBackgroundImage: [{ type: Input }],
  bpmBackgroundImage: [{ type: Input }],
  menuPositionX: [{ type: Input }],
  menuPositionY: [{ type: Input }],
  showName: [{ type: Input }],
  namePosition: [{ type: Input }]
};
if (false) {
  /** @type {?} */
  UserInfoComponent.prototype.trigger;
  /**
   * Custom path for the background banner image for ACS users.
   * @type {?}
   */
  UserInfoComponent.prototype.ecmBackgroundImage;
  /**
   * Custom path for the background banner image for APS users.
   * @type {?}
   */
  UserInfoComponent.prototype.bpmBackgroundImage;
  /**
   * Custom choice for opening the menu at the bottom. Can be `before` or `after`.
   * @type {?}
   */
  UserInfoComponent.prototype.menuPositionX;
  /**
   * Custom choice for opening the menu at the bottom. Can be `above` or `below`.
   * @type {?}
   */
  UserInfoComponent.prototype.menuPositionY;
  /**
   * Shows/hides the username next to the user info button.
   * @type {?}
   */
  UserInfoComponent.prototype.showName;
  /**
   * When the username is shown, this defines its position relative to the user info button.
   * Can be `right` or `left`.
   * @type {?}
   */
  UserInfoComponent.prototype.namePosition;
  /** @type {?} */
  UserInfoComponent.prototype.mode;
  /** @type {?} */
  UserInfoComponent.prototype.ecmUser$;
  /** @type {?} */
  UserInfoComponent.prototype.bpmUser$;
  /** @type {?} */
  UserInfoComponent.prototype.identityUser$;
  /** @type {?} */
  UserInfoComponent.prototype.selectedIndex;
  /**
   * @type {?}
   * @private
   */
  UserInfoComponent.prototype.ecmUserService;
  /**
   * @type {?}
   * @private
   */
  UserInfoComponent.prototype.bpmUserService;
  /**
   * @type {?}
   * @private
   */
  UserInfoComponent.prototype.identityUserService;
  /**
   * @type {?}
   * @private
   */
  UserInfoComponent.prototype.authService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci1pbmZvLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hZGYtY29yZS8iLCJzb3VyY2VzIjpbInVzZXJpbmZvL2NvbXBvbmVudHMvdXNlci1pbmZvLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBVSxpQkFBaUIsRUFBRSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDdkYsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sdUNBQXVDLENBQUM7QUFJOUUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLGlDQUFpQyxDQUFDO0FBQ2pFLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQUNqRSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQztBQUMzRSxPQUFPLEVBQUUsRUFBRSxFQUFjLE1BQU0sTUFBTSxDQUFDO0FBQ3RDLE9BQU8sRUFBRSxjQUFjLEVBQWdDLE1BQU0sbUJBQW1CLENBQUM7QUFRakYsTUFBTSxPQUFPLGlCQUFpQjs7Ozs7OztJQXFDMUIsWUFBb0IsY0FBOEIsRUFDOUIsY0FBOEIsRUFDOUIsbUJBQXdDLEVBQ3hDLFdBQWtDO1FBSGxDLG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQUM5QixtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7UUFDOUIsd0JBQW1CLEdBQW5CLG1CQUFtQixDQUFxQjtRQUN4QyxnQkFBVyxHQUFYLFdBQVcsQ0FBdUI7Ozs7UUFsQ3RELHVCQUFrQixHQUFXLG9DQUFvQyxDQUFDOzs7O1FBSWxFLHVCQUFrQixHQUFXLG9DQUFvQyxDQUFDOzs7O1FBSWxFLGtCQUFhLEdBQWtCLE9BQU8sQ0FBQzs7OztRQUl2QyxrQkFBYSxHQUFrQixPQUFPLENBQUM7Ozs7UUFJdkMsYUFBUSxHQUFZLElBQUksQ0FBQzs7Ozs7UUFNekIsaUJBQVksR0FBVyxP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SUFHdkMsMENBQ3VDOzs7OztJQUd2QyxxQ0FDeUI7Ozs7OztJQUt6Qix5Q0FDK0I7O0lBRS9CLGlDQUFhOztJQUViLHFDQUFtQzs7SUFDbkMscUNBQW1DOztJQUNuQywwQ0FBNkM7O0lBQzdDLDBDQUFzQjs7Ozs7SUFFViwyQ0FBc0M7Ozs7O0lBQ3RDLDJDQUFzQzs7Ozs7SUFDdEMsZ0RBQWdEOzs7OztJQUNoRCx3Q0FBMEMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBBbGZyZXNjbyBTb2Z0d2FyZSwgTHRkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBPbkluaXQsIFZpZXdFbmNhcHN1bGF0aW9uLCBWaWV3Q2hpbGQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEF1dGhlbnRpY2F0aW9uU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2F1dGhlbnRpY2F0aW9uLnNlcnZpY2UnO1xuaW1wb3J0IHsgQnBtVXNlck1vZGVsIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2JwbS11c2VyLm1vZGVsJztcbmltcG9ydCB7IEVjbVVzZXJNb2RlbCB9IGZyb20gJy4uLy4uL21vZGVscy9lY20tdXNlci5tb2RlbCc7XG5pbXBvcnQgeyBJZGVudGl0eVVzZXJNb2RlbCB9IGZyb20gJy4uLy4uL21vZGVscy9pZGVudGl0eS11c2VyLm1vZGVsJztcbmltcG9ydCB7IEJwbVVzZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvYnBtLXVzZXIuc2VydmljZSc7XG5pbXBvcnQgeyBFY21Vc2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2VjbS11c2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgSWRlbnRpdHlVc2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2lkZW50aXR5LXVzZXIuc2VydmljZSc7XG5pbXBvcnQgeyBvZiwgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgTWF0TWVudVRyaWdnZXIsIE1lbnVQb3NpdGlvblgsIE1lbnVQb3NpdGlvblkgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbCc7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnYWRmLXVzZXJpbmZvJyxcbiAgICBzdHlsZVVybHM6IFsnLi91c2VyLWluZm8uY29tcG9uZW50LnNjc3MnXSxcbiAgICB0ZW1wbGF0ZVVybDogJy4vdXNlci1pbmZvLmNvbXBvbmVudC5odG1sJyxcbiAgICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lXG59KVxuZXhwb3J0IGNsYXNzIFVzZXJJbmZvQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcblxuICAgIEBWaWV3Q2hpbGQoTWF0TWVudVRyaWdnZXIpIHRyaWdnZXI6IE1hdE1lbnVUcmlnZ2VyO1xuXG4gICAgLyoqIEN1c3RvbSBwYXRoIGZvciB0aGUgYmFja2dyb3VuZCBiYW5uZXIgaW1hZ2UgZm9yIEFDUyB1c2Vycy4gKi9cbiAgICBASW5wdXQoKVxuICAgIGVjbUJhY2tncm91bmRJbWFnZTogc3RyaW5nID0gJy4vYXNzZXRzL2ltYWdlcy9lY20tYmFja2dyb3VuZC5wbmcnO1xuXG4gICAgLyoqIEN1c3RvbSBwYXRoIGZvciB0aGUgYmFja2dyb3VuZCBiYW5uZXIgaW1hZ2UgZm9yIEFQUyB1c2Vycy4gKi9cbiAgICBASW5wdXQoKVxuICAgIGJwbUJhY2tncm91bmRJbWFnZTogc3RyaW5nID0gJy4vYXNzZXRzL2ltYWdlcy9icG0tYmFja2dyb3VuZC5wbmcnO1xuXG4gICAgLyoqIEN1c3RvbSBjaG9pY2UgZm9yIG9wZW5pbmcgdGhlIG1lbnUgYXQgdGhlIGJvdHRvbS4gQ2FuIGJlIGBiZWZvcmVgIG9yIGBhZnRlcmAuICovXG4gICAgQElucHV0KClcbiAgICBtZW51UG9zaXRpb25YOiBNZW51UG9zaXRpb25YID0gJ2FmdGVyJztcblxuICAgIC8qKiBDdXN0b20gY2hvaWNlIGZvciBvcGVuaW5nIHRoZSBtZW51IGF0IHRoZSBib3R0b20uIENhbiBiZSBgYWJvdmVgIG9yIGBiZWxvd2AuICovXG4gICAgQElucHV0KClcbiAgICBtZW51UG9zaXRpb25ZOiBNZW51UG9zaXRpb25ZID0gJ2JlbG93JztcblxuICAgIC8qKiBTaG93cy9oaWRlcyB0aGUgdXNlcm5hbWUgbmV4dCB0byB0aGUgdXNlciBpbmZvIGJ1dHRvbi4gKi9cbiAgICBASW5wdXQoKVxuICAgIHNob3dOYW1lOiBib29sZWFuID0gdHJ1ZTtcblxuICAgIC8qKiBXaGVuIHRoZSB1c2VybmFtZSBpcyBzaG93biwgdGhpcyBkZWZpbmVzIGl0cyBwb3NpdGlvbiByZWxhdGl2ZSB0byB0aGUgdXNlciBpbmZvIGJ1dHRvbi5cbiAgICAgKiBDYW4gYmUgYHJpZ2h0YCBvciBgbGVmdGAuXG4gICAgICovXG4gICAgQElucHV0KClcbiAgICBuYW1lUG9zaXRpb246IHN0cmluZyA9ICdyaWdodCc7XG5cbiAgICBtb2RlOiBzdHJpbmc7XG5cbiAgICBlY21Vc2VyJDogT2JzZXJ2YWJsZTxFY21Vc2VyTW9kZWw+O1xuICAgIGJwbVVzZXIkOiBPYnNlcnZhYmxlPEJwbVVzZXJNb2RlbD47XG4gICAgaWRlbnRpdHlVc2VyJDogT2JzZXJ2YWJsZTxJZGVudGl0eVVzZXJNb2RlbD47XG4gICAgc2VsZWN0ZWRJbmRleDogbnVtYmVyO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBlY21Vc2VyU2VydmljZTogRWNtVXNlclNlcnZpY2UsXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSBicG1Vc2VyU2VydmljZTogQnBtVXNlclNlcnZpY2UsXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSBpZGVudGl0eVVzZXJTZXJ2aWNlOiBJZGVudGl0eVVzZXJTZXJ2aWNlLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgYXV0aFNlcnZpY2U6IEF1dGhlbnRpY2F0aW9uU2VydmljZSkge1xuICAgIH1cblxuICAgIG5nT25Jbml0KCkge1xuICAgICAgICB0aGlzLmdldFVzZXJJbmZvKCk7XG4gICAgfVxuXG4gICAgZ2V0VXNlckluZm8oKSB7XG4gICAgICAgIGlmICh0aGlzLmF1dGhTZXJ2aWNlLmlzT2F1dGgoKSkge1xuICAgICAgICAgICAgdGhpcy5sb2FkSWRlbnRpdHlVc2VySW5mbygpO1xuICAgICAgICAgICAgdGhpcy5tb2RlID0gJ1NTTyc7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5hdXRoU2VydmljZS5pc0VjbUxvZ2dlZEluKCkgJiYgdGhpcy5hdXRoU2VydmljZS5pc0JwbUxvZ2dlZEluKCkpIHtcbiAgICAgICAgICAgIHRoaXMubG9hZEVjbVVzZXJJbmZvKCk7XG4gICAgICAgICAgICB0aGlzLmxvYWRCcG1Vc2VySW5mbygpO1xuICAgICAgICAgICAgdGhpcy5tb2RlID0gJ0FMTCc7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5hdXRoU2VydmljZS5pc0VjbUxvZ2dlZEluKCkpIHtcbiAgICAgICAgICAgIHRoaXMubG9hZEVjbVVzZXJJbmZvKCk7XG4gICAgICAgICAgICB0aGlzLm1vZGUgPSAnQ09OVEVOVCc7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5hdXRoU2VydmljZS5pc0JwbUxvZ2dlZEluKCkpIHtcbiAgICAgICAgICAgIHRoaXMubG9hZEJwbVVzZXJJbmZvKCk7XG4gICAgICAgICAgICB0aGlzLm1vZGUgPSAnUFJPQ0VTUyc7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbktleVByZXNzKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgICAgIHRoaXMuY2xvc2VVc2VyTW9kYWwoZXZlbnQpO1xuICAgIH1cblxuICAgIHByaXZhdGUgY2xvc2VVc2VyTW9kYWwoJGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgICAgIGlmICgkZXZlbnQua2V5Q29kZSA9PT0gMjcpIHtcbiAgICAgICAgICAgIHRoaXMudHJpZ2dlci5jbG9zZU1lbnUoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldCBpc0xvZ2dlZEluKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5hdXRoU2VydmljZS5pc0xvZ2dlZEluKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBsb2FkRWNtVXNlckluZm8oKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZWNtVXNlciQgPSB0aGlzLmVjbVVzZXJTZXJ2aWNlLmdldEN1cnJlbnRVc2VySW5mbygpO1xuICAgIH1cblxuICAgIHByaXZhdGUgbG9hZEJwbVVzZXJJbmZvKCkge1xuICAgICAgICB0aGlzLmJwbVVzZXIkID0gdGhpcy5icG1Vc2VyU2VydmljZS5nZXRDdXJyZW50VXNlckluZm8oKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGxvYWRJZGVudGl0eVVzZXJJbmZvKCkge1xuICAgICAgICB0aGlzLmlkZW50aXR5VXNlciQgPSBvZih0aGlzLmlkZW50aXR5VXNlclNlcnZpY2UuZ2V0Q3VycmVudFVzZXJJbmZvKCkpO1xuICAgIH1cblxuICAgIHN0b3BDbG9zaW5nKGV2ZW50OiBFdmVudCkge1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9XG5cbiAgICBnZXRFY21BdmF0YXIoYXZhdGFySWQ6IGFueSk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmVjbVVzZXJTZXJ2aWNlLmdldFVzZXJQcm9maWxlSW1hZ2UoYXZhdGFySWQpO1xuICAgIH1cblxuICAgIGdldEJwbVVzZXJJbWFnZSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5icG1Vc2VyU2VydmljZS5nZXRDdXJyZW50VXNlclByb2ZpbGVJbWFnZSgpO1xuICAgIH1cblxuICAgIGdldCBzaG93T25SaWdodCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmFtZVBvc2l0aW9uID09PSAncmlnaHQnO1xuICAgIH1cbn1cbiJdfQ==
