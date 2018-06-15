import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Events, Content, TextInput } from 'ionic-angular';

import { ChatMessage } from './providers/chat-message.model';
import { ChatService } from './providers/chat-service';
import { GlobalService } from '@providers/global.service';
import { InfoService } from '@providers/info.service';

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
    public info: InfoService
  ) {
    // Get the navParams toUserId parameter
    this.toUserId = navParams.get('toUserId');
    this.toUserName = navParams.get('toUserName');
    this.userId = this.globalService.userinfo.userid;
    this.userName = this.globalService.userinfo.username;

    this.info.realtimeMsgMonitor.subscribe(data => {
      // debugger;
      if (data) {
        const id = Date.now().toString();
        const newMsg: ChatMessage = {
          messageId: data.create_at,
          userId: data.from,
          userName: data.from,
          userImgUrl: '',
          toUserId: this.userId,
          time: data.create_at,
          message: data.message ? data.message : data.content,
          status: '',
        };
        this.pushNewMsg(newMsg);
      }
    });
    // Get mock user information
    // this.chatService.getUserInfo().then(res => {
    //   this.userId = res.userId;
    //   this.userName = res.userName;
    //   this.userImgUrl = res.userImgUrl;
    // });
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
      userImgUrl: this.userImgUrl,
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
      if (this.content.scrollToBottom) {
        this.content.scrollToBottom();
      }
    }, 400);
  }
}
