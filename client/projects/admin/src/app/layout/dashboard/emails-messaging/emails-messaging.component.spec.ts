import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailsMessagingComponent } from './emails-messaging.component';

describe('EmailsMessagingComponent', () => {
  let component: EmailsMessagingComponent;
  let fixture: ComponentFixture<EmailsMessagingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailsMessagingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailsMessagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
