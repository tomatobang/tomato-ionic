import { Component } from '@angular/core';

import { NavController, IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-message',
  templateUrl: 'message.html'
})
export class MessagePage {
  toUser: Object;
  showType = "msg";

  constructor(public navCtrl: NavController) {
    this.toUser = {
      toUserId: '210000198410281948',
      toUserName: 'Hancock'
    }
  }

  toChatPage() {
    console.log("setting!")
    this.navCtrl.push("Chat", this.toUser, {}, () => { });
  }

}
