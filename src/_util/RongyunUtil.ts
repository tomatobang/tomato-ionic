import { Injectable } from "@angular/core";
declare var window;
@Injectable()
export class RongyunUtil {
	_curUID = "";

	constructor() {}

	stringFormat(str, a1?, a2?, a3?) {
		for (var i = 1; i < arguments.length; i++) {
			str = str.replace(
				new RegExp("\\{" + (i - 1) + "\\}", "g"),
				arguments[i] != undefined ? arguments[i] : ""
			);
		}
		return str;
	}
	
	setUserId(id) {
		this._curUID = id;
    }
    
	getUserId() {
		return this._curUID;
    }

    //解析一条会话  flas:0-conversation;1-message
	resoveDizNft(msg) {
		var result = "",
			operator = msg.operator;
		var userId = this._curUID,
			extension = msg.extension;
		if (userId == operator) result = "您";
		else result = operator;
		switch (msg.type) {
			case 1:
				if (userId == operator) {
					result += "邀请了" + extension + "加入了群聊";
				} else {
					var memberId = extension.split(",");
					var otherId = this.arrayRemove(memberId, userId);
					//result += '邀请了您';
					if (otherId) {
						result += "邀请了您";
						if (otherId.lenght > 0) result += "和" + otherId;
					} else {
						result += "邀请了" + extension;
					}
					result += "加入了讨论组";
				}
				break;
			case 2:
				result += "退出了讨论组";
				break;
			case 3:
				result += "修改讨论组名称为" + extension;
				break;
			case 4:
				result += "踢出了" + msg.extension;
				break;
			case 5:
				result += "修改讨论组邀请状态为" + extension == "0" ? "免打扰" : "提醒";
				break;
		}
		return result;
	}

	/**
     * contact.js 1.收到新消息 2.得到回话列表
     * 功能：主要是处理回话列表信息页面，针对每条信息进行加工
     * user：根据消息得到的targetId得到的具体对象信息
     * flag：1.得到新消息 0.拉去回话时
     * groupMemberinfo：为GROUP类型时发信人的信息
     * */
	resolveCon(conversation, flag, user, groupMemberinfo) {
		try {
			//var date = new Date(conversation.sentTime);
			//var time = date.getHours() + ":" + date.getMinutes();
			//conversation.sentTime = time;
			//var targetId = conversation.targetId;
			var text = "";
			var conversationType = conversation.conversationType;
			var conversationTitle = conversation.conversationTitle;
			var senderUserId = conversation.senderUserId;
			var title = "";
			var temp;

			//加工每条回话的标题
			switch (conversationType) {
				case "PRIVATE":
					title = user ? user.name : "陌生人";
					break;
				case "DISCUSSION":
					title = "讨论组(" + conversationTitle + ")";
					break;
				case "GROUP":
					temp = user ? user.name : "未知组";
					title = "项目组(" + temp + ")";
					break;
				case "SYSTEM":
					temp = user ? user.name : "未知";
					title = "系统消息(" + temp + ")";
			}
			conversation.conversationTitle = title;

			//加工每条回话的内容
			var objectName = conversation.objectName;
			if (objectName == "RC:TxtMsg") {
				if (flag) {
					text = conversation.content.text;
				} else {
					text = conversation.latestMessage.text;
				}
				if (text) {
					text = this.replace_em(text);
				}
			} else if (objectName == "RC:ImgMsg") {
				text = "[图片]";
			} else if (objectName == "RC:DizNtf") {
				//刚创建讨论组时，讨论组的第一条信息的类型
				if (flag) {
					text = this.resoveDizNft(conversation.content);
				} else {
					text = this.resoveDizNft(conversation.latestMessage);
				}
			} else if (objectName == "RC:LBSMsg") {
				text = "[位置]";
			} else if (objectName == "RC:ImgTextMsg") {
				text = "[连接]";
			} else if (objectName == "RC:VcMsg") {
				text = "[语音]";
			}
			conversation.latestMessage = text;

			//为群聊时,最近消息要显示发信人，对最近消息再次加工
			if (conversationType == "GROUP") {
				if (groupMemberinfo) {
					//有发信人详细信息时
					conversation.latestMessage =
						groupMemberinfo.name + ":" + text;
				} else {
					//如果没有用id取代
					conversation.latestMessage = senderUserId + ":" + text;
				}
			}

			//设置任务头像
			conversation.portrait = user ? user.portrait : "";
			//  alert('resolveCon:'+conversation.latestMessage );
		} catch (e) {
			console.log(JSON.stringify(conversation));
			console.error("resolveCon error:" + e);
		}
		return conversation;
	}

