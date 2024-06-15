import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hasValue',
})
export class HasValue implements PipeTransform {
  public transform(value: any, replace: any, ...args: unknown[]): any {
    let isValid = true;

    if (
      (typeof value === typeof 'string' || Array.isArray(value)) &&
      value.length == 0
    ) {
      isValid = false;
    }

    if (value === undefined || value === null) {
      isValid = false;
    }

    return isValid ? value : replace;
  }
}
