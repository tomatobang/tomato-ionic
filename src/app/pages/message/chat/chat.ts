import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Events } from '@ionic/angular';
import { RebirthHttpProvider } from 'rebirth-http';
import { ChatMessage } from './providers/chat-message.model';
import { ChatService } from './providers/chat-service';
import { GlobalService } from '@services/global.service';
import { CacheService } from '@services/cache.service';
import { InfoService } from '@services/info.service';
import { MessageService } from '@services//data/message/message.service';
import { ActivatedRoute } from '@angular/router';
import { ChatIOService } from '@services/utils/socket.io.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
  styleUrls: ['./chat.scss']
})
export class ChatPage {
  @ViewChild('chat_content') content;
  @ViewChild('chat_input') messageInput;

  msgList: ChatMessage[] = [];
  userId: string;
  userName: string;
  userImgUrl: string;
  toUserId: string;
  toUserName: string;
  editorMsg = '';
  isOpenEmojiPicker = false;
  IOSubscribe: Subscription;

  constructor(
    private actrouter: ActivatedRoute,
    public navCtrl: NavController,
    public chatService: ChatService,
    public events: Events,
    public ref: ChangeDetectorRef,
    public globalService: GlobalService,
    public info: InfoService,
    public cache: CacheService,
    public chatIO: ChatIOService,
    public messageService: MessageService,
    public globalservice: GlobalService,
    public rebirthProvider: RebirthHttpProvider,
  ) {
    this.rebirthProvider.headers({ Authorization: this.globalservice.token }, true);
    this.actrouter.queryParams.subscribe((queryParams) => {
      this.toUserId = queryParams["toUserId"];
      this.toUserName = queryParams["toUserName"];

      this.userId = this.globalService.userinfo._id;
      this.userName = this.globalService.userinfo.username;

      this.info.getFriendHistoryMsg(this.toUserId).subscribe(messages => {
        let minusCount = 0;
        for (let index = 0; index < messages.length; index++) {
          const newMsg: ChatMessage = {
            messageId: messages[index].create_at,
            userId: messages[index].from ? messages[index].from : this.toUserId,
            userName: messages[index].from ? this.userName : this.toUserName,
            userImgUrl: './assets/tomato-active.png',
            toUserId: messages[index].to ? messages[index].to : this.userId,
            time: messages[index].create_at,
            message: messages[index].content,
            status: 'success',
          };
          this.pushNewMsg(newMsg);
          if (!messages[index].has_read) {
            minusCount -= 1;
            this.updateMsgState(messages[index]._id);
          }
        }
        if (minusCount < 0) {
          this.info.addUnreadMsgCount(minusCount, this.toUserId);
          this.info.updateMessageState(this.toUserId);
        }
      });
      // 监听实时消息
      this.IOSubscribe = this.chatIO.receive_message().subscribe(data => {
        if (data) {
          if (this.toUserId !== data.from) {
            return;
          }
          this.getFriendName(data.from).then(name => {
            const newMsg: ChatMessage = {
              messageId: data.create_at,
              userId: data.from,
              userName: name,
              userImgUrl: './assets/tomato-active.png',
              toUserId: data.to,
              time: data.create_at,
              message: data.content,
              status: 'success',
            };
            if (!data.has_read) {
              this.updateMsgState(data._id);
            }
            this.info.addUnreadMsgCount(0, this.toUserId);
            this.pushNewMsg(newMsg);
          });
        }
      });
    });
  }

  /**
   * 获取好友名称
   * @param id 用户编号
   */
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

  /**
   * 消息置为已读
   * @param id 消息编号
   */
  updateMsgState(id) {
    this.messageService
      .updateMessageState({
        id: id,
        has_read: true,
      })
      .subscribe(data => {
        console.log('updateMsgState', data);
      });
  }

  /**
   * 发送消息
   * @name sendMsg
   */
  sendMsg() {
    if (!this.editorMsg.trim()) {
      alert('消息不能为空');
      return;
    }
    if (!this.userId || !this.toUserId) {
      alert('用户不存在，怎么能发消息呢?');
      return;
    }
    this.chatService.sendMessage(this.userId, this.toUserId, this.editorMsg);
    this.info.syncMsgFromLocal(this.toUserId, {
      from: this.userId,
      to: this.toUserId,
      content: this.editorMsg,
      type: 1,
      create_at: Date.now(),
      has_read: true,
    });

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

    if (!this.isOpenEmojiPicker) {
      this.messageInput.setFocus();
    }

    // 模拟发送成功
    setTimeout(() => {
      const index = this.getMsgIndexById(id);
      if (index !== -1) {
        this.msgList[index].status = 'success';
      }
    }, 600);
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

  ionViewWillLeave() {
    // unsubscribe
    if (this.IOSubscribe) {
      this.IOSubscribe.unsubscribe();
    }
    // this.info.registerChatMsg(null);
  }

  ionViewDidEnter() {
    // this.info.registerChatMsg(this.toUserId);
  }

  _focus() {
    this.isOpenEmojiPicker = false;
    // this.content.resize();
    this.scrollToBottom();
  }

  switchEmojiPicker() {
    this.isOpenEmojiPicker = !this.isOpenEmojiPicker;
    if (!this.isOpenEmojiPicker) {
      this.messageInput.setFocus();
    }
    // this.content.resize();
    this.scrollToBottom();
  }

  scrollToBottom() {
    setTimeout(() => {
      // if (this.content._scroll) {
      this.content.scrollToBottom();
      // }
    }, 400);
  }
}
