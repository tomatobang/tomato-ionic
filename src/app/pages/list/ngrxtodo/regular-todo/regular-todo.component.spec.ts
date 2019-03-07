import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegularTodoPage } from './regular-todo.page';

describe('RegularTodoPage', () => {
  let component: RegularTodoPage;
  let fixture: ComponentFixture<RegularTodoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegularTodoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegularTodoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
