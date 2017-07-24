import { Injectable } from "@angular/core";
import { Platform } from "ionic-angular";
import { Events } from "ionic-angular";
import { GlobalService } from "../providers/global-service";
import { RongyunUtil } from "./RongyunUtil";

declare var window;
declare var $rootScope;

@Injectable()
export class RongYunService {
	//加载会话列表
	isLoadedConversationList = false;
	firstLoadConversationListInterval = null;
	loadConversationInterval = null;
	loadUnreadMessageNumberInterval = null;

	constructor(public plf: Platform, public _global: GlobalService,public myUtil: RongyunUtil) {
		// Function 拦截器
		Object.defineProperty(Function.prototype, "before", {
			value: function() {
				var __self = this;
				return function() {
					if ($rootScope.connectStatus === "") {
						return __self.apply(this, arguments);
					} else {
						this.myNotice("聊天服务异常，请稍后重试");
					}
				};
			}
		});
	}

	// 判断定时器是否有效
	isIntervalValid(flag) {
		return flag.$setIntervalId != null;
	}

	// 定时器过多，统一取消定时器，因为共享传递的方式，需要注意
	cancelInterval(flag) {
		if (flag && flag.$setIntervalId != null) {
			clearInterval(flag);
			for (var attr in flag) {
				delete flag[attr];
			}
		}
	}

	myNotice(info) {
		alert(info);
	}

	//设置状态监听
	setStatusListener() {
		window.RongCloudLibPlugin.setConnectionStatusListener((ret, err) => {
			if (ret) {
				var status = ret.result.connectionStatus;
				switch (status) {
					case "KICKED":
						// 只允许单用户登录,KICKED表示用户账户在其他设备登录，本机会被踢掉线
						break;
					case "CONNECTED":
						// 连接成功
						$rootScope.connectStatus = "";
						break;
					case "CONNECTING":
						// 连接中
						$rootScope.connectStatus = "聊天连接中";
						break;
					case "DISCONNECTED":
						// 断开连接
						$rootScope.connectStatus = "聊天断开连接";
						break;
					case "NETWORK_UNAVAILABLE":
						// 网络不可用
						$rootScope.connectStatus = "网络不可用";
						break;
					case "SERVER_INVALID":
						// 服务器异常或无法连接
						$rootScope.connectStatus = "聊天服务器异常";
						break;
					case "TOKEN_INCORRECT":
						// Token 不正确
						$rootScope.connectStatus = "聊天服务错误";
						break;
				}
			}
			if (err) {
				this.errCallback("initError", err);
			}
		});
	}

	//连接
	connect(token, callback) {
		window.RongCloudLibPlugin.connect(
			{
				token: token
			},
			(ret, err) => {
				if (ret) {
					callback();
					//连接完成，开启全局消息监听
					this.setOnReceiveMessageListener();
					console.log("rongyun init success");
				}
				if (err) {
					this.errCallback("initError", err);
				}
			}
		);
	}

	//设置新消息监听
	setOnReceiveMessageListener() {
		window.RongCloudLibPlugin.setOnReceiveMessageListener((ret, err) => {
			//接收消息
			if (ret) {
				$rootScope.arrMsgs.push(JSON.stringify(ret.result.message));
				$rootScope.$apply();
			}
			if (err) {
				this.errCallback("initError", err);
			}
		});
	}

	//加载回话列表
	initConversation(callback, type) {
		window.RongCloudLibPlugin.getConversationList((ret, err) => {
			if (ret) {
				callback(ret);
				if (type == "contacts") {
					this.isLoadedConversationList = true;
				}
			}
			if (err) {
				//视频挂断后的会引起的重复连接，因为会重新出发EfosCtrl
				this.errCallback("getConversationListError", err);
			}
		});
	}

	//错误执行的回调函数
	errCallback(type, error, fn?) {
		console.log("type:" + type, "error" + JSON.stringify(error));
	}

