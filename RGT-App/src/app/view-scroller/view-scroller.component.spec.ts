import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewScrollerComponent } from './view-scroller.component';

describe('ViewScrollerComponent', () => {
  let component: ViewScrollerComponent;
  let fixture: ComponentFixture<ViewScrollerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewScrollerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewScrollerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
