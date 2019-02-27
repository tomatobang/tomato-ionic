import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { NavParams } from '@ionic/angular';

@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
  constructor(public router: Router, public navParams: NavParams) { }

  ionViewDidLoad() { }

  toHistoryTomato() {
    console.log('toHistoryTomato!');
    this.router.navigate(['historytomato']);
  }

  toSearchUser() {
    console.log('toSearchUser!');
    this.router.navigate(['searchuser']);
  }
}
