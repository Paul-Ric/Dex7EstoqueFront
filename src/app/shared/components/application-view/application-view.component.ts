import { Component } from '@angular/core';
import { LoadingService } from '../../services/loading/loading.service';

@Component({
  selector: 'application-view',
  templateUrl: './application-view.component.html',
  styleUrls: ['./application-view.component.scss'],
})
export class ApplicationViewComponent {
  constructor(public loadingService: LoadingService) {}

  sideMenuOpened: boolean = false;

  sideMenuToggle(opened: boolean) {
    this.sideMenuOpened = opened;
  }
}
