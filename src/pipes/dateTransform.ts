import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'DateTransform'
})
export class DateTransform implements PipeTransform {
  transform(value?: Date, args?: any): any {
    const time = new Date(value).getTime();
    const retTime = time + 8 * 1000 * 60 * 60;
    return new Date(retTime).toLocaleString();
  }
}
