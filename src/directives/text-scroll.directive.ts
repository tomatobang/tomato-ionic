import { Directive, ElementRef, AfterViewInit, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[TextScroll]',
})
export class TextScrollDirective implements AfterViewInit {
  _direction: string;
  timer: any;

  @Input() speed: any;

  @Input()
  get direction(): any {
    return this._direction;
  }
  set direction(val) {
    this._direction = val;
  }

  constructor(private element: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    if (this.direction === 'vertical') {
      this.scrollVertical();
    } else {
      this.scrollHorizontal();
    }
  }

  /**
   * 水平滚动
   */
  scrollHorizontal() {
    const nativeElement = this.element.nativeElement;
    const innerBlock = document.createElement('div');
    innerBlock.innerHTML = nativeElement.innerHTML;
    this.renderer.setStyle(nativeElement, 'display', 'block'); // 内联对象需加
    this.renderer.setStyle(nativeElement, 'word-break', 'keep-all');
    this.renderer.setStyle(nativeElement, 'white-space', 'nowrap');
    this.renderer.setStyle(nativeElement, 'overflow', 'hidden');
    this.renderer.setStyle(nativeElement, 'min-height', '24px');
    this.renderer.setStyle(innerBlock, 'position', 'absolute');
    this.element.nativeElement.innerHTML = '';
    this.renderer.appendChild(this.element.nativeElement, innerBlock);

    // 若没有超出父元素宽度则不滑动
    if (innerBlock.offsetWidth <= nativeElement.offsetWidth) {
      return;
    }

    innerBlock.innerHTML += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
    innerBlock.innerHTML += innerBlock.innerHTML;

    this.timer = setInterval(function() {
      innerBlock.style.left = innerBlock.offsetLeft - 1 + 'px';
      if (innerBlock.offsetLeft < -innerBlock.offsetWidth / 2) {
        innerBlock.style.left = '0';
      } else if (innerBlock.offsetLeft > 0) {
        innerBlock.style.left = -innerBlock.offsetWidth / 2 + 'px';
      }
    }, this.speed);
  }

  /**
   * 垂直滚动
   */
  scrollVertical() {
    const iBox = document.createElement('div');
    this.renderer.setStyle(iBox, 'width', '100%');
    this.renderer.setStyle(iBox, 'width', '100%');
    this.renderer.setStyle(iBox, 'overflow', 'overflow');
    this.renderer.setAttribute(iBox, 'id', 'marqueeBoxA');
    iBox.innerHTML = this.element.nativeElement.innerHTML;

    const iBox2 = iBox.cloneNode(true);
    this.renderer.setAttribute(iBox2, 'id', 'marqueeBoxB');

    this.element.nativeElement.innerHTML = '';
    this.renderer.appendChild(this.element.nativeElement, iBox);
    this.renderer.appendChild(this.element.nativeElement, iBox2);

    this.timer = setInterval(() => {
      const nativeElement = this.element.nativeElement;
      if (nativeElement.clientHeight - nativeElement.scrollTop <= 0) {
        nativeElement.scrollTop =
          nativeElement.offsetHeight - nativeElement.scrollTop + 1;
      } else {
        nativeElement.scrollTop++;
        console.log(nativeElement.offsetHeight, nativeElement.scrollTop);
      }
    }, this.speed);
  }

  /**
   * 停止滚动
   */
  stop() {
    clearInterval(this.timer);
  }
}
