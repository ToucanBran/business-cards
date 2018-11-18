import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessCardLargeComponent } from './business-card-large.component';

describe('BusinessCardLargeComponent', () => {
  let component: BusinessCardLargeComponent;
  let fixture: ComponentFixture<BusinessCardLargeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessCardLargeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessCardLargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
