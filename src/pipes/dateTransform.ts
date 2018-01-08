import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "DateTransform"
})
export class DateTransform implements PipeTransform {
  transform(value?: Date, args?: any): any {
    let time = new Date(value).getTime();
    let retTime = time + 8 * 1000 * 60 * 60;
    return new Date(retTime).toLocaleString();
  }
}
