/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2018 Alfresco Software Limited
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

import { Directive, OnInit, Input, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MatExpansionPanel } from '@angular/material/expansion';

@Directive({
  selector: '[acaExpansionPanel]',
  exportAs: 'acaExpansionPanel'
})
export class AcaExpansionPanelDirective implements OnInit {
  @Input() acaExpansionPanel;

  selected = false;

  @HostListener('click')
  onClick() {
    if (this.expansionPanel.expanded && !this.selected) {
      this.router.navigate([this.acaExpansionPanel.children[0].url]);
    }
  }

  constructor(
    private router: Router,
    private expansionPanel: MatExpansionPanel
  ) {}

  ngOnInit() {
    this.setSelected(this.router.url);

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.setSelected(event.urlAfterRedirects);
      });
  }

  private setSelected(url) {
    this.selected = this.acaExpansionPanel.children.some(child =>
      url.startsWith(child.url)
    );
  }
}
