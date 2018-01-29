import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[scrollHeight]',
})
export class ScrollHeightDirective {
  constructor(elem: ElementRef, renderer: Renderer2) {
    renderer.setAttribute(
      elem.nativeElement,
      'height',
      window.innerHeight - 44 + 'px'
    );
  }
}
