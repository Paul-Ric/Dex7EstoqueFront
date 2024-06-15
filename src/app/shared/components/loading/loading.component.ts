import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent {
  @Input() visible: boolean = false;
  @Input() message: string = '';
  @Input() cover: boolean = true;

  ngOnDestroy() {
    this.message = '';
  }
}
