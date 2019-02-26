import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
@Pipe({
  name: 'relativeTime',
})
export class RelativeTimemPipe implements PipeTransform {
  transform(value: string, ...args) {
    return moment(value).toNow();
  }
}
