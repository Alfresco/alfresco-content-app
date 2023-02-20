import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { OpenInAppComponent } from './open-in-app.component';
import { initialState, LibTestingModule } from '../../testing/lib-testing-module';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';

describe('OpenInAppComponent', () => {
  let fixture: ComponentFixture<OpenInAppComponent>;
  let component: OpenInAppComponent;

  const mockDialogRef = {
    close: jasmine.createSpy('close'),
    open: jasmine.createSpy('open')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OpenInAppComponent],
      imports: [LibTestingModule, TranslateModule],
      providers: [
        provideMockStore({ initialState }),
        { provide: MAT_DIALOG_DATA, useValue: { redirectUrl: 'mockRedirectUrl' } },
        { provide: MatDialogRef, useValue: mockDialogRef }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OpenInAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should redirect to app when click on `Open in App` button` ', async () => {
    let currentLocation: string | string[];
    const windowStub: Window & typeof globalThis = {
      location: {
        set href(value: string | string[]) {
          currentLocation = value;
        }
      }
    } as Window & typeof globalThis;
    component.window = windowStub;
    const saveButton = fixture.debugElement.query(By.css('[data-automation-id="open-in-app-button"]')).nativeElement;
    saveButton.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(currentLocation).toBe('mockRedirectUrl');
  });

  it('should set the value `mobile_notification_expires_in` in session storage on dialog close', async () => {
    sessionStorage.clear();
    component.onCloseDialog();
    expect(sessionStorage.getItem('mobile_notification_expires_in')).not.toBeNull();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });
});
