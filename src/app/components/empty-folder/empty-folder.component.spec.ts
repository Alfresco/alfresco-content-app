import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';

import { EmptyFolderComponent } from './empty-folder.component';

describe('EmptyFolderComponent', () => {
    let component: EmptyFolderComponent;
    let fixture: ComponentFixture<EmptyFolderComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                MatIconModule,
                TranslateModule.forRoot()
            ],
            declarations: [
                EmptyFolderComponent
            ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EmptyFolderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
