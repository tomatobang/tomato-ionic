import { Injectable, NgModule } from '@angular/core';
import { Socket } from 'ng-socket-io';
import { tomatoSocketUrl } from '../../../../config';

@Injectable()
export class TomatoSocket extends Socket {
  constructor() {
    super({ url: tomatoSocketUrl, options: {} });
  }
}
