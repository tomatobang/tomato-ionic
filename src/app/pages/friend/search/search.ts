import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
  styleUrls: ['search.scss']
})
export class SearchPage {
  constructor(public navCtrl: NavController) { }

  ionViewDidLoad() { }

  toHistoryTomato() {
    console.log('toHistoryTomato!');
    this.navCtrl.navigateForward(['tabs/friend/historytomato']);
  }

  toSearchUser() {
    console.log('toSearchUser!');
    this.navCtrl.navigateForward(['tabs/friend/searchuser']);
  }
}
