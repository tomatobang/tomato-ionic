import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FootprintPage } from './footprint.page';

describe('FootprintPage', () => {
  let component: FootprintPage;
  let fixture: ComponentFixture<FootprintPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FootprintPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FootprintPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
