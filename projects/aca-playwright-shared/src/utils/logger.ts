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

/* eslint-disable @typescript-eslint/naming-convention */

export interface LoggerLike {
  info(message: string): void;
  log(message: string): void;
  warn(message: string): void;
  error(message: string): void;
  table(message: object): void;
}

const reset = '\x1b[0m';
const red = '\x1b[31m';
const yellow = '\x1b[33m';
const blue = '\x1b[34m';
const cyan = '\x1b[36m';

export const logger: LoggerLike = {
  // eslint-disable-next-line no-console,no-restricted-syntax
  info: (message: string) => console.info(`${blue}[INFO]${reset}`, message),
  // eslint-disable-next-line no-console,no-restricted-syntax
  log: (message: string) => console.log(`${cyan}[LOG]${reset}`, message),
  // eslint-disable-next-line no-console,no-restricted-syntax
  error: (message: string) => console.error(`${red}[ERROR]${reset}`, message),
  // eslint-disable-next-line no-console,no-restricted-syntax
  warn: (message: string) => console.warn(`${yellow}[WARN]${reset}`, message),
  // eslint-disable-next-line no-console,no-restricted-syntax
  table: (message: object) => console.table(message)
};
