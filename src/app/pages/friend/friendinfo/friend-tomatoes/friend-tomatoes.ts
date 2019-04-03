import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'friend-tomatoes',
  templateUrl: 'friend-tomatoes.html',
  styleUrls: ['friend-tomatoes.scss']
})
export class FriendTomatoesPage implements OnInit {
  title = '';
  headImg;
  tomatoes: Array<any>;

  constructor(public actrouter: ActivatedRoute) { }

  ngOnInit() {

    this.actrouter.queryParams.subscribe((queryParams) => {
      this.title = queryParams['friendName'];
      this.headImg = queryParams['headImg'];
      this.tomatoes = new Array(10).fill('');
    });
  }
}
