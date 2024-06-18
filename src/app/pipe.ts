import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'thousandSuff'
})
export class ThousandSuffixesPipe implements PipeTransform {

  transform(input: any, args?: any): any {
    if (Number.isNaN(input)) {
      return null;
    }

    if (input < 1000) {
      return input;
    }

    const suffixes = ['K', 'M', 'B', 'T', 'P', 'E'];

    const exp = Math.floor(Math.log(input) / Math.log(1000));

    const rounded = (input / Math.pow(1000, exp)).toFixed(args);

    return rounded + suffixes[exp - 1];
  }
}
