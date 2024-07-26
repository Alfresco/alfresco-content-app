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

/* eslint-disable @typescript-eslint/naming-convention */

export const infoColor = '\x1b[36m%s\x1b[0m';
export const logColor = '\x1b[35m%s\x1b[0m';
export const warnColor = '\x1b[33m%s\x1b[0m';
export const errorColor = '\x1b[31m%s\x1b[0m';

export type LOG_LEVEL = 'TRACE' | 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'SILENT';

export class LogLevelsEnum extends Number {
  public static readonly TRACE: number = 5;
  public static readonly DEBUG: number = 4;
  public static readonly INFO: number = 3;
  public static readonly WARN: number = 2;
  public static readonly ERROR: number = 1;
  public static readonly SILENT: number = 0;
}

export const logLevels: { level: LogLevelsEnum; name: LOG_LEVEL }[] = [
  { level: LogLevelsEnum.TRACE, name: 'TRACE' },
  { level: LogLevelsEnum.DEBUG, name: 'DEBUG' },
  { level: LogLevelsEnum.INFO, name: 'INFO' },
  { level: LogLevelsEnum.WARN, name: 'WARN' },
  { level: LogLevelsEnum.ERROR, name: 'ERROR' },
  { level: LogLevelsEnum.SILENT, name: 'SILENT' }
];

export interface LoggerLike {
  info(...messages: string[]): void;
  log(...messages: string[]): void;
  warn(...messages: string[]): void;
  error(...messages: string[]): void;
}

/* eslint-disable no-console */
export class GenericLogger implements LoggerLike {
  private readonly level: LogLevelsEnum;

  constructor(logLevel: string) {
    this.level = logLevels.find(({ name }) => name === logLevel)?.level || LogLevelsEnum.ERROR;
  }

  info(...messages: string[]): void {
    if (Number(this.level) >= LogLevelsEnum.INFO) {
      console.log(infoColor, messages.join(''));
    }
  }

  log(...messages: string[]): void {
    if (Number(this.level) >= LogLevelsEnum.TRACE) {
      console.log(logColor, messages.join(''));
    }
  }

  warn(...messages: string[]): void {
    if (Number(this.level) >= LogLevelsEnum.WARN) {
      console.log(warnColor, messages.join(''));
    }
  }

  error(...messages: string[]): void {
    console.log(errorColor, messages.join(''));
  }
}
