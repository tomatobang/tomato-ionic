import { Component, OnInit, ViewChild } from '@angular/core';
import { Http } from '@angular/http';

import { IonicPage, Scroll } from 'ionic-angular';
import { PinyinService } from '../../../providers/utils/pinyin.service';
import { Friendinfo } from './providers/contact-friendinfo.model';


@IonicPage()
@Component({
  selector: 'cmp-contacts',
  templateUrl: 'contacts.html',
})
export class ContactsPage implements OnInit {
  // 滚动条
  @ViewChild('scrollMe') private myScrollContainer: Scroll;
  friendlist = [];
  newFriendList = [];

  constructor(private pinyinUtil: PinyinService, private http: Http) {
    this.getFriendlist()
      .then(res => {
        this.friendlist = res;
        this.getNewFriendlist();
      })
      .catch(err => {
        console.log(err);
      });
  }

  getFriendlist(): Promise<Friendinfo[]> {
    const msgListUrl = './assets/mock/contacts.json';

    return this.http
      .get(msgListUrl)
      .toPromise()
      .then(response => response.json().data as Friendinfo[])
      .catch(err => Promise.reject(err || 'err'));
  }

  // 初始化项目列表
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
    const element = <HTMLElement>this.myScrollContainer._scrollContent
      .nativeElement;
    element.scrollTop = evt;
  }
}

