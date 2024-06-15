import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
})
export class SideBarComponent {
  constructor(private route: Router) {}
  @Input() opened = false;

  navigate(path: string) {
    this.route.navigate([path]);
  }

  onItemClick() {
  }
  onIconClick() {
  }
}
