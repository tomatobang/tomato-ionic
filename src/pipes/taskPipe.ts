import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "TaskPipe"
})
export class TaskPipe implements PipeTransform {
  transform(value?: any, args?: any): any {
    let flag = args;
    let ret = [];
    for (var index = 0; index < value.length; index++) {
      var element = value[index];
      if (element.isActive == flag) {
        ret.push(element);
      }
    }
    return ret;
  }
}
