/*
 * Copyright © 2005 - 2021 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainActionComponent } from './main-action.component';
import { TranslationService, TranslationMock } from '@alfresco/adf-core';
import { AppExtensionService } from '@alfresco/aca-shared';
import { of } from 'rxjs';
import { MainActionModule } from './main-action.module';
import { ACTION_CLICK, ACTION_TITLE } from '../../testing/content-action-ref';
import { AppExtensionServiceMock } from '../../testing/app-extension-service-mock';

describe('MainActionComponent', () => {
    let startProcessButtonComponent: MainActionComponent;
    let fixture: ComponentFixture<MainActionComponent>;
    let appExtensionService: AppExtensionServiceMock;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [
                MainActionModule
            ],
            providers: [
                { provide: TranslationService, useClass: TranslationMock },
                { provide: AppExtensionService, useClass: AppExtensionServiceMock }
            ]
        }).compileComponents();

        appExtensionService = TestBed.inject(AppExtensionService);

        fixture = TestBed.createComponent(MainActionComponent);
        startProcessButtonComponent = fixture.componentInstance;

        fixture.detectChanges();
    });

    it('should display button if main action is configured', () => {
        debugger
        const button = fixture.debugElement.nativeElement.querySelector('.app-main-action-button');
        expect(button).toBeTruthy();
        expect(button.textContent.trim()).toBe(ACTION_TITLE);
    });

    it('should not display button if main action is not configured', () => {
        spyOn(appExtensionService, 'getMainAction').and.returnValue(of(undefined));
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
