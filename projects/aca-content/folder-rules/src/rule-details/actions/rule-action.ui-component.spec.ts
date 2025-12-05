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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  CardViewBoolItemModel,
  CardViewComponent,
  CardViewSelectItemModel,
  CardViewTextItemModel,
  NoopTranslateModule,
  UnitTestingUtils
} from '@alfresco/adf-core';
import { RuleActionUiComponent } from './rule-action.ui-component';
import {
  actionLinkToCategoryTransformedMock,
  actionNodeTransformedMock,
  actionsTransformedListMock,
  securityActionTransformedMock
} from '../../mock/actions.mock';
import { dummyCategoriesConstraints, dummyConstraints, dummyTagsConstraints } from '../../mock/action-parameter-constraints.mock';
import { securityMarksResponseMock, updateNotificationMock } from '../../mock/security-marks.mock';
import {
  AlfrescoApiService,
  AlfrescoApiServiceMock,
  CategoryService,
  ContentNodeSelectorComponent,
  NodeAction,
  SecurityControlsService,
  TagService
} from '@alfresco/adf-content-services';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatSelectHarness } from '@angular/material/select/testing';
import { of, Subject } from 'rxjs';
import { Node } from '@alfresco/js-api';
import { SimpleChanges } from '@angular/core';
import { MatError } from '@angular/material/form-field';

