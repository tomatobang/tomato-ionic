import {
  Component,
  ContentChild,
  Input,
  OnInit,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';

@Component({
  selector: 'timeline-item',
  encapsulation: ViewEncapsulation.Emulated,
  template: `
      <li
        class="tomatobang-timeline-item"
        [class.tomatobang-timeline-item-last]="_lastItem">
        <div class="tomatobang-timeline-item-tail"></div>
        <div class="tomatobang-timeline-item-head"
          [class.tomatobang-timeline-item-head-custom]="_custom"
          [ngClass]="itemHeadClass">
          <ng-template [ngTemplateOutlet]="_customContent">
          </ng-template>
        </div>
        <div class="tomatobang-timeline-item-content">
          <ng-content></ng-content>
        </div>
      </li>`,
  styleUrls: []
})
export class TimelineItemComponent implements OnInit {
  itemHeadClass = { 'tomatobang-timeline-item-head-blue': true };
  _color = 'blue';
  _custom = false;
  _lastItem = false;
  @ContentChild('custom') _customContent: TemplateRef<void>;

  @Input()
  set nzColor(color: string) {
    this._color = color;
    // TODO: There is no removal process, is the result correct?
    if (color === 'green') {
      this.itemHeadClass['tomatobang-timeline-item-head-green'] = true;
    } else if (color === 'red') {
      this.itemHeadClass['tomatobang-timeline-item-head-red'] = true;
    } else {
      this.itemHeadClass['tomatobang-timeline-item-head-blue'] = true;
    }
  }

  get nzColor(): string {
    return this._color;
  }

  ngOnInit(): void {
    if (this._customContent) {
      this._custom = true;
    }
  }
}
