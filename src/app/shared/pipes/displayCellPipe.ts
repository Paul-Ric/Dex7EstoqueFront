import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'display',
})
export class DisplayCell implements PipeTransform {
  public transform(values: any[], ...args: unknown[]): any[] {
    return values.filter((x) => x.display === true);
  }
}
