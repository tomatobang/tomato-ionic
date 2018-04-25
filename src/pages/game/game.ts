import { Component, ViewChild } from '@angular/core';

import { NavController, IonicPage } from 'ionic-angular';

@Component({
  selector: 'cmp-game',
  templateUrl: 'game.html',
})
@IonicPage()
export class GamePage {
  constructor(public navCtrl: NavController, public storage: Storage) {}

  ionViewWillEnter() {}

  ionViewDidEnter() {}

  ionViewDidLeave() {}
}
