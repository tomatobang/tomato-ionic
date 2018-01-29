import { Injectable } from '@angular/core';
declare let pinyin: any;
@Injectable()
export class PinyinService {
  getFromList(list, key, v) {
    if (list instanceof Array) {
      for (let i = 0; i < list.length; i++) {
        if (list[i][key] === v) {
          return { item: i, value: list[i] };
        }
      }
    }
    return null;
  }
  checkForm(obj) {
    const result = [];
    const keys = Object.keys(obj);
    keys.forEach(function(item) {
      if (obj[item]) {
        result.push({ Key: item, Value: obj[item] });
      }
    });
    return result;
  }
  isEmptyObject(e) {
    let t;
    for (const t of  Object.keys(e)) {
      return true;
    }
    return false;
  }

  extend(defaultOpts, opts) {
    defaultOpts = Object.assign(defaultOpts, opts);
    return defaultOpts;
  }
  // WAVE SIDEBAR

  togglePromptBox(flag, value): any {
    if (flag) {
      return { isShow: true, content: value };
    }
    return { isShow: false };
  }

  by(name) {
    return function(o, p) {
      let a, b;
      if (o && p && typeof o === 'object' && typeof p === 'object') {
        a = o[name];
        b = p[name];
        if (a === b) {
          return 0;
        }
        if (typeof a === typeof b) {
          return a < b ? -1 : 1;
        }
        return typeof a < typeof b ? -1 : 1;
      } else {
        throw new Error('waveSideBar:sort the array error');
      }
    };
  }

  /**
   *
   * @param data 数组
   * @param attr 需要按照分类的属性
   */
  sortByFirstCode(data, attr) {
    const ary = [];
    for (let i = 0; i < data.length; i++) {
      const attrValue = data[i][attr];
      if (!attrValue) {
        throw new Error('waveSideBar:this attribute is not exist in data');
      }
      if (typeof attrValue !== 'string' || attrValue.trim().length === 0) {
        // 如果不是string对象，或者是空串，进行特别处理，使用#进行分类
        this.add(ary, '#', data[i]);
      } else {
        // 需要解决为空串的问题:如果是空串，当做非字符串对待,能进入这里说明长度大于0，chatAt(0)可以不做判断了
        const firstCode = pinyin
          .getCamelChars(attrValue)
          .charAt(0)
          .toUpperCase();
        this.isNumber(firstCode)
          ? this.add(ary, '#', data[i])
          : this.add(ary, firstCode, data[i]);
      }
    }
    return ary.sort(this.by('firstCode'));
  }

  isNumber(numStr) {
    const des = '0123456789';
    let bool = false;
    if (des.indexOf(numStr) > -1) {
      bool = true;
    }
    return bool;
  }

  add(ary, firstCode, data) {
    // 问题：表现为#的时候，前台变现为##，不是一个有效的选择器,甚至一些特殊字符也会存在问题，解决办法：增加单独的id字段
    const obj = this.isEleExistInArray(ary, firstCode);
    if (!!obj) {
      obj.data.push(data);
    } else {
      const objForNormal = {
        id: 'waveSideBar' + (ary.length + 1),
        firstCode: firstCode,
        data: [data],
      };
      ary.push(objForNormal);
    }
  }

  isEleExistInArray(ary, c) {
    for (let i = 0; i < ary.length; i++) {
      if (ary[i].firstCode === c) {
        return ary[i];
      }
    }
  }
}
