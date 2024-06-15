import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'asAge',
})
export class AsAge implements PipeTransform {
  public transform(date: Date, ...args: unknown[]): number {
    const birthdate = new Date(date);
    const now = new Date();
    const ageMs = now.getTime() - birthdate.getTime();
    const ageInYears = ageMs / (1000 * 60 * 60 * 24 * 365);
    return Math.floor(ageInYears);
  }
}
