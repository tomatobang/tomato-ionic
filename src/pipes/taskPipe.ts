import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'TaskPipe'
})
export class TaskPipe implements PipeTransform {
  transform(value?: any, args?: any): any {
    const flag = args;
    const ret = [];
    for (let index = 0; index < value.length; index++) {
      const element = value[index];
      if (element.isActive === flag) {
        ret.push(element);
      }
    }
    return ret;
  }
}
