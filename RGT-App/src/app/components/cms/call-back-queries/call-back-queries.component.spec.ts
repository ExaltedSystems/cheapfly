import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallBackQueriesComponent } from './call-back-queries.component';

describe('CallBackQueriesComponent', () => {
  let component: CallBackQueriesComponent;
  let fixture: ComponentFixture<CallBackQueriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallBackQueriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallBackQueriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
