import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TimelineItemComponent } from './timeline-item';
import { TimelineComponent } from './timeline';
@NgModule({
  declarations: [TimelineItemComponent, TimelineComponent],
  exports: [TimelineItemComponent, TimelineComponent],
  imports: [CommonModule]
})
export class TimelineModule {}