	/**
     * 初始化步骤一次进行，解决可能出现的 33002 错误，未 init 完成就 connect 
     */ 
	_init(RongyunToken,callback) {
		//如果没有融云，如果在pc端运行，则不进行融云相关服务
		if (window.cordova) {
			window.RongCloudLibPlugin.init(
				{
					appKey: this._global.RongyunAppKey
				},
				(ret, err) => {
					if (ret) {
						if (ret.status === "success") {
							//初始化成功时设置状态监听
							this.setStatusListener();
							//设置监听完成时开始连接
							this.connect(RongyunToken, callback);
						}
					}
					if (err) {
						console.log("init rongyun error");
						this.errCallback("initError", err);
					}
				}
			);
			console.log("init rongyun start...");
		}
	}

	/**
     * 清除所有会话
     * @param callback 
     */
	_clearAllConversation(callback) {
		window.RongCloudLibPlugin.clearConversations(
			{
				conversationTypes: ["PRIVATE", "GROUP"]
			},
			(ret, err) => {
				if (ret) {
					this.myNotice("已清除所有会话");
					callback();
				}
				if (err) {
					this.errCallback("clearConversationError", err, () => {
						this.myNotice("清除所有会话失败，请稍后重试");
					});
				}
			}
		);
	}

	/**
     * 会话设为已读
     * @param targetId 
     * @param type 
     */
	_clearMessagesUnreadStatus(targetId, type) {
		if (window.cordova) {
			window.RongCloudLibPlugin.clearMessagesUnreadStatus(
				{
					conversationType: type,
					targetId: targetId.toString()
				},
				(ret, err) => {
					if (err) {
						this.errCallback(
							"clearConversationByTargetIdAndTypeError",
							err,
							() => {
								this.myNotice("会话设为已读失败，请稍后重试");
							}
						);
					}
				}
			);
		}
	}

	/**
     * 删除指定回话
     * @param targetId 
     * @param type 
     */
	_removeConversationByTargetIdAndType(targetId, type) {
		window.RongCloudLibPlugin.removeConversation(
			{
				conversationType: type,
				targetId: targetId.toString()
			},
			(ret, err) => {
				if (err) {
					this.errCallback(
						"removeConversationByTargetIdAndTypeError",
						err,
						() => {
							this.myNotice("删除指定会话失败，请稍后重试");
						}
					);
				}
			}
		);
	}

	/**
     * 得到最近消息
     * @param targetId 
     * @param ctype 
     * @param members 
     * @param callback 
     */
	_getLatestMessages(targetId, ctype, members, callback) {
		if (window.cordova) {
			var isIOS = this.plf.is("ios");
			window.RongCloudLibPlugin.getLatestMessages(
				{
					conversationType: ctype,
					targetId: targetId.toString(),
					count: 15
				},
				(ret, err) => {
					if (ret) {
						var result = [],
							tmp;
						for (var i = ret.result.length - 1; i >= 0; i--) {
							tmp = ret.result[i];
							if (ctype == "GROUP" && members.length > 0) {
								for (var m = 0; m < members.length; m++) {
									if (members[m].id == tmp.senderUserId) {
										tmp.name = members[m].name;
										break;
									}
								}
							}
							tmp = this.myUtil.resolveMsg(tmp);
							// 处理IOS倒序顺序bug
							if (isIOS) {
								result.push(tmp);
							} else {
								result.unshift(tmp);
							}
						}
						callback(result);
					}
					if (err) {
						this.errCallback("getLatestMessagesError", err, () => {
							this.myNotice("得到最近消息失败，请稍后重试");
						});
					}
				}
			);
		}
	}

	//得到历史消息，云端拉取需要付费用户
	_getHistoryMsg(targetId, ctype, oldestMessageId, callback) {
		window.RongCloudLibPlugin.getHistoryMessages(
			{
				conversationType: ctype,
				targetId: targetId.toString(),
				count: 5,
				oldestMessageId: oldestMessageId
			},
			(ret, err) => {
				if (ret) {
					callback(ret);
				}
				if (err) {
					this.errCallback("getHistoryMessagesError", err, () => {
						this.myNotice("得到历史消息失败，请稍后重试");
					});
				}
			}
		);
	}

