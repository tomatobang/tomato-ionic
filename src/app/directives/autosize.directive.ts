import {
  ElementRef,
  HostListener,
  Directive,
  Renderer2,
  Input,
} from '@angular/core';

@Directive({
  selector: '[autoSizeTextarea]',
})
export class AutosizeDirective {
  textArea;

  @Input()
  set dataval(val) {
    if (val === '' && this.textArea) {
      if (val === '') {
        this.renderer.setStyle(this.textArea, 'min-height', '45px');
      }
      setTimeout(() => {
        this.adjust(this.textArea);
      }, 100);
    }
  }

  constructor(public element: ElementRef, private renderer: Renderer2) { }


  @HostListener('input', ['$event.target'])
  onInput(textArea: HTMLTextAreaElement): void {
    this.textArea = textArea;
    this.adjust(textArea);
  }

  adjust(textArea): void {
    this.renderer.setStyle(textArea, 'overflow', 'hidden');
    this.renderer.setStyle(textArea, 'height', textArea.scrollHeight + 'px');
  }
}
