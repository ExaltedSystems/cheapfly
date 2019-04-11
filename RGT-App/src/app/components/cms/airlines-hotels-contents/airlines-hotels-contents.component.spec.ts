import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AirlinesHotelsContentsComponent } from './airlines-hotels-contents.component';

describe('AirlinesHotelsContentsComponent', () => {
  let component: AirlinesHotelsContentsComponent;
  let fixture: ComponentFixture<AirlinesHotelsContentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirlinesHotelsContentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirlinesHotelsContentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