	//发送语音
	_sendVoiceMessage(
		conversationType,
		targetId,
		tmpPath,
		dur,
		mediaRec,
		callback
	) {
		window.RongCloudLibPlugin.sendVoiceMessage(
			{
				conversationType: conversationType,
				targetId: targetId.toString(),
				voicePath: tmpPath,
				duration: dur,
				extra: "",
				user: {
					id: "userid",
					name: "username"
				}
			},
			(ret, err) => {
				mediaRec.release();
				if (ret) {
					callback(ret);
				}
				if (err) {
					this.errCallback("sendVoiceMessageError", err, () => {
						this.myNotice("消息发送失败，请稍后重试");
					});
				}
			}
		);
	}

	//发送文本消息
	_sendMessage(ctype, target, content, callback) {
		window.RongCloudLibPlugin.sendTextMessage(
			{
				conversationType: ctype,
				targetId: target.toString(),
				text: content,
				extra: "extra text",
				user: {
					id: "userid",
					name: "username"
				}
			},
			(ret, err) => {
				if (ret) {
					callback(ret);
				}
				if (err) {
					this.errCallback("sendTextMessageError", err, () => {
						this.myNotice("消息发送失败，请稍后重试");
					});
				}
			}
		);
	}

	//发送图片消息
	_sendImageMessage(conversationType, targetId, picPath, callback) {
		window.RongCloudLibPlugin.sendImageMessage(
			{
				conversationType: conversationType,
				targetId: targetId.toString(),
				imagePath: picPath,
				extra: "",
				user: {
					id: "userid",
					name: "username"
				}
			},
			(ret, err) => {
				if (ret) {
					callback(ret);
				}
				if (err) {
					this.errCallback("sendImageMessageError", err, () => {
						this.myNotice("消息发送失败，请稍后重试");
					});
				}
			}
		);
	}

	_getConversationList(callback, type) {
		if (type == "contacts" && window.cordova) {
			this.initConversation(callback, type);
			//防止注册多个定时器
			this.cancelInterval(this.firstLoadConversationListInterval);
			this.cancelInterval(this.loadConversationInterval);
			//初始化加快
			this.firstLoadConversationListInterval = setInterval(() => {
				this.initConversation(callback, type);
			}, 500);
			//正常加载
			this.loadConversationInterval = setInterval(() => {
				if (
					!this.isIntervalValid(
						this.firstLoadConversationListInterval
					)
				) {
					this.initConversation(callback, type);
				}
				if (this.isLoadedConversationList) {
					this.cancelInterval(this.firstLoadConversationListInterval);
				}
			}, 3000);
		} else if (type == "chat" && window.cordova) {
			//初始化时没有进入协同tab页
			$rootScope.isEnterChatTab = false;
			this.initConversation(callback, type);
			this.cancelInterval(this.loadUnreadMessageNumberInterval);
			this.loadUnreadMessageNumberInterval = setInterval(() => {
				if (!$rootScope.isEnterChatTab) {
					this.initConversation(callback, type);
				} else {
					this.cancelInterval(this.loadUnreadMessageNumberInterval);
				}
			}, 3000);
		}
	}

	//融云登出
	_logout() {
		if (window.cordova) {
			window.RongCloudLibPlugin.logout((ret, err) => {
				if (ret) {
					console.log("logout success");
				}
				if (err) {
					this.errCallback("logoutError", err);
				}
			});
		}
	}

	//退出或切换用户清理工作
	_logoutClear() {
		// 变量
		$rootScope.isEnterChatTab = false;
		this.isLoadedConversationList = false;
		// 定时器
		this.cancelInterval(this.firstLoadConversationListInterval);
		this.cancelInterval(this.loadConversationInterval);
		this.cancelInterval(this.loadUnreadMessageNumberInterval);
		// 路由
		// 融云注销
		this._logout();
	}
}
