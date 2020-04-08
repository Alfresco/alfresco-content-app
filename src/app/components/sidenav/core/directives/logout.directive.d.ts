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
import { ElementRef, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
export declare class LogoutDirective implements OnInit {
  private elementRef;
  private renderer;
  private router;
  private auth;
  /** URI to redirect to after logging out. */
  redirectUri: string;
  /** Enable redirecting after logout */
  enableRedirect: boolean;
  constructor(
    elementRef: ElementRef,
    renderer: Renderer2,
    router: Router,
    auth: AuthenticationService
  );
  ngOnInit(): void;
  logout(): void;
  redirectToUri(): void;
}
