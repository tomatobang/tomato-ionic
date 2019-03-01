import { Injectable } from '@angular/core';

@Injectable()
export class EmojiProvider {
  constructor() {
    console.log('Hello EmojiProvider Provider');
  }

  getEmojis() {
    const EMOJIS =
      `😀 😃 😄 😁 😆 😅 😂 🤣 ☺️ 😊 😇 🙂 🙃 😉 😌 😍 😘 ` +
      `😗 😙 😚 😋 😜 😝 😛 🤑 🤗 🤓 😎 🤡 🤠 😏 😒 😞 😔 😟 😕 🙁` +
      `☹️ 😣 😖 😫 😩 😤 😠 😡 😶 😐 😑 😯 😦 😧 😮 😲 😵 😳 😱 😨 😰 ` +
      `😢 😥 🤤 😭 😓 😪 😴 🙄 🤔 🤥 😬 🤐 🤢 🤧 😷 🤒 🤕 😈 👿`;

    const EmojiArr = EMOJIS.split(' ');
    // 每组 24 个
    const groupNum = Math.ceil(EmojiArr.length / 24);
    const items = [];

    for (let i = 0; i < groupNum; i++) {
      items.push(EmojiArr.slice(i * 24, (i + 1) * 24));
    }

    return items;
  }
}
