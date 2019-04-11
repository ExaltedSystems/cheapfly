import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAirlineHotelContentsComponent } from './new-airline-hotel-contents.component';

describe('NewAirlineHotelContentsComponent', () => {
  let component: NewAirlineHotelContentsComponent;
  let fixture: ComponentFixture<NewAirlineHotelContentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewAirlineHotelContentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewAirlineHotelContentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
