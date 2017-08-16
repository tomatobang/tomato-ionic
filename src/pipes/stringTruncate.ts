import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'StringTruncate'
})
export class StringTruncate implements PipeTransform {

  transform(value?: string, args?: any): any {
    let bitnum = args;
    if(value && value.length > bitnum){
              return value.substr(0,bitnum)+"...";
    }else{
        return value;
    }
  }

}