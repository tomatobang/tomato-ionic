import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[pullToShow]',
})
export class PullToShowDirective {
  constructor(elem: ElementRef, renderer: Renderer2) {
  }
}
