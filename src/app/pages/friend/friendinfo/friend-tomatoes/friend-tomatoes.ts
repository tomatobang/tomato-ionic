import { Component, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';


@Component({
  selector: 'friend-tomatoes',
  templateUrl: 'friend-tomatoes.html',
})
export class FriendTomatoesPage implements OnInit {
  title = '';
  tomatoes: Array<any>;

  constructor(public navParams: NavParams) {}

  ngOnInit() {
    this.title = this.navParams.get('friendName');
    this.tomatoes = new Array(10).fill('');
  }
}
