import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { NavController, Content, IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-friendinfo',
  templateUrl: 'friendinfo.html',
})
export class FriendInfoPage {
  friendName = '张三';

  @ViewChild(Content) content: Content;
  showToolbar = false;
  headerImgSize = '100%';
  headerImgUrl = '';
  transition = false;

  constructor(public navCtrl: NavController, public ref: ChangeDetectorRef) {}

  ionViewDidLoad() {
    this.headerImgUrl = 'assets/tomatobang.jpg';
  }

  onScroll($event: any) {
    // 只对苹果有效
    const scrollTop = $event.scrollTop;
    this.showToolbar = scrollTop >= 120;
    if (scrollTop < 0) {
      this.transition = false;
      this.headerImgSize = `${Math.abs(scrollTop) / 2 + 100}%`;
    } else {
      this.transition = true;
      this.headerImgSize = '100%';
    }
    this.ref.detectChanges();
  }
  toFriendTomatoes() {
    this.navCtrl.push('FriendTomatoesPage', {
      friendName: this.friendName,
    });
  }
  reqAddFriend() {}

  toMore() {}
}
