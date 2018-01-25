import { Directive, ElementRef, Renderer } from '@angular/core';

@Directive({
  selector: '[scrollHeight]',
})
export class ScrollHeight {
  constructor(elem: ElementRef, renderer: Renderer) {
    renderer.setElementStyle(
      elem.nativeElement,
      'height',
      window.innerHeight - 44 + 'px'
    );
  }
}
