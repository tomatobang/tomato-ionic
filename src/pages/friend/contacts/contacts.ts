import {
  Component,
  OnInit,
  ViewChild,
  ViewChildren,
  QueryList,
  ElementRef,
} from '@angular/core';
import { Observable } from 'rxjs/Rx';
import 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { HttpClient } from '@angular/common/http';

import { IonicPage, Scroll, NavController } from 'ionic-angular';
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
  private navChars: QueryList<HTMLLinkElement>;
  friendlist = [];
  newFriendList = [];

  stickerChar = '123';

  constructor(
    private pinyinUtil: PinyinService,
    private http: HttpClient,
    public navCtrl: NavController,
    private el: ElementRef
  ) {
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
      .then(response => {
        const res: any = response;
        return res.data as Friendinfo[];
      })
      .catch(err => Promise.reject(err || 'err'));
  }

  getNewFriendlist() {
    if (this.friendlist instanceof Array && this.friendlist.length > 0) {
      this.newFriendList = this.pinyinUtil.sortByFirstCode(
        this.friendlist,
        'name'
      );

      setTimeout(() => {
        this.navChars = this.el.nativeElement.querySelectorAll(
          '.contact-nav-char'
        );
      });
    }
  }

  ngOnInit() {
    // this.myScrollContainer.addScrollEventListener((event: MouseEvent) => {
    //   if (this.navChars) {
    //     this.navChars.forEach(element => {
    //       console.log(element.textContent, element.offsetTop);
    //     });
    //   }
    // });

    const event$ = Observable.fromEvent(
      this.myScrollContainer._scrollContent.nativeElement,
      'scroll'
    )
      .debounceTime(100)
      .distinctUntilChanged();
    event$.subscribe(event => {
      if (this.navChars) {
        let ctSrollTop = this.myScrollContainer._scrollContent.nativeElement
          .scrollTop;
        let target =  this.navChars[0];
        this.navChars.forEach(element => {
          if (element.offsetTop - ctSrollTop >= 10) {
          } else {
            target = element;
          }
          this.stickerChar = target.textContent;
          console.log(element.textContent, element.offsetTop);
        });
      }
    });
  }

  OnNavcScroll(evt) {
    const element = <HTMLElement>this.myScrollContainer._scrollContent
      .nativeElement;
    element.scrollTop = evt;
  }

  toFriendInfo() {
    this.navCtrl.push('FriendInfoPage');
  }
}
