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

const LOWER_CASE_ALPHA = 'helloworld';

function generateRandomCharset(length: number = 8, charSet: string): string {
  let text = '';

  for (let i = 0; i < length; i++) {
    text += charSet.charAt(Math.floor(Math.random() * charSet.length));
  }

  return text;
}

export class UserModel {
  firstName?: string = generateRandomCharset(7, LOWER_CASE_ALPHA);
  lastName?: string = generateRandomCharset(7, LOWER_CASE_ALPHA);
  password?: string = generateRandomCharset(7, LOWER_CASE_ALPHA);
  email?: string;
  username?: string;
  idIdentityService?: string;
  type = 'enterprise';
  tenantId?: number;
  company?: string;
  id: number;

  constructor(details: any = {}) {
    const EMAIL_DOMAIN = 'alfresco';
    this.firstName = details.firstName ?? this.firstName;
    this.lastName = details.lastName ?? this.lastName;

    const USER_IDENTIFY = `${this.firstName}${this.lastName}.${generateRandomCharset(7, LOWER_CASE_ALPHA)}`;

    this.password = details.password ?? this.password;
    this.email = details.email ?? `${USER_IDENTIFY}@${EMAIL_DOMAIN}.com`;
    this.username = details.username ?? USER_IDENTIFY;
    this.idIdentityService = details.idIdentityService ?? this.idIdentityService;
    this.type = details.type ?? this.type;
    this.tenantId = details.tenantId ?? this.tenantId;
    this.company = details.company ?? this.company;
    this.id = details.id ?? this.id;
  }

  get fullName(): string {
    return `${this.firstName ?? ''} ${this.lastName ?? ''}`;
  }
}
