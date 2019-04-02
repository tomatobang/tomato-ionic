import { EventEmitter, OnInit, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmitService implements OnInit {
  public eventEmit: EventEmitter<any>;
  public qrcodeEmit: EventEmitter<any>;
  private theme: BehaviorSubject<string>;
  private userChange: EventEmitter<any>;

  constructor() {
    console.log('Hello EmitService Provider');
    this.eventEmit = new EventEmitter();
    this.qrcodeEmit = new EventEmitter();
    this.userChange = new EventEmitter();
    this.theme = new BehaviorSubject('light-theme');
  }

  ngOnInit() { }

  setActiveTheme(val) {
    this.theme.next(val);
  }

  getActiveTheme() {
    return this.theme.asObservable();
  }

  setActiveUser(val) {
    this.userChange.next(val);
  }

  getActiveUser() {
    return this.userChange.asObservable();
  }
}
