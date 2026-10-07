/*!
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '@alfresco/adf-core';

export interface PaginationState {
  skipCount: number;
  maxItems: number;
}

const PAGINATION_SEGMENT = '_pagination_';

@Injectable({ providedIn: 'root' })
export class PaginationStateService {
  private readonly authenticationService = inject(AuthenticationService);
  private readonly router = inject(Router);

  private lastContext: string | null = null;

  prepareContext(): void {
    const context = this.getCurrentContext();

    if (this.lastContext === null) {
      this.lastContext = context;
      return;
    }

    if (context !== this.lastContext) {
      this.lastContext = context;
      this.clearAll();
    }
  }

  getPaginationState(key: string): PaginationState | null {
    if (!key) {
      return null;
    }

    const raw = this.read(this.getStorageKey(key));
    if (!raw) {
      return null;
    }

    try {
      const parsed = JSON.parse(raw);
      if (typeof parsed?.skipCount === 'number' && typeof parsed?.maxItems === 'number') {
        return { skipCount: parsed.skipCount, maxItems: parsed.maxItems };
      }
    } catch {
      /* malformed entry, ignore */
    }
    return null;
  }

  setPaginationState(key: string, state: PaginationState): void {
    if (!key) {
      return;
    }

    if (!state?.skipCount) {
      this.resetPaginationState(key);
      return;
    }

    this.write(this.getStorageKey(key), JSON.stringify({ skipCount: state.skipCount, maxItems: state.maxItems }));
  }

  resetPaginationState(key: string): void {
    if (!key) {
      return;
    }
    this.remove(this.getStorageKey(key));
  }

  clearAll(): void {
    const storage = this.getStorage();
    if (!storage) {
      return;
    }

    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < storage.length; i++) {
        const storageKey = storage.key(i);
        if (storageKey?.includes(PAGINATION_SEGMENT)) {
          keysToRemove.push(storageKey);
        }
      }
      keysToRemove.forEach((storageKey) => storage.removeItem(storageKey));
    } catch {
      /* sessionStorage not available */
    }
  }

  private getStorageKey(key: string): string {
    const user = this.authenticationService.getUsername() || 'anonymous';
    return `${user}${PAGINATION_SEGMENT}${key}`;
  }

  private getCurrentContext(): string {
    const path = (this.router.url || '').split('?')[0].split('#')[0];
    const segments = path.split('/').filter((segment) => !!segment);
    if (segments[0] === 'favorite') {
      return segments.slice(0, 2).join('/');
    }
    return segments[0] ?? '';
  }

  private getStorage(): Storage | null {
    try {
      return typeof sessionStorage !== 'undefined' ? sessionStorage : null;
    } catch {
      return null;
    }
  }

  private read(storageKey: string): string | null {
    try {
      return this.getStorage()?.getItem(storageKey) ?? null;
    } catch {
      return null;
    }
  }

  private write(storageKey: string, value: string): void {
    try {
      this.getStorage()?.setItem(storageKey, value);
    } catch {
      /* sessionStorage not available or quota exceeded */
    }
  }

  private remove(storageKey: string): void {
    try {
      this.getStorage()?.removeItem(storageKey);
    } catch {
      /* sessionStorage not available */
    }
  }
}
