import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetPage } from './asset.page';

describe('AssetPage', () => {
  let component: AssetPage;
  let fixture: ComponentFixture<AssetPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
