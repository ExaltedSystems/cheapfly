import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignCustomPkgComponent } from './design-custom-pkg.component';

describe('DesignCustomPkgComponent', () => {
  let component: DesignCustomPkgComponent;
  let fixture: ComponentFixture<DesignCustomPkgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignCustomPkgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignCustomPkgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
