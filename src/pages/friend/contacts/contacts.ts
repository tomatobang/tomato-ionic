import { Component, OnInit, ViewChild } from '@angular/core';

import { IonicPage, Scroll } from 'ionic-angular';
import { PinyinService } from '../../../providers/utils/pinyin.service';

@IonicPage()
@Component({
  selector: 'page-contacts',
  templateUrl: 'contacts.html',
})
export class ContactsPage implements OnInit {
  // 滚动条
  @ViewChild('scrollMe') private myScrollContainer: Scroll;
  friendlist = [
    { firstCode: 'A', id: 1, name: '安以轩' },
    { firstCode: 'B', id: 2, name: '白百何' },
    { firstCode: 'C', id: 3, name: '陈真' },
    { firstCode: 'D', id: 4, name: '斗鱼' },
    { firstCode: 'E', id: 5, name: '饿了么' },
    { firstCode: 'F', id: 6, name: '富士康' },
    { firstCode: 'G', id: 7, name: '咯咯' },
    { firstCode: 'H', id: 8, name: '哈哈' },
    { firstCode: 'J', id: 9, name: '纪小南' },
    { firstCode: 'K', id: 10, name: '卡卡' },
    { firstCode: 'L', id: 11, name: '楼萱' },
    { firstCode: 'M', id: 12, name: '妹妹' },
    { firstCode: 'N', id: 13, name: '牛人' },
    { firstCode: 'O', id: 14, name: '欧派' },
    { firstCode: 'P', id: 15, name: '彭志向' },
    { firstCode: 'Q', id: 16, name: '蛐蛐' },
    { firstCode: 'R', id: 17, name: '蓉儿' },
    { firstCode: 'S', id: 18, name: '傻哥' },
    { firstCode: 'T', id: 19, name: '腾格尔' },
    { firstCode: 'U', id: 21, name: 'UBER' },
    { firstCode: 'V', id: 22, name: '谢尔康' },
    { firstCode: 'W', id: 23, name: '悠悠' },
  ];
  newFriendList = [];
  constructor(private pinyinUtil: PinyinService) {
    this.getNewFriendlist();
  }

  //初始化项目列表
  getNewFriendlist() {
    if (this.friendlist instanceof Array && this.friendlist.length > 0) {
      this.newFriendList = this.pinyinUtil.sortByFirstCode(
        this.friendlist,
        'name'
      );
    }
  }

  ngOnInit() {}

  OnNavcScroll(evt) {
    let element = <HTMLElement>this.myScrollContainer._scrollContent
      .nativeElement;
    element.scrollTop = evt;
  }
}
