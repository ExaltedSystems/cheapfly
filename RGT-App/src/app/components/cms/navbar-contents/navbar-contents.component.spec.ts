import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarContentsComponent } from './navbar-contents.component';

describe('NavbarContentsComponent', () => {
  let component: NavbarContentsComponent;
  let fixture: ComponentFixture<NavbarContentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavbarContentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarContentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
