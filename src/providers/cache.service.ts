import { Injectable } from '@angular/core';
import { GlobalService } from './global.service';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class CacheService {

  constructor(public global: GlobalService) {}

  private _clone(object: any) {
    if (object) {
      return JSON.parse(JSON.stringify(object));
    } else {
      return null;
    }
  }
}
