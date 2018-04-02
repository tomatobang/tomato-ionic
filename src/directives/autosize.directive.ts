import {
  ElementRef,
  HostListener,
  Directive,
  OnInit,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[autoSizeTextarea]',
})
export class AutosizeDirective implements OnInit {
  @HostListener('input', ['$event.target'])
  onInput(textArea: HTMLTextAreaElement): void {
    this.adjust(textArea);
  }

  constructor(public element: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    setTimeout(() => this.adjust(this.element.nativeElement), 0);
  }

  adjust(textArea): void {
    this.renderer.setStyle(textArea, 'overflow', 'hidden');
    this.renderer.setStyle(textArea, 'height', 'auto');
    this.renderer.setStyle(textArea, 'height', textArea.scrollHeight + 'px');
  }
}
