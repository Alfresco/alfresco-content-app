import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchInputComponent } from './search-input.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatError } from '@angular/material/form-field';
import { By } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { AppTestingModule } from '../../../testing/app-testing.module';
import { SearchInputControlComponent } from '../search-input-control/search-input-control.component';

describe('SearchInputComponent', () => {
  let fixture: ComponentFixture<SearchInputComponent>;
  let component: SearchInputComponent;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppTestingModule, ReactiveFormsModule, SearchInputComponent, SearchInputControlComponent],
      schemas: [NO_ERRORS_SCHEMA]  
    }).compileComponents();

    fixture = TestBed.createComponent(SearchInputComponent);
    component = fixture.componentInstance;

    // (component as any).searchInputControl = mockControl;
    fixture.detectChanges();
  });

  describe('Validation Behavior', () => {
    function getFirstError(): string {
      const error = fixture.debugElement.query(By.directive(MatError));
      return error?.nativeElement.textContent.trim();
    }

    it('should show required error when field is empty and touched', () => {
      component.searchInputControl.searchFieldFormControl.setValue('');
      component.searchInputControl.searchFieldFormControl.markAsTouched();
      fixture.detectChanges();

      const error = getFirstError();
      fixture.detectChanges();
      expect(error).toBe('SEARCH.INPUT.REQUIRED');
    });

    // it('should not show error when field has value', () => {
    //   mockControl.searchFieldFormControl.setValue('test');
    //   mockControl.searchFieldFormControl.markAsTouched();
    //   fixture.detectChanges();

    //   const error = fixture.debugElement.query(By.directive(MatError));
    //   expect(error).toBeNull();
    // });

    // it('should not show error when field is untouched', () => {
    //   mockControl.searchFieldFormControl.setValue('');
    //   mockControl.searchFieldFormControl.markAsUntouched();
    //   fixture.detectChanges();

    //   const error = fixture.debugElement.query(By.directive(MatError));
    //   expect(error).toBeNull();
    // });
  });
});
