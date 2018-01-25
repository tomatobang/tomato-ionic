import {
  Component,
  ViewChild,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { PinyinService } from '../../providers/utils/pinyin.service';
import { Content } from 'ionic-angular';

@Component({
  selector: 'wave-side-bar',
  templateUrl: 'wave-side-bar.html',
})
export class WaveSideBarComponent {
  @Input('wavadata') waveSideData: any;
  @Output() scrollHandler: EventEmitter<any> = new EventEmitter();

  tipObj = { isShow: false };

  constructor(private pinUtil: PinyinService) {}

  goList(event: any): any {
    let nodeName = event.target.nodeName.toUpperCase();
    if (nodeName !== 'LI') {
      return;
    }
    // 根据坐标来获取元素！
    let elementFromPoint = <HTMLElement>document.elementFromPoint(
      event.changedTouches[0].pageX,
      event.changedTouches[0].pageY
    );
    nodeName = elementFromPoint ? elementFromPoint.nodeName.toUpperCase() : '';
    if (nodeName !== 'LI') {
      return;
    }
    let target = elementFromPoint;
    let firstCode = target.innerHTML.trim();
    let eleID = target.id;
    this.tipObj = this.pinUtil.togglePromptBox(true, firstCode);
    // 根据 ID 定位滑动元素
    let nav_to_elements = document.querySelectorAll('#' + eleID);
    let scrollTop = 0;
    if (nav_to_elements.length >= 1) {
      scrollTop = (<HTMLElement>nav_to_elements[1]).offsetTop;
      this.scrollHandler.emit(scrollTop);
    } else {
      throw 'waveSideBar:the bar a is not exits or more than one';
    }
  }

  hidePromptBox(event: any): any {
    this.tipObj = this.pinUtil.togglePromptBox(false, null);
  }

  goListByTouch(event: any): any {
    let target = event.target;
    let firstCode = target.innerText;
    let id = target.getAttribute('id'); 
    this.tipObj = this.pinUtil.togglePromptBox(true, firstCode);
    let nav_a_obj = document.querySelectorAll('#' + id);
    let scrollTop = 0;
    if (nav_a_obj.length >= 1) {
      scrollTop = (<HTMLElement>nav_a_obj[1]).offsetTop;
      this.scrollHandler.emit(scrollTop);
    } else {
      throw 'waveSideBar:the bar a is not exits or more than one';
    }
  }
}