	/**
     * chatDetail.js 1.发送新消息 2.拉去历史消息 3.收到新消息
     * 功能：主要处理聊天页面消息详情
     * */
	resolveMsg(msg) {
		try {
			var message = msg;
			var date = new Date(message.sentTime);
			var h =
				(date.getHours() + "").length === 1
					? "0" + date.getHours()
					: date.getHours();
			var m =
				(date.getMinutes() + "").length === 1
					? "0" + date.getMinutes()
					: date.getMinutes();
			var time = h + ":" + m;
			var dateStr =
				date.getFullYear() +
				"-" +
				(date.getMonth() + 1) +
				"-" +
				date.getDate();
			message.showTime = null;
			//var messageType = message.conversationType;
			//确定消息的具体时间
			if (this.isToday(message.sentTime)) {
				message.showTime = time;
			} else if (this.isYesterday(message.sentTime)) {
				message.showTime = "昨天 " + time;
			} else {
				message.showTime = dateStr + " " + time;
			}

			//确定消息内容
			var text = "";
			var objectName = message.objectName;
			if (objectName == "RC:TxtMsg") {
				text = message.content.text;
				if (text) {
					text = this.replace_em(text);
				}
				message.content.text = text;
			} else if (objectName == "RC:DizNtf") {
				//刚创建讨论组时，讨论组的第一条信息的类型
				text = this.resoveDizNft(message.content);
				message.content.text = text;
			}
		} catch (e) {
			console.error("resolveMsg error:" + e);
			console.error("resolveMsg error:" + JSON.stringify(msg));
		}
		return message;
	}
	play(obj, src) {}
	openImage(src) {}
	// 融云消息类型解析
	msgType(message, operator) {
		switch (message.getMessageType()) {
			case window.RongIMClient.MessageType.TextMessage:
				//return this.stringFormat('<div class="msgBody">{0}</div>', this.initEmotion(this.symbolReplace(message.getContent())));
				return this.initEmotion(
					this.symbolReplace(message.getContent())
				);
			case window.RongIMClient.MessageType.ImageMessage:
				return this.stringFormat(
					'<div class="msgBody">{0}</div>',
					"<img class='imgThumbnail' src='data:image/jpg;base64," +
						message.getContent() +
						"' bigUrl='" +
						message.getImageUri() +
						"'/>"
				);
			case window.RongIMClient.MessageType.VoiceMessage:
				return this.stringFormat(
					'<div class="msgBody voice">{0}</div><a class="button button-icon icon ion-music-note" href="#" onclick="window.RongIMClient.voice.play(\'' +
						message.getContent() +
						"','" +
						message.getDuration() +
						'\')"></a><input type="hidden" value="' +
						message.getContent() +
						'">',
					"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + message.getDuration()
				);
			case window.RongIMClient.MessageType.LocationMessage:
				return this.stringFormat(
					'<div class="msgBody">{0}</div>{1}',
					"[位置消息]" + message.getPoi(),
					"<img src='data:image/png;base64," +
						message.getContent() +
						"'/>"
				);
			case window.RongIMClient.MessageType.DiscussionNotificationMessage:
				// 您收到一条新信息:{"messageType":"DiscussionNotificationMessage","details":{"type":1,"operator":"aaa8925","extension":"apple"},"objectName":"RC:DizNtf"}1 testengine.js:279:3
				var memberStr = message.getDetail().extension;
				if (operator == message.getDetail().operator) {
					return this.stringFormat(
						'<div class="msgBody">你邀请{0}加入了群聊</div>',
						memberStr
					);
				} else {
					memberStr = memberStr.replace(operator, "");
					return this.stringFormat(
						'<div class="msgBody">{0}邀请你{1}加入了群聊</div>',
						message.getDetail().operator,
						memberStr.length > 0 ? "和" + memberStr : ""
					);
				}

			default:
				return (
					'<div class="msgBody">' +
					message.getMessageType().toString() +
					":此消息类型Demo未解析</div>"
				);
		}
	}
	initEmotion(str) {
		var a = document.createElement("span");
		return window.RongIMClient.Expression.retrievalEmoji(str, function(
			img
		) {
			a.appendChild(img.img);
			var str =
				'<span class="RongIMexpression_' +
				img.englishName +
				'">' +
				a.innerHTML +
				"</span>";
			a.innerHTML = "";
			return str;
		});
	}
	symbolReplace(str) {
		if (!str) return "";
		str = str.replace(/&/g, "&amp;");
		str = str.replace(/</g, "&lt;");
		str = str.replace(/>/g, "&gt;");
		str = str.replace(/"/g, "&quot;");
		str = str.replace(/'/g, "&#039;");
		return str;
	}
	replaceSymbol(str) {
		if (!str) return "";
		str = str.replace(/&amp;/g, "&");
		str = str.replace(/&lt;/g, "<");
		str = str.replace(/&gt;/g, ">");
		str = str.replace(/&quot;/g, '"');
		str = str.replace(/&#039;/g, "'");
		str = str.replace(/&nbsp;/g, " ");
		return str;
	}

	//判断是不是今天
	isToday(timeLong) {
		var today = new Date();
		var date = new Date(timeLong);
		var todayStr =
			today.getFullYear() +
			"-" +
			(today.getMonth() + 1) +
			"-" +
			today.getDate();
		var dateStr =
			date.getFullYear() +
			"-" +
			(date.getMonth() + 1) +
			"-" +
			date.getDate();
		return todayStr === dateStr;
	}

	//判断是不是昨天
	isYesterday(timeLong) {
		var today = new Date();
		var date = new Date(timeLong);
		var todayStr =
			today.getFullYear() +
			"-" +
			(today.getMonth() + 1) +
			"-" +
			today.getDate();
		var dateStr =
			date.getFullYear() +
			"-" +
			(date.getMonth() + 1) +
			"-" +
			(date.getDate() + 1);
		return todayStr === dateStr;
	}

	arrayIndexOf(arr, val) {
		for (var i = 0; i < arr.length; i++) {
			if (arr[i] == val) return i;
		}
		return -1;
	}

	arrayRemove(arr, val) {
		var index = this.arrayIndexOf(arr, val);
		if (index > -1) {
			arr.splice(index, 1);
			return arr;
		}
	}

	//字符转码，防止html代码污染和表情的处理
	replace_em(str) {
		str = str.replace(/\</g, "&lt;");
		str = str.replace(/\>/g, "&gt;");
		str = str.replace(/\n/g, "<br/>");
		str = str.replace(
			/\[em_([0-9]*)\]/g,
			'<img src="img/face/$1.gif" border="0" />'
		);
		str = this.getHtmlFace(str);
		return str;
	}

	getHtmlFace(name) {
		if (!name) {
			return name;
		}
		var htmName = name.replace(/\[.+?\]/g, function(a, b) {
			return this.getCls(a);
		});
		return htmName;
	}

	getCls(name) {
		var className = "";
		switch (name) {
			case "[微笑]":
				className = "qqface0";
				break;
			case "[撇嘴]":
				className = "qqface1";
				break;
			case "[色]":
				className = "qqface2";
				break;
			case "[发呆]":
				className = "qqface3";
				break;
			case "[得意]":
				className = "qqface4";
				break;
			case "[流泪]":
				className = "qqface5";
				break;
			case "[害羞]":
				className = "qqface6";
				break;
			case "[闭嘴]":
				className = "qqface7";
				break;
			case "[睡]":
				className = "qqface8";
				break;
			case "[大哭]":
				className = "qqface9";
				break;
			case "[尴尬]":
				className = "qqface10";
				break;

			case "[发怒]":
				className = "qqface11";
				break;
			case "[调皮]":
				className = "qqface12";
				break;
			case "[呲牙]":
				className = "qqface13";
				break;
			case "[惊讶]":
				className = "qqface14";
				break;
			case "[难过]":
				className = "qqface15";
				break;
			case "[酷]":
				className = "qqface16";
				break;
			case "[冷汗]":
				className = "qqface17";
				break;
			case "[抓狂]":
				className = "qqface18";
				break;
			case "[吐]":
				className = "qqface19";
				break;
			case "[偷笑]":
				className = "qqface20";
				break;
			case "[愉快]":
				className = "qqface21";
				break;

			case "[白眼]":
				className = "qqface22";
				break;
			case "[傲慢]":
				className = "qqface23";
				break;
			case "[饥饿]":
				className = "qqface24";
				break;
			case "[困]":
				className = "qqface25";
				break;
			case "[惊恐]":
				className = "qqface26";
				break;
			case "[流汗]":
				className = "qqface27";
				break;
			case "[憨笑]":
				className = "qqface28";
				break;
			case "[悠闲]":
				className = "qqface29";
				break;
			default:
				className = "";
				break;
		}
		if (className == "") {
			return name;
		} else {
			return (
				'<a title="" type="qq" class="chat-face ' + className + '"></a>'
			);
		}
	}

	//比较json结构是否相同
	jsonEqualsStruc(jsonA, jsonB) {
		var p;
		for (p in jsonA) {
			if (typeof jsonB[p] == "undefined") {
				console.info("equalsStruc 1 break by " + p);
				return false;
			}
		}

		for (p in jsonA) {
			if (jsonA[p]) {
				switch (typeof jsonA[p]) {
					case "object":
						if (!this.jsonEqualsStruc(jsonA[p], jsonB[p])) {
							console.info("equalsStruc 2 break by " + p);
							return false;
						}
						break;
					case "function":
						if (typeof jsonB[p] == "undefined") {
							console.info("equalsStruc 3 break by " + p);
							return false;
						}
						break;
					default:
				}
			} else {
				if (typeof jsonA[p] == "undefined" && jsonB[p]) {
					console.info("equalsStruc 4 break by " + p);
					return false;
				}
			}
		}

		for (p in jsonB) {
			if (typeof jsonA[p] == "undefined") {
				console.info("equalsStruc 5 break by " + p);
				return false;
			}
		}

		return true;
	}

	//比较json是否完全相同
	jsonEquals(jsonA, jsonB) {
		var p;
		for (p in jsonA) {
			if (typeof jsonB[p] == "undefined") {
				return false;
			}
		}

		for (p in jsonA) {
			if (jsonA[p]) {
				switch (typeof jsonA[p]) {
					case "object":
						if (!this.jsonEquals(jsonA[p], jsonB[p])) {
							return false;
						}
						break;
					case "function":
						if (
							typeof jsonB[p] == "undefined" ||
							(p != "equals" &&
								jsonA[p].toString() != jsonB[p].toString())
						)
							return false;
						break;
					default:
						if (jsonA[p] != jsonB[p]) {
							return false;
						}
				}
			} else {
				if (typeof jsonA[p] == "undefined" && jsonB[p]) return false;
			}
		}

		for (p in jsonB) {
			if (typeof jsonA[p] == "undefined") {
				return false;
			}
		}

		return true;
	}

	/**
   *  Secure Hash Algorithm (SHA1)
   *  http://www.webtoolkit.info/
   **/
	SHA1(msg) {
		function rotate_left(n, s) {
			var t4 = (n << s) | (n >>> (32 - s));
			return t4;
		}

		function lsb_hex(val) {
			var str = "";
			var i;
			var vh;
			var vl;

			for (i = 0; i <= 6; i += 2) {
				vh = (val >>> (i * 4 + 4)) & 0x0f;
				vl = (val >>> (i * 4)) & 0x0f;
				str += vh.toString(16) + vl.toString(16);
			}
			return str;
		}

		function cvt_hex(val) {
			var str = "";
			var i;
			var v;

			for (i = 7; i >= 0; i--) {
				v = (val >>> (i * 4)) & 0x0f;
				str += v.toString(16);
			}
			return str;
		}

		function Utf8Encode(string) {
			string = string.replace(/\r\n/g, "\n");
			var utftext = "";

			for (var n = 0; n < string.length; n++) {
				var c = string.charCodeAt(n);

				if (c < 128) {
					utftext += String.fromCharCode(c);
				} else if (c > 127 && c < 2048) {
					utftext += String.fromCharCode((c >> 6) | 192);
					utftext += String.fromCharCode((c & 63) | 128);
				} else {
					utftext += String.fromCharCode((c >> 12) | 224);
					utftext += String.fromCharCode(((c >> 6) & 63) | 128);
					utftext += String.fromCharCode((c & 63) | 128);
				}
			}

			return utftext;
		}

		var blockstart;
		var i, j;
		var W = new Array(80);
		var H0 = 0x67452301;
		var H1 = 0xefcdab89;
		var H2 = 0x98badcfe;
		var H3 = 0x10325476;
		var H4 = 0xc3d2e1f0;
		var A, B, C, D, E;
		var temp;

		msg = Utf8Encode(msg);

		var msg_len = msg.length;

		var word_array = new Array();
		for (i = 0; i < msg_len - 3; i += 4) {
			j =
				(msg.charCodeAt(i) << 24) |
				(msg.charCodeAt(i + 1) << 16) |
				(msg.charCodeAt(i + 2) << 8) |
				msg.charCodeAt(i + 3);
			word_array.push(j);
		}

		switch (msg_len % 4) {
			case 0:
				i = 0x080000000;
				break;
			case 1:
				i = (msg.charCodeAt(msg_len - 1) << 24) | 0x0800000;
				break;

			case 2:
				i =
					(msg.charCodeAt(msg_len - 2) << 24) |
					(msg.charCodeAt(msg_len - 1) << 16) |
					0x08000;
				break;

			case 3:
				i =
					(msg.charCodeAt(msg_len - 3) << 24) |
					(msg.charCodeAt(msg_len - 2) << 16) |
					(msg.charCodeAt(msg_len - 1) << 8) |
					0x80;
				break;
		}

		word_array.push(i);

		while (word_array.length % 16 != 14) word_array.push(0);

		word_array.push(msg_len >>> 29);
		word_array.push((msg_len << 3) & 0x0ffffffff);

		for (blockstart = 0; blockstart < word_array.length; blockstart += 16) {
			for (i = 0; i < 16; i++) W[i] = word_array[blockstart + i];
			for (i = 16; i <= 79; i++)
				W[i] = rotate_left(
					W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16],
					1
				);

			A = H0;
			B = H1;
			C = H2;
			D = H3;
			E = H4;

			for (i = 0; i <= 19; i++) {
				temp =
					(rotate_left(A, 5) +
						((B & C) | (~B & D)) +
						E +
						W[i] +
						0x5a827999) &
					0x0ffffffff;
				E = D;
				D = C;
				C = rotate_left(B, 30);
				B = A;
				A = temp;
			}

			for (i = 20; i <= 39; i++) {
				temp =
					(rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ed9eba1) &
					0x0ffffffff;
				E = D;
				D = C;
				C = rotate_left(B, 30);
				B = A;
				A = temp;
			}

			for (i = 40; i <= 59; i++) {
				temp =
					(rotate_left(A, 5) +
						((B & C) | (B & D) | (C & D)) +
						E +
						W[i] +
						0x8f1bbcdc) &
					0x0ffffffff;
				E = D;
				D = C;
				C = rotate_left(B, 30);
				B = A;
				A = temp;
			}

			for (i = 60; i <= 79; i++) {
				temp =
					(rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xca62c1d6) &
					0x0ffffffff;
				E = D;
				D = C;
				C = rotate_left(B, 30);
				B = A;
				A = temp;
			}

			H0 = (H0 + A) & 0x0ffffffff;
			H1 = (H1 + B) & 0x0ffffffff;
			H2 = (H2 + C) & 0x0ffffffff;
			H3 = (H3 + D) & 0x0ffffffff;
			H4 = (H4 + E) & 0x0ffffffff;
		}

		temp =
			cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);

		return temp.toLowerCase();
	}
}
