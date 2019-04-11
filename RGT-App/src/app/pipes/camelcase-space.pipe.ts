import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'camelcaseSpace'
})
export class CamelcaseSpacePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let str = value.replace(/([A-Z])/g, ' $1').trim()
    return str;
  }

}
