import { Component } from '@angular/core';
import { NavController, NavParams, Content, IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {}

  toHistoryTomato() {
    console.log('toHistoryTomato!');
    this.navCtrl.push('HistoryTomatoPage', {}, {}, () => {});
  }

  toSearchUser() {
    console.log('toSearchUser!');
    this.navCtrl.push('SearchUserPage', {}, {}, () => {});
  }
}
