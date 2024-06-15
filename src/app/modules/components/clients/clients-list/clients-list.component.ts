import { Component } from '@angular/core';
import { ClientsFacade } from '../clients.facade';

@Component({
  selector: 'app-clients-list',
  templateUrl: './clients-list.component.html',
  styleUrls: ['./clients-list.component.scss'],
})
export class ClientsListComponent {
  constructor(public facade: ClientsFacade) {}

  ngOnInit() {
    this.facade.loadListView().finally(() => {
      this.facade.loading = false;
    });
  }

  onSearchChange(text: string) {
    this.facade.searchText = text;
    this.facade.searchList(1, text);
  }

  onViewDetailsClick(id: number) {
    this.facade.openViewDetails(id);
  }

  onBtnAddClick() {
    this.facade.openNewOs();
  }

  onEditClick(id: number) {
    this.facade.openEditClient(id);
  }

  onPageSelected(page: number) {
    this.facade.searchList(page, this.facade.searchText);
  }
}
