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
  Input,
  ComponentRef,
  OnInit,
  ComponentFactoryResolver,
  ViewChild,
  ViewContainerRef,
  OnDestroy,
  OnChanges
} from '@angular/core';
import { AppExtensionService } from '../../extensions/extension.service';
import { MinimalNodeEntryEntity } from '@alfresco/js-api';

@Component({
  selector: 'app-preview-extension',
  template: `
    <div #content></div>
  `
})
export class PreviewExtensionComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('content', { read: ViewContainerRef })
  content: ViewContainerRef;

  @Input()
  id: string;

  @Input()
  url: string;

  @Input()
  extension: string;

  @Input()
  node: MinimalNodeEntryEntity;

  private componentRef: ComponentRef<any>;

  constructor(
    private extensions: AppExtensionService,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  ngOnInit() {
    if (!this.id) {
      return;
    }

    const componentType = this.extensions.getComponentById(this.id);
    if (componentType) {
      const factory = this.componentFactoryResolver.resolveComponentFactory(
        componentType
      );
      if (factory) {
        this.content.clear();
        this.componentRef = this.content.createComponent(factory, 0);
        this.updateInstance();
      }
    }
  }

  ngOnChanges() {
    this.updateInstance();
  }

  ngOnDestroy() {
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
    }
  }

  private updateInstance() {
    if (this.componentRef && this.componentRef.instance) {
      const instance = this.componentRef.instance;

      instance.node = this.node;
      instance.url = this.url;
      instance.extension = this.extension;
    }
  }
}