describe('RuleActionUiComponent', () => {
  let fixture: ComponentFixture<RuleActionUiComponent>;
  let component: RuleActionUiComponent;
  let loader: HarnessLoader;
  let unitTestingUtils: UnitTestingUtils;
  let securityControlsService: SecurityControlsService;

  const clickActionItem = () => {
    unitTestingUtils.getByCSS('.adf-textitem-action').nativeElement.click();
  };

  const changeMatSelectValue = async (value: string) => {
    const matSelect = await loader.getHarness(MatSelectHarness);
    await matSelect.clickOptions({ selector: `[ng-reflect-value="${value}"]` });
    fixture.detectChanges();
  };

  const getPropertiesCardView = (): CardViewComponent => unitTestingUtils.getByDirective(CardViewComponent).componentInstance;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NoopTranslateModule, RuleActionUiComponent],
      providers: [{ provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock }]
    });

    fixture = TestBed.createComponent(RuleActionUiComponent);
    component = fixture.componentInstance;
    securityControlsService = TestBed.inject(SecurityControlsService);
    loader = TestbedHarnessEnvironment.loader(fixture);
    unitTestingUtils = new UnitTestingUtils(fixture.debugElement, loader);
  });

  it('should not accept empty parameters', async () => {
    component.actionDefinitions = actionsTransformedListMock;
    component.parameterConstraints = dummyConstraints;
    fixture.detectChanges();

    await changeMatSelectValue('mock-action-1-definition');

    await unitTestingUtils.fillMatInput('test');
    await fixture.whenStable();

    expect(component.parameters).toEqual({ 'mock-action-parameter-boolean': false, 'mock-action-parameter-text': 'test' });

    await unitTestingUtils.fillMatInput('');
    await fixture.whenStable();

    expect(component.parameters).toEqual({ 'mock-action-parameter-boolean': false });
  });

  it('should populate the dropdown selector with the action definitions', async () => {
    component.actionDefinitions = actionsTransformedListMock;
    fixture.detectChanges();

    const select = await loader.getHarness(MatSelectHarness);
    await select.open();
    const options = await select.getOptions();
    expect(options.length).toBe(2);
    expect(await options[0].getText()).toBe('Action 1 title');
    expect(await options[1].getText()).toBe('mock-action-2-definition');
  });

  it('should populate the card view with parameters when an action is selected', async () => {
    component.actionDefinitions = actionsTransformedListMock;
    component.parameterConstraints = dummyConstraints;
    fixture.detectChanges();

    await changeMatSelectValue('mock-action-1-definition');

    const cardView = getPropertiesCardView();

    expect(cardView.properties.length).toBe(5);
    expect(cardView.properties[0]).toBeInstanceOf(CardViewTextItemModel);
    expect(cardView.properties[1]).toBeInstanceOf(CardViewBoolItemModel);
    expect(cardView.properties[2]).toBeInstanceOf(CardViewSelectItemModel);
    expect(cardView.properties[3]).toBeInstanceOf(CardViewTextItemModel);
    expect(cardView.properties[4]).toBeInstanceOf(CardViewSelectItemModel);

    await changeMatSelectValue('mock-action-2-definition');
    expect(unitTestingUtils.getByDirective(CardViewComponent)).toBeNull();
  });

  it('should create category-value action parameter as a text box rather than node picker', async () => {
    component.actionDefinitions = [actionLinkToCategoryTransformedMock];
    component.parameterConstraints = dummyConstraints;
    fixture.detectChanges();

    await changeMatSelectValue('mock-action-3-definition');

    const cardView = getPropertiesCardView();

    expect(cardView.properties.length).toBe(1);
    expect(cardView.properties[0].icon).toBe('library_add');
    expect(cardView.properties[0].value).toBeFalsy();
    expect(cardView.properties[0]).toBeInstanceOf(CardViewTextItemModel);
  });

  it('should open category selector dialog on category-value action parameter clicked', async () => {
    const dialog = TestBed.inject(MatDialog);
    component.actionDefinitions = [actionLinkToCategoryTransformedMock];
    component.parameterConstraints = dummyConstraints;
    spyOn(dialog, 'open');
    fixture.detectChanges();

    await changeMatSelectValue('mock-action-3-definition');
    clickActionItem();

    expect(dialog.open).toHaveBeenCalledTimes(1);
    expect(dialog.open['calls'].argsFor(0)[0].name).toBe('CategorySelectorDialogComponent');
  });

  it('should open node selector dialog with correct parameters', async () => {
    const dialog = TestBed.inject(MatDialog);
    component.actionDefinitions = [actionNodeTransformedMock];
    const expectedData = {
      selectionMode: 'single',
      title: 'ACA_FOLDER_RULES.RULE_DETAILS.PLACEHOLDER.CHOOSE_FOLDER',
      actionName: NodeAction.CHOOSE,
      currentFolderId: component.nodeId,
      select: jasmine.any(Subject)
    };
    const dialogSpy = spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of({}) } as MatDialogRef<any>);
    fixture.detectChanges();

    await changeMatSelectValue('mock-action-5-definition');
    clickActionItem();

    expect(dialog.open).toHaveBeenCalledTimes(1);
    expect(dialogSpy.calls.mostRecent().args[1].data).toEqual(expectedData);
    expect(dialog.open['calls'].argsFor(0)[0].name).toBe('ContentNodeSelectorComponent');
  });

  it('should display error when no option is selected', () => {
    component.actionDefinitions = actionsTransformedListMock;

    component.form.controls.actionDefinitionId.markAsTouched();
    fixture.detectChanges();
    expect(unitTestingUtils.getByDirective(MatError).nativeElement.textContent).toBe('ACA_FOLDER_RULES.RULE_DETAILS.ERROR.ACTION_REQUIRED');
  });

  describe('Select options', () => {
    beforeEach(() => {
      component.actionDefinitions = actionsTransformedListMock;
    });

    it('should not filter out tags related options if tagService.areTagsEnabled returns true', async () => {
      component.parameterConstraints = dummyTagsConstraints;
      const tagService = TestBed.inject(TagService);
      spyOn(tagService, 'areTagsEnabled').and.returnValue(true);
      fixture.detectChanges();

      await changeMatSelectValue('mock-action-1-definition');
      expect(tagService.areTagsEnabled).toHaveBeenCalled();
      (getPropertiesCardView().properties[2] as CardViewSelectItemModel<string>).options$.subscribe((options) => {
        expect(options).toEqual(
          dummyTagsConstraints[0].constraints.map((constraint) => ({
            key: constraint.value,
            label: `${constraint.label} [${constraint.value}]`
          }))
        );
      });
    });

    it('should filter out tags related options if tagService.areTagsEnabled returns false', async () => {
      component.parameterConstraints = dummyTagsConstraints;
      const tagService = TestBed.inject(TagService);
      spyOn(tagService, 'areTagsEnabled').and.returnValue(false);
      fixture.detectChanges();

      await changeMatSelectValue('mock-action-1-definition');
      expect(tagService.areTagsEnabled).toHaveBeenCalled();
      (getPropertiesCardView().properties[2] as CardViewSelectItemModel<string>).options$.subscribe((options) => {
        expect(options).toEqual([
          {
            key: 'cm:notTagRelated',
            label: 'Label 3 [cm:notTagRelated]'
          }
        ]);
      });
    });

    it('should not filter out categories related options if categoryService.areCategoriesEnabled returns true', async () => {
      component.parameterConstraints = dummyCategoriesConstraints;
      const categoriesService = TestBed.inject(CategoryService);
      spyOn(categoriesService, 'areCategoriesEnabled').and.returnValue(true);
      fixture.detectChanges();

      await changeMatSelectValue('mock-action-1-definition');
      expect(categoriesService.areCategoriesEnabled).toHaveBeenCalled();
      (getPropertiesCardView().properties[2] as CardViewSelectItemModel<string>).options$.subscribe((options) => {
        expect(options).toEqual(
          dummyCategoriesConstraints[0].constraints.map((constraint) => ({
            key: constraint.value,
            label: `${constraint.label} [${constraint.value}]`
          }))
        );
      });
    });

    it('should filter out categories related options if categoryService.areCategoriesEnabled returns false', async () => {
      component.parameterConstraints = dummyCategoriesConstraints;
      const categoryService = TestBed.inject(CategoryService);
      spyOn(categoryService, 'areCategoriesEnabled').and.returnValue(false);
      fixture.detectChanges();

      await changeMatSelectValue('mock-action-1-definition');
      expect(categoryService.areCategoriesEnabled).toHaveBeenCalled();
      (getPropertiesCardView().properties[2] as CardViewSelectItemModel<string>).options$.subscribe((options) => {
        expect(options).toEqual([
          {
            key: 'cm:notCategoryRelated',
            label: 'Label 2 [cm:notCategoryRelated]'
          }
        ]);
      });
    });

    it('should load security mark options when writeValue is called with securityGroupId parameter', async () => {
      component.actionDefinitions = [securityActionTransformedMock];
      spyOn(securityControlsService, 'getSecurityMark').and.returnValue(Promise.resolve(securityMarksResponseMock));
      fixture.detectChanges();

      await changeMatSelectValue('mock-action-4-definition');

      component.writeValue({
        actionDefinitionId: 'mock-action-4-definition',
        params: { securityGroupId: 'group-1' }
      });

      await fixture.whenStable();

      expect(securityControlsService.getSecurityMark).toHaveBeenCalled();
    });
  });

  describe('Security mark actions', () => {
    beforeEach(async () => {
      component.actionDefinitions = [securityActionTransformedMock];
      await changeMatSelectValue('mock-action-4-definition');
    });

    it('should create dropdown selector for security mark action parameter', () => {
      expect(getPropertiesCardView().properties[1]).toBeInstanceOf(CardViewSelectItemModel);
    });

    it('should load security marks on security group select and remove them on unselect', async () => {
      spyOn(component['securityControlsService'], 'getSecurityMark').and.returnValue(Promise.resolve(securityMarksResponseMock));
      component['cardViewUpdateService'].itemUpdated$.next(updateNotificationMock('group-1'));
      await fixture.whenStable();
      fixture.detectChanges();
      (getPropertiesCardView().properties[1] as CardViewSelectItemModel<string>).options$.subscribe((options) => {
        expect(options).toEqual([
          { key: 'mark-1-id', label: 'mark-1-name [mark-1-id]' },
          { key: 'mark-2-id', label: 'mark-2-name [mark-2-id]' }
        ]);
      });

      component['cardViewUpdateService'].itemUpdated$.next(updateNotificationMock(''));
      await fixture.whenStable();
      fixture.detectChanges();
      (getPropertiesCardView().properties[1] as CardViewSelectItemModel<string>).options$.subscribe((options) => {
        expect(options).toEqual([]);
      });
    });
  });

  describe('ContentNodeSelectorComponent dialog', () => {
    let mockDialogRef: jasmine.SpyObj<MatDialogRef<ContentNodeSelectorComponent, Node[]>>;
    let dialogOpenSpy: jasmine.Spy<
      (component: typeof ContentNodeSelectorComponent, config?: MatDialogConfig) => MatDialogRef<ContentNodeSelectorComponent, Node[]>
    >;

    beforeEach(() => {
      mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
      dialogOpenSpy = spyOn(TestBed.inject(MatDialog), 'open').and.returnValue(mockDialogRef);
      spyOn(TestBed.inject(MatDialog), 'closeAll');
      spyOn(console, 'error');
    });

    it('should open dialog when node selector is clicked', async () => {
      component.actionDefinitions = [actionNodeTransformedMock];
      component.nodeId = 'test-folder-id';
      fixture.detectChanges();

      await changeMatSelectValue('mock-action-5-definition');
      clickActionItem();

      expect(dialogOpenSpy).toHaveBeenCalledWith(ContentNodeSelectorComponent, {
        data: {
          selectionMode: 'single',
          title: 'ACA_FOLDER_RULES.RULE_DETAILS.PLACEHOLDER.CHOOSE_FOLDER',
          actionName: NodeAction.CHOOSE,
          currentFolderId: 'test-folder-id',
          select: jasmine.any(Subject)
        },
        panelClass: 'adf-content-node-selector-dialog',
        width: '630px'
      });
    });

    it('should update component when valid node is selected through dialog', async () => {
      component.actionDefinitions = [actionNodeTransformedMock];
      fixture.detectChanges();

      await changeMatSelectValue('mock-action-5-definition');

      component.parameters = { existingParam: 'value' };

      clickActionItem();

      const dialogData = dialogOpenSpy.calls.mostRecent().args[1].data;
      const selectedNode = { id: 'selected-node-123', name: 'Test Folder' } as Node;
      dialogData.select.next([selectedNode]);

      expect(component.parameters).toEqual({
        existingParam: 'value',
        'aspect-name': 'selected-node-123'
      });
    });

    it('should log error when dialog selection encounters error', async () => {
      component.actionDefinitions = [actionNodeTransformedMock];
      fixture.detectChanges();

      await changeMatSelectValue('mock-action-5-definition');
      clickActionItem();

      const dialogData = dialogOpenSpy.calls.mostRecent().args[1].data;
      const testError = new Error('Selection failed');
      dialogData.select.error(testError);

      expect(console.error).toHaveBeenCalledWith(testError);
    });

    it('should close all dialogs when selection completes', async () => {
      const dialogService = TestBed.inject(MatDialog);
      component.actionDefinitions = [actionNodeTransformedMock];
      fixture.detectChanges();

      await changeMatSelectValue('mock-action-5-definition');
      clickActionItem();

      const dialogData = dialogOpenSpy.calls.mostRecent().args[1].data;
      dialogData.select.complete();

      expect(dialogService.closeAll).toHaveBeenCalled();
    });
  });

  it('should enable form when readOnly changes from true to false', () => {
    component.readOnly = true;
    component.form.disable();

    const changes: SimpleChanges = {
      readOnly: {
        currentValue: false,
        previousValue: true,
        firstChange: false,
        isFirstChange: () => false
      }
    };

    component.ngOnChanges(changes);

    expect(component.readOnly).toBe(false);
    expect(component.form.enabled).toBe(true);
  });

  it('should disable form when readOnly changes from false to true', () => {
    component.readOnly = false;
    component.form.enable();

    const changes: SimpleChanges = {
      readOnly: {
        currentValue: true,
        previousValue: false,
        firstChange: false,
        isFirstChange: () => false
      }
    };

    component.ngOnChanges(changes);

    expect(component.readOnly).toBe(true);
    expect(component.form.disabled).toBe(true);
  });
});
