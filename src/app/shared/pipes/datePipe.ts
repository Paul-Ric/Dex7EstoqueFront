import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'asDate',
})
export class AsDate implements PipeTransform {
  public transform(date: Date, ...args: unknown[]): string {
    const _date = new Date(date);

    const day = _date.getDate();
    const month = _date.getMonth() + 1;
    const year = _date.getFullYear();

    const _day = day.toString().padStart(2, '0');
    const _month = month.toString().padStart(2, '0');

    return `${_day}/${_month}/${year}`;
  }
}
