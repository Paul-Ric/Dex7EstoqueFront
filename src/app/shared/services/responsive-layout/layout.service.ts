import { EventEmitter, Injectable } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ResponsiveLayoutService {
  public onViewportChange = new EventEmitter<ViewPorts>();
  public viewport: ViewPorts = ViewPorts.XS;
  public readonly ViewPorts = ViewPorts;

  public isXS$ = this.Sub(ViewPorts.XS);
  public isSM$ = this.Sub(ViewPorts.SM);
  public isMD$ = this.Sub(ViewPorts.MD);
  public isLG$ = this.Sub(ViewPorts.LG);
  public isXL$ = this.Sub(ViewPorts.XL);

  constructor(public layout: BreakpointObserver) {
    this.layout
      .observe([
        ViewPorts.XS,
        ViewPorts.SM,
        ViewPorts.MD,
        ViewPorts.LG,
        ViewPorts.XL,
      ])
      .subscribe((result) => {
        if (this.HandleBreakpointResult(result, ViewPorts.XS)) return;
        if (this.HandleBreakpointResult(result, ViewPorts.SM)) return;
        if (this.HandleBreakpointResult(result, ViewPorts.MD)) return;
        if (this.HandleBreakpointResult(result, ViewPorts.LG)) return;
        if (this.HandleBreakpointResult(result, ViewPorts.XL)) return;
      });
  }

  Sub(viewport: ViewPorts) {
    return this.layout
      .observe([viewport])
      .pipe(map((result) => result.matches));
  }

  HandleBreakpointResult(result: BreakpointState, observedVP: ViewPorts) {
    if (result.breakpoints[observedVP] && this.viewport != observedVP) {
      this.viewport = observedVP;
      this.onViewportChange.emit(this.viewport);
      console.log(
        'changed to ' +
          Object.keys(ViewPorts)[
            Object.values(ViewPorts).indexOf(observedVP as unknown as ViewPorts)
          ]
      );
    }
    return result.breakpoints[observedVP];
  }

  Fits(views: ViewPorts[] | ViewPorts): boolean {
    if (Array.isArray(views)) {
      let matched = false;
      views.forEach((v) => {
        if (this.viewport == v) {
          matched = true;
        }
      });
      return matched;
    } else {
      return this.viewport == views;
    }
  }
}

export enum ViewPorts {
  XS = '(max-width: 575.98px)',
  SM = '(min-width: 576px) and (max-width: 767.98px)',
  MD = '(min-width: 768px) and (max-width: 991.98px)',
  LG = '(min-width: 992px) and (max-width: 1199.98px)',
  XL = '(min-width: 1200px)',
}
