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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardViewBoolItemModel, CardViewComponent, CardViewSelectItemModel, CardViewTextItemModel, CoreTestingModule } from '@alfresco/adf-core';
import { RuleActionUiComponent } from './rule-action.ui-component';
import {
  actionLinkToCategoryTransformedMock,
  actionNodeTransformedMock,
  actionsTransformedListMock,
  securityActionTransformedMock
} from '../../mock/actions.mock';
import { By } from '@angular/platform-browser';
import { dummyCategoriesConstraints, dummyConstraints, dummyTagsConstraints } from '../../mock/action-parameter-constraints.mock';
import { securityMarksResponseMock, updateNotificationMock } from '../../mock/security-marks.mock';
import { CategoryService, NodeAction, TagService } from '@alfresco/adf-content-services';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatSelectHarness } from '@angular/material/select/testing';
import { of, Subject } from 'rxjs';

describe('RuleActionUiComponent', () => {
  let fixture: ComponentFixture<RuleActionUiComponent>;
  let component: RuleActionUiComponent;
  let loader: HarnessLoader;

  const changeMatSelectValue = async (value: string) => {
    const matSelect = await loader.getHarness(MatSelectHarness);
    await matSelect.clickOptions({ selector: `[ng-reflect-value="${value}"]` });
    fixture.detectChanges();
  };

  const getPropertiesCardView = (): CardViewComponent => fixture.debugElement.query(By.directive(CardViewComponent)).componentInstance;

  function setInputValue(value: string) {
    const input = fixture.debugElement.query(By.css('input')).nativeElement;
    input.value = value;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreTestingModule, RuleActionUiComponent]
    });

    fixture = TestBed.createComponent(RuleActionUiComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should clear empty parameters', async () => {
    component.actionDefinitions = actionsTransformedListMock;
    component.parameterConstraints = dummyConstraints;
    fixture.detectChanges();

    await changeMatSelectValue('mock-action-1-definition');

    setInputValue('test');
    await fixture.whenStable();

    expect(component.parameters).toEqual({ 'mock-action-parameter-boolean': false, 'mock-action-parameter-text': 'test' });

    setInputValue('');
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
    expect(fixture.debugElement.query(By.directive(CardViewComponent))).toBeNull();
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
    const dialog = fixture.debugElement.injector.get(MatDialog);
    component.actionDefinitions = [actionLinkToCategoryTransformedMock];
    component.parameterConstraints = dummyConstraints;
    spyOn(dialog, 'open');
    fixture.detectChanges();

    await changeMatSelectValue('mock-action-3-definition');
    fixture.debugElement.query(By.css('.adf-textitem-action')).nativeElement.click();

    expect(dialog.open).toHaveBeenCalledTimes(1);
    expect(dialog.open['calls'].argsFor(0)[0].name).toBe('CategorySelectorDialogComponent');
  });

  it('should open node selector dialog with correct parameters', async () => {
    const dialog = fixture.debugElement.injector.get(MatDialog);
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
    fixture.debugElement.query(By.css('.adf-textitem-action')).nativeElement.click();

    expect(dialog.open).toHaveBeenCalledTimes(1);
    expect(dialogSpy.calls.mostRecent().args[1].data).toEqual(expectedData);
    expect(dialog.open['calls'].argsFor(0)[0].name).toBe('ContentNodeSelectorComponent');
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
});
