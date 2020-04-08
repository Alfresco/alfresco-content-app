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
import { AppConfigService } from '../app-config/app-config.service';
import { LogLevelsEnum } from '../models/log-levels.model';
import { Subject } from 'rxjs';
export declare class LogService {
  private appConfig;
  readonly currentLogLevel: LogLevelsEnum;
  onMessage: Subject<any>;
  constructor(appConfig: AppConfigService);
  /**
   * Logs a message at the "ERROR" level.
   * @param message Message to log
   * @param optionalParams Interpolation values for the message in "printf" format
   */
  error(message?: any, ...optionalParams: any[]): void;
  /**
   * Logs a message at the "DEBUG" level.
   * @param message Message to log
   * @param optionalParams Interpolation values for the message in "printf" format
   */
  debug(message?: any, ...optionalParams: any[]): void;
  /**
   * Logs a message at the "INFO" level.
   * @param message Message to log
   * @param optionalParams Interpolation values for the message in "printf" format
   */
  info(message?: any, ...optionalParams: any[]): void;
  /**
   * Logs a message at any level from "TRACE" upwards.
   * @param message Message to log
   * @param optionalParams Interpolation values for the message in "printf" format
   */
  log(message?: any, ...optionalParams: any[]): void;
  /**
   * Logs a message at the "TRACE" level.
   * @param message Message to log
   * @param optionalParams Interpolation values for the message in "printf" format
   */
  trace(message?: any, ...optionalParams: any[]): void;
  /**
   * Logs a message at the "WARN" level.
   * @param message Message to log
   * @param optionalParams Interpolation values for the message in "printf" format
   */
  warn(message?: any, ...optionalParams: any[]): void;
  /**
   * Logs a message if a boolean test fails.
   * @param test Test value (typically a boolean expression)
   * @param message Message to show if test is false
   * @param optionalParams Interpolation values for the message in "printf" format
   */
  assert(test?: boolean, message?: string, ...optionalParams: any[]): void;
  /**
   * Starts an indented group of log messages.
   * @param groupTitle Title shown at the start of the group
   * @param optionalParams Interpolation values for the title in "printf" format
   */
  group(groupTitle?: string, ...optionalParams: any[]): void;
  /**
   * Ends a indented group of log messages.
   */
  groupEnd(): void;
  /**
   * Converts a log level name string into its numeric equivalent.
   * @param level Level name
   * @returns Numeric log level
   */
  getLogLevel(level: string): LogLevelsEnum;
  /**
   * Triggers notification callback for log messages.
   * @param text Message text
   * @param logLevel Log level for the message
   */
  messageBus(text: string, logLevel: string): void;
}
