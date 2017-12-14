import { Component } from '@angular/core';

import { NavController, IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-friend',
  templateUrl: 'friend.html'
})
export class FriendPage {
  showType = "hot";
  page_title = "动态";

  constructor(public navCtrl: NavController) {
  }

  
  toMessagePage() {
    console.log("setting!")
    this.navCtrl.push("MessagePage", {}, {}, () => { });
  }

}
