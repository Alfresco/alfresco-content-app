/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2019 Alfresco Software Limited
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail.  Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

import {
  Directive,
  HostListener,
  Input,
  OnChanges,
  Output,
  EventEmitter
} from '@angular/core';
import { SiteBody, FavoriteBody, FavoriteEntry, Site } from '@alfresco/js-api';
import { AlfrescoApiService } from '@alfresco/adf-core';

interface LibraryEntity {
  entry: Site;
  isLibrary: boolean;
  isFavorite: boolean;
}

@Directive({
  selector: '[acaFavoriteLibrary]',
  exportAs: 'favoriteLibrary'
})
export class LibraryFavoriteDirective implements OnChanges {
  @Input('acaFavoriteLibrary')
  library: any = null;

  @Output() toggle: EventEmitter<any> = new EventEmitter();
  @Output() error: EventEmitter<any> = new EventEmitter();

  private targetLibrary = null;

  @HostListener('click')
  onClick() {
    this.toggleFavorite();
  }

  constructor(private alfrescoApiService: AlfrescoApiService) {}

  ngOnChanges(changes) {
    if (!changes.library.currentValue) {
      this.targetLibrary = null;
      return;
    }

    this.targetLibrary = changes.library.currentValue;
    this.markFavoriteLibrary(changes.library.currentValue);
  }

  isFavorite() {
    return this.targetLibrary && this.targetLibrary.isFavorite;
  }

  toggleFavorite() {
    if (this.targetLibrary.isFavorite) {
      this.removeFavorite(this.targetLibrary.entry.guid);
    } else {
      const favoriteBody = this.createFavoriteBody(this.targetLibrary);
      this.addFavorite(favoriteBody);
    }
  }

  private async markFavoriteLibrary(library: LibraryEntity) {
    if (this.targetLibrary.isFavorite === undefined) {
      await this.getFavoriteSite(library);
    } else {
      this.targetLibrary = library;
    }
  }

  private getFavoriteSite(library: LibraryEntity) {
    this.alfrescoApiService.peopleApi
      .getFavoriteSite('-me-', library.entry.id)
      .then(() => (this.targetLibrary.isFavorite = true))
      .catch(() => (this.targetLibrary.isFavorite = false));
  }

  private createFavoriteBody(library: LibraryEntity): FavoriteBody {
    return {
      target: {
        site: {
          guid: library.entry.guid
        }
      }
    };
  }

  private addFavorite(favoriteBody: FavoriteBody) {
    this.alfrescoApiService.peopleApi
      .addFavorite('-me-', favoriteBody)
      .then((libraryEntry: FavoriteEntry) => {
        this.targetLibrary.isFavorite = true;
        this.toggle.emit(libraryEntry);
      })
      .catch(error => this.error.emit(error));
  }

  private removeFavorite(favoriteId: string) {
    this.alfrescoApiService.favoritesApi
      .removeFavoriteSite('-me-', favoriteId)
      .then((libraryBody: SiteBody) => {
        this.targetLibrary.isFavorite = false;
        this.toggle.emit(libraryBody);
      })
      .catch(error => this.error.emit(error));
  }
}
