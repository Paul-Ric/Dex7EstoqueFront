import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'asCEP',
})
export class AsCep implements PipeTransform {
  public transform(number: string, ...args: unknown[]): string {
    return number.slice(0, 5) + '-' + number.slice(5);
  }
}
