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

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { InfoData } from '../components/aigen-search/aigen-dashboard/aigen-dashboard.component';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AigenSearchService {
  constructor(private http: HttpClient) {}

  getSearchResults(query: string): Observable<InfoData[]> {
    const res = this.http.get<InfoData[]>(`http://localhost:3000/post`);
    return res.pipe(delay(2000));
    // return this.http.get(`https://api.example.com/search?query=${term}`);
    // const doc = window.location.href;
    const data = new BehaviorSubject<any>({ t: query });
    return data;
  }
}
