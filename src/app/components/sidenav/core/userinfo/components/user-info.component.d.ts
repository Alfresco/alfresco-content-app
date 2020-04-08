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
import { OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { BpmUserModel } from '../../models/bpm-user.model';
import { EcmUserModel } from '../../models/ecm-user.model';
import { IdentityUserModel } from '../../models/identity-user.model';
import { BpmUserService } from '../../services/bpm-user.service';
import { EcmUserService } from '../../services/ecm-user.service';
import { IdentityUserService } from '../../services/identity-user.service';
import { Observable } from 'rxjs';
import {
  MatMenuTrigger,
  MenuPositionX,
  MenuPositionY
} from '@angular/material';
export declare class UserInfoComponent implements OnInit {
  private ecmUserService;
  private bpmUserService;
  private identityUserService;
  private authService;
  trigger: MatMenuTrigger;
  /** Custom path for the background banner image for ACS users. */
  ecmBackgroundImage: string;
  /** Custom path for the background banner image for APS users. */
  bpmBackgroundImage: string;
  /** Custom choice for opening the menu at the bottom. Can be `before` or `after`. */
  menuPositionX: MenuPositionX;
  /** Custom choice for opening the menu at the bottom. Can be `above` or `below`. */
  menuPositionY: MenuPositionY;
  /** Shows/hides the username next to the user info button. */
  showName: boolean;
  /** When the username is shown, this defines its position relative to the user info button.
   * Can be `right` or `left`.
   */
  namePosition: string;
  mode: string;
  ecmUser$: Observable<EcmUserModel>;
  bpmUser$: Observable<BpmUserModel>;
  identityUser$: Observable<IdentityUserModel>;
  selectedIndex: number;
  constructor(
    ecmUserService: EcmUserService,
    bpmUserService: BpmUserService,
    identityUserService: IdentityUserService,
    authService: AuthenticationService
  );
  ngOnInit(): void;
  getUserInfo(): void;
  onKeyPress(event: KeyboardEvent): void;
  private closeUserModal;
  readonly isLoggedIn: boolean;
  private loadEcmUserInfo;
  private loadBpmUserInfo;
  private loadIdentityUserInfo;
  stopClosing(event: Event): void;
  getEcmAvatar(avatarId: any): string;
  getBpmUserImage(): string;
  readonly showOnRight: boolean;
}
