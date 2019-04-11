import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllScrollerComponent } from './view-all-scroller.component';

describe('ViewAllScrollerComponent', () => {
  let component: ViewAllScrollerComponent;
  let fixture: ComponentFixture<ViewAllScrollerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAllScrollerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAllScrollerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
