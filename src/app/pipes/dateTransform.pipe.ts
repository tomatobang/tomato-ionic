import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'DateTransform'
})
export class DateTransformPipe implements PipeTransform {
  transform(value?: Date, args?: any): any {
    const time = new Date(value).getTime();
    const retTime = time;
    if (args && args === 'withdate') {
      return new Date(retTime).toLocaleString();
    } else {
      return new Date(retTime).toLocaleTimeString();
    }
  }
}
