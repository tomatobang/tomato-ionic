import { NgModule } from '@angular/core';

import { DateTransformPipe } from './dateTransform.pipe';
import { RelativeTimemPipe } from './relative-time.pipe';
import { StringTruncatemPipe } from './stringTruncate.pipe';
import { TaskPipe } from './task.pipe';
import { NumberFixPipe } from './numberFix.pipe';

export const pipes = [
  DateTransformPipe,
  RelativeTimemPipe,
  StringTruncatemPipe,
  TaskPipe,
  NumberFixPipe,
];

@NgModule({
  declarations: [pipes],
  exports: [pipes],
})
export class PipesModule { }


