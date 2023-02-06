/*
 * Copyright © 2005 - 2023 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { StringUtil } from '@alfresco/adf-testing';

const LOWER_CASE_ALPHA = 'helloworld';
export class UserModel {
  firstName?: string = StringUtil.generateRandomCharset(length, LOWER_CASE_ALPHA)(7);
  lastName?: string = StringUtil.generateRandomCharset(length, LOWER_CASE_ALPHA)(7);
  password?: string = StringUtil.generateRandomCharset(length, LOWER_CASE_ALPHA)(7);
  email?: string;
  username?: string;
  idIdentityService?: string;
  type = 'enterprise';
  tenantId?: number;
  company?: string;
  id: number;

  constructor(details: any = {}) {
    const EMAIL_DOMAIN = 'alfresco';
    this.firstName = details.firstName ? details.firstName : this.firstName;
    this.lastName = details.lastName ? details.lastName : this.lastName;

    const USER_IDENTIFY = `${this.firstName}${this.lastName}.${StringUtil.generateRandomCharset(length, LOWER_CASE_ALPHA)(7)}`;

    this.password = details.password ? details.password : this.password;
    this.email = details.email ? details.email : `${USER_IDENTIFY}@${EMAIL_DOMAIN}.com`;
    this.username = details.username ? details.username : USER_IDENTIFY;
    this.idIdentityService = details.idIdentityService ? details.idIdentityService : this.idIdentityService;
    this.type = details.type ? details.type : this.type;
    this.tenantId = details.tenantId ? details.tenantId : this.tenantId;
    this.company = details.company ? details.company : this.company;
    this.id = details.id ? details.id : this.id;
  }

  get fullName() {
    return `${this.firstName ?? ''} ${this.lastName ?? ''}`;
  }
}
