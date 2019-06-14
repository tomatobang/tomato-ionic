import {
  ElementRef,
  HostListener,
  Directive,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[autoSizeTextarea]',
})
export class AutosizeDirective {

  constructor(public element: ElementRef, private renderer: Renderer2) { }


  @HostListener('input', ['$event.target'])
  onInput(textArea: HTMLTextAreaElement): void {
    this.adjust(textArea);
  }

  adjust(textArea): void {
    this.renderer.setStyle(textArea, 'overflow', 'hidden');
    this.renderer.setStyle(textArea, 'height', 'auto');
    this.renderer.setStyle(textArea, 'height', textArea.scrollHeight + 'px');
  }
}
