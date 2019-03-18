import { EventEmitter, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export class EmitService implements OnInit {
  public eventEmit: EventEmitter<any>;
  public qrcodeEmit: EventEmitter<any>;
  private theme: BehaviorSubject<string>;

  constructor() {
    console.log('Hello EmitService Provider');
    this.eventEmit = new EventEmitter();
    this.qrcodeEmit = new EventEmitter();
    this.theme = new BehaviorSubject('light-theme');
  }

  ngOnInit() { }

  setActiveTheme(val) {
    this.theme.next(val);
  }

  getActiveTheme() {
    return this.theme.asObservable();
  }
}
