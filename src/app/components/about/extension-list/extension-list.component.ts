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
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';
import { ExtensionRef } from '@alfresco/adf-extensions';

@Component({
  selector: 'app-extension-list',
  templateUrl: './extension-list.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExtensionListComponent {
  columns = [
    {
      columnDef: 'id',
      header: 'APP.ABOUT.PLUGINS.ID',
      cell: (row: ExtensionRef) => `${row.$id}`
    },
    {
      columnDef: 'name',
      header: 'APP.ABOUT.PLUGINS.NAME',
      cell: (row: ExtensionRef) => `${row.$name}`
    },
    {
      columnDef: 'version',
      header: 'APP.ABOUT.PLUGINS.VERSION',
      cell: (row: ExtensionRef) => `${row.$version}`
    },
    {
      columnDef: 'vendor',
      header: 'APP.ABOUT.PLUGINS.VENDOR',
      cell: (row: ExtensionRef) => `${row.$vendor}`
    },
    {
      columnDef: 'license',
      header: 'APP.ABOUT.PLUGINS.LICENSE',
      cell: (row: ExtensionRef) => `${row.$license}`
    },
    {
      columnDef: 'runtime',
      header: 'APP.ABOUT.PLUGINS.RUNTIME',
      cell: (row: ExtensionRef) => `${row.$runtime}`
    }
  ];

  displayedColumns = this.columns.map(x => x.columnDef);

  @Input()
  data: Array<ExtensionRef> = [];
}
