import { Component, EventEmitter, Input, Output } from '@angular/core';
import Client from 'src/app/shared/services/client/models/client';
import { ClientsFacade } from '../clients.facade';

@Component({
  selector: 'app-client-details',
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.scss'],
})
export class ClientDetailsComponent {
  constructor(public facade: ClientsFacade) {}

  docsOpened = false;
  addressOpened = false;
  contactOpened = false;

  @Input() data: Client = new Client();

  @Output() editClickEvent = new EventEmitter<number>();

  onEditClick(id: number) {
    this.editClickEvent.emit(id);
  }
}
