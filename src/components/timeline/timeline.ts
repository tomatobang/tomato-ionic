import {
  AfterContentInit,
  Component,
  ContentChild,
  ContentChildren,
  OnInit,
  QueryList,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { TimelineItemComponent } from './timeline-item';

@Component({
  selector: 'timeline',
  encapsulation: ViewEncapsulation.Emulated,
  template: `
      <ul class="tomatobang-timeline" [class.tomatobang-timeline-pending]="_isPending">
        <ng-content></ng-content>
        <div *ngIf="_isPending" class="tomatobang-timeline-pending" >
            <ng-template [ngTemplateOutlet]="_pendingContent">
            </ng-template>
        </div>
      </ul>`,
})
export class TimelineComponent implements OnInit, AfterContentInit {
  _isPending = false;
  items: TimelineItemComponent[] = [];
  @ContentChildren(TimelineItemComponent)
  _listOfTimeline: QueryList<TimelineItemComponent>;
  @ContentChild('pending') _pendingContent: TemplateRef<void>;

  ngOnInit(): void {
    if (this._pendingContent) {
      this._isPending = true;
    }
  }

  ngAfterContentInit(): void {
    setTimeout(_ => {
      if (this._listOfTimeline && this._listOfTimeline.length) {
        const listArray = this._listOfTimeline.toArray();
        listArray[listArray.length - 1]._lastItem = true;
      }
    });
  }
}
