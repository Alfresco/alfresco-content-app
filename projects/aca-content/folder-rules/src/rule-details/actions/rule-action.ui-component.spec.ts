/*!
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { actionLinkToCategoryTransformedMock, actionsTransformedListMock } from '../../mock/actions.mock';
import { By } from '@angular/platform-browser';
import { dummyCategoriesConstraints, dummyConstraints, dummyTagsConstraints } from '../../mock/action-parameter-constraints.mock';
import { CategoryService, TagService } from '@alfresco/adf-content-services';
import { MatSelect } from '@angular/material/select';

describe('RuleActionUiComponent', () => {
  let fixture: ComponentFixture<RuleActionUiComponent>;
  let component: RuleActionUiComponent;

  const getSelectElement = (): HTMLElement => fixture.debugElement.query(By.directive(MatSelect)).nativeElement;

  const changeMatSelectValue = (value: string) => {
    getSelectElement().click();
    fixture.detectChanges();
    const matOption = fixture.debugElement.query(By.css(`.mat-option[ng-reflect-value="${value}"]`)).nativeElement;
    matOption.click();
    fixture.detectChanges();
  };

  const getPropertiesCardView = (): CardViewComponent => fixture.debugElement.query(By.directive(CardViewComponent)).componentInstance;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreTestingModule, RuleActionUiComponent]
    });

    fixture = TestBed.createComponent(RuleActionUiComponent);
    component = fixture.componentInstance;
  });

  it('should populate the dropdown selector with the action definitions', () => {
    component.actionDefinitions = actionsTransformedListMock;
    fixture.detectChanges();

    getSelectElement().click();
    fixture.detectChanges();

    const matOptions = fixture.debugElement.queryAll(By.css(`mat-option`));
    expect(matOptions.length).toBe(2);
    expect(matOptions[0].nativeElement.innerText).toBe('Action 1 title');
    expect(matOptions[1].nativeElement.innerText).toBe('mock-action-2-definition');
  });

  it('should populate the card view with parameters when an action is selected', () => {
    component.actionDefinitions = actionsTransformedListMock;
    component.parameterConstraints = dummyConstraints;
    fixture.detectChanges();

    const cardView = getPropertiesCardView();
    expect(cardView.properties.length).toBe(0);

    changeMatSelectValue('mock-action-1-definition');

    expect(cardView.properties.length).toBe(5);
    expect(cardView.properties[0]).toBeInstanceOf(CardViewTextItemModel);
    expect(cardView.properties[1]).toBeInstanceOf(CardViewBoolItemModel);
    expect(cardView.properties[2]).toBeInstanceOf(CardViewSelectItemModel);
    expect(cardView.properties[3]).toBeInstanceOf(CardViewTextItemModel);
    expect(cardView.properties[4]).toBeInstanceOf(CardViewSelectItemModel);

    changeMatSelectValue('mock-action-2-definition');
    expect(cardView.properties.length).toBe(0);
  });

  it('should create category-value action parameter as a text box rather than node picker', () => {
    component.actionDefinitions = [actionLinkToCategoryTransformedMock];
    component.parameterConstraints = dummyConstraints;
    fixture.detectChanges();

    const cardView = getPropertiesCardView();
    expect(cardView.properties.length).toBe(0);

    changeMatSelectValue('mock-action-3-definition');

    expect(cardView.properties[0].icon).toBeFalsy();
    expect(cardView.properties[0].value).toBeFalsy();
    expect(cardView.properties[0]).toBeInstanceOf(CardViewTextItemModel);
  });

  describe('Select options', () => {
    beforeEach(() => {
      component.actionDefinitions = actionsTransformedListMock;
    });

    it('should not filter out tags related options if tagService.areTagsEnabled returns true', (done) => {
      component.parameterConstraints = dummyTagsConstraints;
      const tagService = TestBed.inject(TagService);
      spyOn(tagService, 'areTagsEnabled').and.returnValue(true);
      fixture.detectChanges();

      changeMatSelectValue('mock-action-1-definition');
      expect(tagService.areTagsEnabled).toHaveBeenCalled();
      (getPropertiesCardView().properties[2] as CardViewSelectItemModel<string>).options$.subscribe((options) => {
        expect(options).toEqual(
          dummyTagsConstraints[0].constraints.map((constraint) => ({
            key: constraint.value,
            label: `${constraint.label} [${constraint.value}]`
          }))
        );
        done();
      });
    });

    it('should filter out tags related options if tagService.areTagsEnabled returns false', (done) => {
      component.parameterConstraints = dummyTagsConstraints;
      const tagService = TestBed.inject(TagService);
      spyOn(tagService, 'areTagsEnabled').and.returnValue(false);
      fixture.detectChanges();

      changeMatSelectValue('mock-action-1-definition');
      expect(tagService.areTagsEnabled).toHaveBeenCalled();
      (getPropertiesCardView().properties[2] as CardViewSelectItemModel<string>).options$.subscribe((options) => {
        expect(options).toEqual([
          {
            key: 'cm:notTagRelated',
            label: 'Label 3 [cm:notTagRelated]'
          }
        ]);
        done();
      });
    });

    it('should not filter out categories related options if categoryService.areCategoriesEnabled returns true', (done) => {
      component.parameterConstraints = dummyCategoriesConstraints;
      const categoriesService = TestBed.inject(CategoryService);
      spyOn(categoriesService, 'areCategoriesEnabled').and.returnValue(true);
      fixture.detectChanges();

      changeMatSelectValue('mock-action-1-definition');
      expect(categoriesService.areCategoriesEnabled).toHaveBeenCalled();
      (getPropertiesCardView().properties[2] as CardViewSelectItemModel<string>).options$.subscribe((options) => {
        expect(options).toEqual(
          dummyCategoriesConstraints[0].constraints.map((constraint) => ({
            key: constraint.value,
            label: `${constraint.label} [${constraint.value}]`
          }))
        );
        done();
      });
    });

    it('should filter out categories related options if categoryService.areCategoriesEnabled returns false', (done) => {
      component.parameterConstraints = dummyCategoriesConstraints;
      const categoryService = TestBed.inject(CategoryService);
      spyOn(categoryService, 'areCategoriesEnabled').and.returnValue(false);
      fixture.detectChanges();

      changeMatSelectValue('mock-action-1-definition');
      expect(categoryService.areCategoriesEnabled).toHaveBeenCalled();
      (getPropertiesCardView().properties[2] as CardViewSelectItemModel<string>).options$.subscribe((options) => {
        expect(options).toEqual([
          {
            key: 'cm:notCategoryRelated',
            label: 'Label 2 [cm:notCategoryRelated]'
          }
        ]);
        done();
      });
    });
  });
});
