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

import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NodesApiService } from '@alfresco/adf-content-services';
import { DIALOG_COMPONENT_DATA, IconComponent } from '@alfresco/adf-core';
import { Node, NodeAssociation } from '@alfresco/js-api';
import { Router } from '@angular/router';
import { catchError, of, take } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-node-location-references',
  imports: [CommonModule, IconComponent, TranslatePipe],
  templateUrl: './node-location-references.component.html',
  styleUrls: ['./node-location-references.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NodeLocationReferencesComponent implements OnInit {
  node: Node = inject(DIALOG_COMPONENT_DATA);
  additionalReferenceLocations: NodeAssociation[] = [];

  private readonly nodesService = inject(NodesApiService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.nodesService
      .listParents(this.node.id, { where: `(isPrimary=false and assocType='cm:contains')`, include: ['path'] })
      .pipe(
        take(1),
        catchError(() => of({ list: { entries: [] } }))
      )
      .subscribe((response) => {
        this.additionalReferenceLocations = response.list.entries.map((entry) => entry.entry);
      });
  }

  goToLocation($event: Event, node: NodeAssociation) {
    $event.preventDefault();
    let link: string[] = [];
    const { path } = node;

    if (path?.name && path?.elements) {
      const area = path && path.elements.length >= 2 && path.elements[1].name === 'Sites' ? 'libraries' : 'personal-files';
      link = ['#', area, node.id];
      const url = this.router.serializeUrl(this.router.parseUrl(link.join('/')));
      window.open(url, '_blank');
    }
  }
}
