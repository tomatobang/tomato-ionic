import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Events, Content, TextInput } from 'ionic-angular';

import { ChatMessage } from './providers/chat-message.model';
import { ChatService } from './providers/chat-service';
import { GlobalService } from '@providers/global.service';
import { CacheService } from '@providers/cache.service';
import { InfoService } from '@providers/info.service';
import { setTimeout } from 'timers';

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class Chat {
  @ViewChild(Content) content: Content;
  @ViewChild('chat_input') messageInput: TextInput;
  msgList: ChatMessage[] = [];
  userId: string;
  userName: string;
  userImgUrl: string;
  toUserId: string;
  toUserName: string;
  editorMsg = '';
  _isOpenEmojiPicker = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public chatService: ChatService,
    public events: Events,
    public ref: ChangeDetectorRef,
    public globalService: GlobalService,
    public info: InfoService,
    public cache: CacheService
  ) {
    // Get the navParams toUserId parameter
    this.toUserId = navParams.get('toUserId');
    this.toUserName = navParams.get('toUserName');
    this.userId = this.globalService.userinfo.userid;
    this.userName = this.globalService.userinfo.username;

    this.info.realtimeMsgMonitor.subscribe(data => {
      if (data) {
        if (this.toUserId !== data.from) {
          return;
        }
        const id = Date.now().toString();
        this.getFriendName(data.from).then(name => {
          const newMsg: ChatMessage = {
            messageId: data.create_at,
            userId: data.from,
            userName: name,
            userImgUrl: './assets/tomato-active.png',
            toUserId: this.userId,
            time: data.create_at,
            message: data.message ? data.message : data.content,
            status: 'success',
          };
          this.pushNewMsg(newMsg);
        });
      }
    });
    // Get mock user information
    // this.chatService.getUserInfo().then(res => {
    //   this.userId = res.userId;
    //   this.userName = res.userName;
    //   this.userImgUrl = res.userImgUrl;
    // });
  }

  getFriendName(id): Promise<any> {
    return new Promise((resolve, reject) => {
      this.cache.getFriendList().subscribe(friendList => {
        if (friendList) {
          for (let index = 0; index < friendList.length; index++) {
            const element = friendList[index];
            if (element.id === id) {
              resolve(element.name);
            }
          }
        }
        resolve('unknown');
      });
    });
  }

  ionViewDidLoad() {
    // this.switchEmojiPicker();
  }

  ionViewWillLeave() {
    // unsubscribe
    this.events.unsubscribe('chat:received');
  }

  ionViewDidEnter() {
    // get message list
    // this.getMsg();
    // // Subscribe to received  new message events
    // this.events.subscribe('chat:received', (msg, time) => {
    //   this.pushNewMsg(msg);
    // });
    this.info.registerChatMsg(this.toUserId);
  }

  _focus() {
    this._isOpenEmojiPicker = false;
    this.content.resize();
    this.scrollToBottom();
  }

  switchEmojiPicker() {
    this._isOpenEmojiPicker = !this._isOpenEmojiPicker;
    if (!this._isOpenEmojiPicker) {
      this.messageInput.setFocus();
    }
    this.content.resize();
    this.scrollToBottom();
  }

  /**
   * @name getMsg
   * @returns {Promise<ChatMessage[]>}
   */
  getMsg() {
    // Get mock message list
    return this.chatService.getMsgList().subscribe(res => {
      this.msgList = res;
      this.scrollToBottom();
    });
  }

  /**
   * @name sendMsg
   */
  sendMsg() {
    if (!this.editorMsg.trim()) {
      return;
    }

    this.chatService.sendMessage(this.userId, this.toUserId, this.editorMsg);

    // Display message
    const id = Date.now().toString();
    const newMsg: ChatMessage = {
      messageId: Date.now().toString(),
      userId: this.userId,
      userName: this.userName,
      userImgUrl: './assets/tomato-grey.png',
      toUserId: this.toUserId,
      time: Date.now(),
      message: this.editorMsg,
      status: 'pending',
    };

    this.pushNewMsg(newMsg);
    this.editorMsg = '';

    if (!this._isOpenEmojiPicker) {
      this.messageInput.setFocus();
    }

    // 模拟发送成功
    setTimeout(() => {
      const index = this.getMsgIndexById(id);
      if (index !== -1) {
        this.msgList[index].status = 'success';
      }
    }, 600);

    // this.chatService.sendMsg(newMsg).then(() => {
    //   const index = this.getMsgIndexById(id);
    //   if (index !== -1) {
    //     this.msgList[index].status = 'success';
    //   }
    // });
  }

  /**
   * @name pushNewMsg
   * @param msg
   */
  pushNewMsg(msg: ChatMessage) {
    // Verify user relationships
    if (msg.userId === this.userId && msg.toUserId === this.toUserId) {
      this.msgList.push(msg);
    } else if (msg.toUserId === this.userId && msg.userId === this.toUserId) {
      this.msgList.push(msg);
    }
    this.scrollToBottom();
  }

  getMsgIndexById(id: string) {
    return this.msgList.findIndex(e => e.messageId === id);
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.content._scroll) {
        this.content.scrollToBottom();
      }
    }, 400);
  }
}
