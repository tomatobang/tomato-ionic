import {
  Component,
  OnInit,
  ViewChild,
  QueryList,
  ElementRef,
} from '@angular/core';
import { NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { PinyinService } from '@services/utils/pinyin.service';
import { Friendinfo } from './providers/contact-friendinfo.model';
import { GlobalService } from '@services/global.service';
import { CacheService } from '@services/cache.service';
import { ChatIOService } from '@services/utils/socket.io.service';

import { EmitService } from '@services/emit.service';
import { Helper } from '@services/utils/helper';
import { NativeService } from '@services/native.service';
@Component({
  selector: 'cmp-contacts',
  templateUrl: 'contacts.html',
  styleUrls: ['./contacts.scss']
})
export class ContactsPage implements OnInit {

  @ViewChild('scrollMe') private myScrollContainer;

  private navChars: QueryList<HTMLLinkElement>;
  userid;
  friendlist = [];
  newFriendList = [];
  friendOnlineState = {};
  bindItems = [];

  stickerChar = '';
  contacts: Array<any> = [];
  currentPageClass = this;
  constructor(
    private pinyinUtil: PinyinService,
    private http: HttpClient,
    private el: ElementRef,
    private emitService: EmitService,
    private helper: Helper,
    public native: NativeService,
    public globalService: GlobalService,
    public cache: CacheService,
    public chatIO: ChatIOService,
    public navCtrl: NavController,
  ) { }

  ngOnInit() {
    this.getAgreedUserFriend();
    this.emitService.getActiveUser().subscribe(ret => {
      this.getAgreedUserFriend();
    });
    // this.mock();
  }

  /**
   * 获取好友列表
   */
  getAgreedUserFriend() {
    this.cache.getFriendList().subscribe(data => {
      if (data && data.length > 0) {
        this.friendlist = data;
        this.friendlist.map((val) => {
          this.setHeadImg(val);
        });
        this.getSortedFriendlist();
        this.loadOnlineFriendList();
      }
    });
  }

  OnNavcScroll(evt) {
    const element = <HTMLElement>(
      this.myScrollContainer.nativeElement
    );
    element.scrollTop = evt;
  }

  setHeadImg(friend) {
    if (window.cordova) {
      this.native.downloadHeadImg(friend.id, false, friend.headImg).then(url => {
        friend.headImg = this.helper.dealWithLocalUrl(url);
      });
    } else {
      friend.headImg = friend.headImg;
    }
  }

  /**
   * 加载在线好友列表
   */
  loadOnlineFriendList() {
    const userid = this.globalService.userinfo._id;
    this.chatIO.load_online_friend_list(userid);

    this.chatIO.load_online_friend_list_succeed().subscribe(data => {
      let fid = '';
      const friendlist = data.friendlist;
      for (const end of friendlist) {
        if (end.length > 10) {
          fid = end;
        }
        // 好友在线
        if (end === '1') {
          this.friendOnlineState[fid] = true;
        }
      }
      console.log('load_online_friend_list_succeed', friendlist);
    });

    this.chatIO.fail().subscribe(err => {
      console.error(err);
    });
  }

  /**
   * 导航至好友详情页
   * @param userid 好友编号
   * @param friendname 好友名称
   */
  toFriendInfo(item) {
    this.navCtrl.navigateForward(['tabs/friend/friendinfo'], {
      queryParams: {
        userid: item.id,
        friendname: item.displayName,
        headImg: item.headImg
      }
    });
  }

  getSortedFriendlist() {
    if (this.friendlist instanceof Array && this.friendlist.length > 0) {
      this.newFriendList = this.pinyinUtil.sortByFirstCode(
        this.friendlist,
        'name'
      );

      for (let index = 0; index < this.newFriendList.length; index++) {
        const element = this.newFriendList[index];
        const firstCode = element.firstCode;
        for (let i = 0; i < element.data.length; i++) {
          const friend = element.data[i];
          this.bindItems.push({
            id: friend.id,
            firstCode: firstCode,
            displayName: friend.name,
            headImg: friend.headImg,
          });
        }
      }
      setTimeout(() => {
        this.navChars = this.el.nativeElement.querySelectorAll(
          'a.contact-nav-char'
        );
        if (this.navChars.length > 0) {
          this.stickerChar = this.navChars[0].textContent;
        }
      });
    }
  }

  mock() {
    this.getFriendlist()
      .then(res => {
        this.friendlist = res;
        this.getSortedFriendlist();
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
}
