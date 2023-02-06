/*
 * Copyright © 2005 - 2023 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

const env = process.env;

export const testEmailDomain = env.E2E_EMAIL_DOMAIN;
export const users = {
  superadmin: {
    username: env.SUPERADMIN_EMAIL,
    password: env.SUPERADMIN_PASSWORD
  },
  identity: {
    username: env.IDENTITY_USER_EMAIL,
    password: env.IDENTITY_USER_PASSWORD
  },
  hruser: {
    username: env.HR_USER,
    password: env.HR_USER_PASSWORD
  },
  salesuser: {
    username: env.SALES_USER,
    password: env.SALES_USER_PASSWORD
  },
  admin: {
    username: env.ADMIN_EMAIL,
    password: env.ADMIN_PASSWORD
  },
  contentIdentity: {
    username: env.CONTENT_IDENTITY_USERNAME,
    password: env.CONTENT_IDENTITY_PASSWORD
  }
};
