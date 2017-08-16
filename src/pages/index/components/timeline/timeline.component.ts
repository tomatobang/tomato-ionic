/**
 * add by yipeng at 2017
 */

import { Component,Input } from "@angular/core";

@Component({
  selector: "tomatobang-timeline",
  templateUrl: "./timeline.component.html",
  // styleUrls: ["./timeline.component.scss"]
})
export class TimelineComponent {
  @Input()historyTomatoes: Array<any>;
  @Input()tomatoCount: boolean;
  constructor() {}
  ngOnInit() {
  }
}
