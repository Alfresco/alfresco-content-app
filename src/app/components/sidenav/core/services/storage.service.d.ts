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
export declare class StorageService {
  private memoryStore;
  private readonly useLocalStorage;
  private _prefix;
  prefix: string;
  constructor();
  /**
   * Gets an item.
   * @param key Key to identify the item
   * @returns The item (if any) retrieved by the key
   */
  getItem(key: string): string | null;
  /**
   * Stores an item
   * @param key Key to identify the item
   * @param data Data to store
   */
  setItem(key: string, data: string): void;
  /** Removes all currently stored items. */
  clear(): void;
  /**
   * Removes a single item.
   * @param key Key to identify the item
   */
  removeItem(key: string): void;
  /**
   * Is any item currently stored under `key`?
   * @param key Key identifying item to check
   * @returns True if key retrieves an item, false otherwise
   */
  hasItem(key: string): boolean;
  private storageAvailable;
}
