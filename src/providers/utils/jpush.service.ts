/**
 * 极光推送服务
 */
import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { GlobalService } from '../global.service';

declare var window;

@Injectable()
export class JPushService {
  constructor(public plf: Platform, public _global: GlobalService) {
    // 订阅应用启动退出
    plf.resume.subscribe(data => {
      this.clearLocAndBadge();
    });
    plf.pause.subscribe(d => {
      _global.appIsActive = false;
    });
  }

  clearLocAndBadge() {
    this.clearLocalNotifications(); //进入时清除本地通知数据
    this.setApplicationIconBadgeNumber(0); //进入应用徽章清空
    this.resetBadge(); //还原极光服务器
  }

  documentBindEventListener(eventType, callback) {
    document.removeEventListener(eventType, callback, false);
    document.addEventListener(eventType, callback, false);
  }

  //应用程序处于前台时收到推送会触发该事件
  setTagsWithAliasCallback(event) {
    if (event.resultCode !== 0) {
      setTimeout(() => {
        this.setAlias('1000');
      }, 6000);
      //myNote.myNotice("注册推送服务失败，错误码：" + event.resultCode, 3000);
    } else {
      //设置别名成功才算开启推送
    }
    this._global.setTagsWithAliasCallback(event);
  }

  openNotificationCallback(data) {
    //点击通知打开应用，清除badge和本地通知
    this.clearLocAndBadge();
    const isAndroid = this.plf.is('android');
    const type = isAndroid ? data.extras.Type : data.Type;
    if (type == 1) {
      //涉及到页面重绘，在controller中监听实现跳转
    } else if (type == 2) {
    }
    this._global.openNotificationCallback(data);
  }

  receiveCallback(data) {
    //应用在激活状态，不添加badge和本地通知
    if (this._global.appIsActive == true) {
      this.clearLocAndBadge();
    }
    const type = this.plf.is('android') ? data.extras.Type : data.Type;
    // 根据设置是否需要开启音效
    if (true) {
      //
      // let audio = new Audio();
      // audio.src = "http://remote.address.com/example.mp3";
      // audio.load();
      // audio.play();
    }
    if (type == 1) {
    } else if (type == 2) {
    }
    this._global.receiveNotificationCallback(data);
  }
  //启动极光推送,读取用户设置，进行初始化操作，如果没有自定义设置，默认开启

  init(alias) {
    document.addEventListener(
      'deviceready',
      () => {
        this.getUserNotificationSettings(function(result) {
          if (result === 0) {
            //推送被关闭,提示用户开启权限
            // myNote.myNotice("告警推送需要在设置中开启应用推送权限", 3000);
          }
        });
        this.resumePush(); //如果stopPush后，必须resume再init，否则无效
        const config = {
          stac: this.setTagsWithAliasCallback,
          onc: this.openNotificationCallback,
          rnc: this.receiveNotificationCallback,
          bnc: this.backgroundNotificationCallback
        };
        if (this.plf.is('ios')) {
          //ios不同于android，需要注册apns服务
          window.plugins.NXTPlugin.startJPushSDK();
        }
        //本功能是一个完全本地的状态操作，也就是说：停止推送服务的状态不会保存到服务器上。
        //推送服务停止期间推送的消息，恢复推送服务后，如果推送的消息还在保留的时长范围内，则客户端是会收到离线消息。
        window.plugins.NXTPlugin.init();
        //设置tag和Alias触发事件处理
        this.documentBindEventListener('jpush.setTagsWithAlias', config.stac);
        this.documentBindEventListener('jpush.openNotification', config.onc);
        this.documentBindEventListener('jpush.receiveNotification', config.rnc);
        this.documentBindEventListener(
          'jpush.backgroundNotification',
          config.bnc
        );
        // 提交华为 Token
        this.documentBindEventListener('jpush.onReceiveHuaWeiToken', function(
          token
        ) {
          // 这里需要保存到本地，这样就不需要反复获取了
          // 保存 token 至服务端，token
          console.log('收到华为TOKEN:', token);
        });
        //开发周期建议打开debug模式，可以获得额外帮助,发布时关闭，节省性能
        window.plugins.NXTPlugin.setDebugMode(false);
        //以下仅限android，插件内部做了平台判断
        window.plugins.NXTPlugin.setBasicPushNotificationBuilder(); //声音，振动提示等,
        window.plugins.NXTPlugin.requestPermission(); //用于在 Android 6.0 及以上系统，申请一些权限
        this.clearLocAndBadge();
        // 根据实际状况设置推送是否开启
        const pushState = true;
        //默认开启，除非明确设置为false,
        if (pushState) {
          this.setAlias(alias);
        } else {
          this.stopPush();
        }
      },
      false
    );
  }

  receiveNotificationCallback(data) {
    this.receiveCallback(data);
  }
  //应用程序处于后台时收到推送会触发该事件，可以在后台执行一段代码。
  backgroundNotificationCallback = function(data) {
    this.receiveCallback(data);
  };

