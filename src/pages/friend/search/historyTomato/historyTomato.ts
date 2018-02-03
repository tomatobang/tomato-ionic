import { Component } from '@angular/core';
import { NavController, NavParams, Content, IonicPage } from 'ionic-angular';
import {
  OnlineTomatoService,
} from '../../../../providers/data.service';

@IonicPage()
@Component({
  selector: 'page-historyTomato',
  templateUrl: 'historyTomato.html',
})
export class HistoryTomatoPage {
  
  // 番茄钟长度
  searchReturnItems = [];

  constructor(public tomatoservice: OnlineTomatoService, public navParams: NavParams) {}

  ionViewDidLoad() {}

  /**
   * 番茄钟搜索
   */
  seachTomatoes(evt) {
    const keywords = evt.target.value;
    // 前端需对关键词做少许过滤
    console.log('keyword', keywords);
    this.tomatoservice.searchTomatos({ keywords }).subscribe(data => {
      // console.log(data);
      const arr = JSON.parse(data._body);
      this.searchReturnItems = arr;
    });
  }
}
