/*
 * Copyright © 2005 - 2021 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainActionsComponent } from './main-action.component';
import { TranslationService, TranslationMock } from '@alfresco/adf-core';
import { AppExtensionService } from '@alfresco/aca-shared';
import { of } from 'rxjs';
import { MainActionsModule } from './main-actions.module';
import { ACTION_CLICK, ACTION_TITLE, getContentActionRef } from '../../testing/app-extension-service.mock';

describe('MainActionsComponent', () => {
    let startProcessButtonComponent: MainActionsComponent;
    let fixture: ComponentFixture<MainActionsComponent>;
    let appExtensionService: AppExtensionService;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [
                MainActionsModule
            ],
            providers: [
                { provide: TranslationService, useClass: TranslationMock },
                AppExtensionService,
            ]
        }).compileComponents();

        appExtensionService = TestBed.inject(AppExtensionService);

        spyOn(appExtensionService, 'getMainActions').and.returnValue(getContentActionRef());

        fixture = TestBed.createComponent(MainActionsComponent);
        startProcessButtonComponent = fixture.componentInstance;

        fixture.detectChanges();
    });

    it('should display button if main action is configured', () => {
        const button = fixture.debugElement.nativeElement.querySelector('.app-main-action-button');
        expect(button).toBeTruthy();
        expect(button.textContent.trim()).toBe(ACTION_TITLE);
    });

    it('should not display button if main action is not configured', () => {
        spyOn(appExtensionService, 'getMainActions').and.returnValue(of([]));
        startProcessButtonComponent.ngOnInit();
        fixture.detectChanges();

        const button = fixture.debugElement.nativeElement.querySelector('.app-main-action-button');
        expect(button).toBeFalsy();
    });

    it('should call extension action', () => {
        const runExtensionActionSpy = spyOn(appExtensionService, 'runActionById');

        const button = fixture.debugElement.nativeElement.querySelector('button');
        button.click();

        expect(runExtensionActionSpy).toHaveBeenCalledWith(ACTION_CLICK);
    });
});
