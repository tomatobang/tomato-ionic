import { Router } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
  constructor(public router: Router) { }

  ionViewDidLoad() { }

  toHistoryTomato() {
    console.log('toHistoryTomato!');
    this.router.navigate(['tabs/friend/historytomato']);
  }

  toSearchUser() {
    console.log('toSearchUser!');
    this.router.navigate(['tabs/friend/searchuser']);
  }
}
