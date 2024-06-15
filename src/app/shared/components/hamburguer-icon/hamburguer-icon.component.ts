import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-hamburguer-icon',
  templateUrl: './hamburguer-icon.component.html',
  styleUrls: ['./hamburguer-icon.component.scss'],
})
export class HamburguerIconComponent {
  @Input() colorHex = '';
  opened: boolean = false;
  @Output() toggleEvent = new EventEmitter<boolean>();

  toggle() {
    this.opened = !this.opened;
    this.toggleEvent.emit(this.opened);
  }
}
