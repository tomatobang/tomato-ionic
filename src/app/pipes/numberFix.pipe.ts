import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'NumberFix'
})
export class NumberFixPipe implements PipeTransform {
    transform(value?: Number, args?: any): any {
        if (value) {
            return value.toFixed(2);
        }

        return 0;

    }
}
