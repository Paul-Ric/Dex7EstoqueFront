import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ticksToTime'
})
export class TicksToTime implements PipeTransform {
  public transform(ticks: number, ...args: unknown[]): string {
    const seconds = ticks / 10000000 ;
    const hour = Math.floor(seconds / 3600);
    const minute = Math.floor((seconds / 60) % 60);

    const result = this.pad2(hour) + ':' + this.pad2(minute);
    return result;
  }

  pad2(value: number) {
    const _value = '0' + value;
    return _value.substring(_value.length - 2);
  }
}
