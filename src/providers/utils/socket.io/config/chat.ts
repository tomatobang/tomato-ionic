import { Injectable, NgModule } from '@angular/core';
import { Socket } from 'ng-socket-io';
import { chatSocketUrl } from '../../../../config';

@Injectable()
export class ChatSocket extends Socket {
  constructor() {
    super({ url: chatSocketUrl, options: {} });
  }
}
