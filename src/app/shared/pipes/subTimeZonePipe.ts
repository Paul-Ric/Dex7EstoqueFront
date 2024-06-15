import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'subTimeZone',
})
export class SubTimeZone implements PipeTransform {
  public transform(date: Date, ...args: unknown[]): Date {
    return new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
  }
}
