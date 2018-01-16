import {
  Directive,
  Input,
  ElementRef,
  Renderer,
  HostListener,
} from '@angular/core';

@Directive({
  selector: '[qrcodeScanner]',
})
export class ExeBackgroundDirective {
  private _defaultColor = 'yellow';

  @Input('exeBackground') backgroundColor: string; // 输入属性，用于设置元素的背景颜色

  constructor(private elementRef: ElementRef, private renderer: Renderer) {
    this.setStyle(this._defaultColor);
  }

  @HostListener('click')
  onClick() {
    // 监听宿主元素的点击事件，设置元素背景色
    this.setStyle(this.backgroundColor || this._defaultColor);
  }

  private setStyle(color: string) {
    // 调用renderer对象提供的API设置元素的背景颜色
    this.renderer.setElementStyle(
      this.elementRef.nativeElement,
      'backgroundColor',
      color
    );
  }
}
