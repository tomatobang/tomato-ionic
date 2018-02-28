import {
  Component,
  ViewChild,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { PinyinService } from '../../providers/utils/pinyin.service';

@Component({
  selector: 'wave-side-bar',
  templateUrl: 'wave-side-bar.html',
})
export class WaveSideBarComponent {
  @Input() wavadata: any;
  @Output() scrollHandler: EventEmitter<any> = new EventEmitter();

  tipObj = { isShow: true, content: 'A' };

  constructor(private pinUtil: PinyinService) {}

  goList(event: any): any {
    // 根据坐标来获取元素！
    const elementFromPoint = <HTMLElement>document.elementFromPoint(
      event.changedTouches[0].pageX,
      event.changedTouches[0].pageY
    );
    const nodeName = elementFromPoint
      ? elementFromPoint.nodeName.toUpperCase()
      : '';
    if (nodeName !== 'LI') {
      return;
    }
    const target = elementFromPoint;
    const firstCode = target.innerHTML.trim();
    const eleID = target.id;
    this.tipObj = this.pinUtil.togglePromptBox(true, firstCode);
    // 根据 ID 定位滑动元素
    const nav_to_elements = document.querySelectorAll('#' + eleID);
    let scrollTop = 0;
    if (nav_to_elements.length >= 1) {
      scrollTop = (<HTMLElement>nav_to_elements[1]).offsetTop;
      this.scrollHandler.emit(scrollTop);
    } else {
      throw new Error('waveSideBar:the bar a is not exits or more than one');
    }
  }

  hidePromptBox(event: any): any {
    this.tipObj = this.pinUtil.togglePromptBox(false, null);
  }

  goListByTouch(event: any): any {
    const target = event.target;
    const nodeName = target.nodeName.toUpperCase();
    if (nodeName !== 'LI') {
      return;
    }
    const firstCode = target.innerText;
    const id = target.getAttribute('id');
    this.tipObj = this.pinUtil.togglePromptBox(true, firstCode);
    const nav_to_elements = document.querySelectorAll('#' + id);
    let scrollTop = 0;
    if (nav_to_elements.length >= 1) {
      scrollTop = (<HTMLElement>nav_to_elements[1]).offsetTop;
      this.scrollHandler.emit(scrollTop);
    } else {
      throw new Error('waveSideBar:the bar a is not exits or more than one');
    }
  }
}