  /**
   * @function: 停止极光推送
   * android平台:
   * JPush Service 不在后台运行。
   * 收不到推送消息。
   * 不能通过 JPushInterface.init 恢复，需要调用 resumePush 恢复。
   * 极光推送所有的其他 API 调用都无效。
   * ios平台：
   * 不推荐调用，因为这个 API 只是让你的 DeviceToken 失效，在 设置－通知 中您的应用程序没有任何变化。
   * 建议设置一个 UI 界面， 提醒用户在 设置－通知 中关闭推送服务。
   * */
  stopPush() {
    window.plugins.NXTPlugin.stopPush();
  }

  /**
   * @function 重启极光推送
   * @description Android平台:极光推送完全恢复正常工作。
   * @description iOS平台:重新去 APNS 注册。
   * */
  resumePush() {
    window.plugins.NXTPlugin.resumePush();
  }

  /**
   * @function: 获取状态
   * @description Android 平台:用来检查 Push Service 是否已经被停止。
   * @description iOS 平台:平台检查推送服务是否注册。
   * @param 参数是回调函数：result为0表示开启，其他表示关闭
   * ps:调用stopPush关闭之后，不会马上生效
   * */
  isPushStopped(fun) {
    window.plugins.NXTPlugin.isPushStopped(fun);
  }

  /**
   * @function 得到RegistrationID
   * @description 集成了 JPush SDK 的应用程序在第一次成功注册到 JPush 服务器时，JPush 服务器会给客户端返回一个唯一的该设备的标识 - RegistrationID。
   * @description 应用程序可以把此 RegistrationID 保存以自己的应用服务器上，然后就可以根据 RegistrationID 来向设备推送消息或者通知。
   * @param 参数是回调函数，result结果为RegistrationID
   * */
  getRegistrationID(fun) {
    window.plugins.NXTPlugin.getRegistrationID(fun);
  }

  /**
   * 设置别名和标签，本身无返回值，可以注册jpush.setTagsWithAlias 事件来监听设置结果:
   * document.addEventListener("jpush.setTagsWithAlias", function(event) {}, false)
   * event结构为{resultCode:null,tags:null,alias:null}
   * 具体错误码定义见readme.md
   * */

  /**
   * @function 设置别名
   * @description 为安装了应用程序的用户，取个别名来标识。以后给该用户 Push 消息时，就可以用此别名来指定。尽可能根据别名来唯一确定用户。
   * @alias 参数类型为字符串。空字符串 （""）表示取消之前的设置。
   * */
  setAlias(alias) {
    window.plugins.NXTPlugin.setAlias(alias);
  }

  /**
   * @function 设置标签
   * @description 为安装了应用程序的用户，打上标签。其目的主要是方便开发者根据标签，来批量下发 Push 消息。
   * @description 可为每个用户打多个标签。
   * @tags 参数类型为数组。空集合表示取消之前的设置。
   * @description 每个 tag 命名长度限制为 40 字节，最多支持设置 100 个 tag，但总长度不得超过1K字节（判断长度需采用 UTF-8 编码）。
   * @description 单个设备最多支持设置 100 个 tag，App 全局 tag 数量无限制。
   * */
  setTags(tags) {
    window.plugins.NXTPlugin.setTags(tags);
  }

  //设置标签和别名
  setTagsWithAlias(tags, alias) {
    window.plugins.NXTPlugin.setTagsWithAlias(tags, alias);
  }

  /**
   * @function 判断系统设置中是否允许当前应用推送
   * @description 在 Android 中，返回值为 0 时，代表系统设置中关闭了推送；为 1 时，代表打开了推送（目前仅适用于Android 4.4+）。
   * @description 在 iOS 中，返回值为 0 时，代表系统设置中关闭了推送；大于 0 时，代表打开了推送，且能够根据返回值判断具体通知形式
   * @param 参数是回调方法，result状态值
   * */
  getUserNotificationSettings(fun) {
    window.plugins.NXTPlugin.getUserNotificationSettings(fun);
  }

  clearLocalNotifications() {
    window.plugins.NXTPlugin.clearLocalNotifications();
  }

  clearAlias() {
    this.setAlias('');
  }

  clearTags() {
    this.setTags([]);
  }

  // iOS methods
  // JPush封装badge功能，允许应用上传badge值至JPush服务器，由JPush后台帮助管理每个用户所对应的推送badge值，简化了设置推送badge的操作。
  // 本接口不会直接改变应用本地的角标值. 要修改本地badege值，使用setApplicationIconBadgeNumber
  setBadge(value) {
    window.plugins.NXTPlugin.setBadge(value);
  }

  //resetBadge 相当于 setBadge(0)。
  resetBadge() {
    window.plugins.NXTPlugin.resetBadge();
  }

  /**
   * 设置应用图标数值
   * @param badge 应用图标数值
   */
  setApplicationIconBadgeNumber(badge) {
    window.plugins.NXTPlugin.setApplicationIconBadgeNumber(badge);
  }

  /**
   * 获取应用图标数值
   * @param fun
   */
  getApplicationIconBadgeNumber(fun) {
    window.plugins.NXTPlugin.getApplicationIconBadgeNumber(fun);
  }
}
