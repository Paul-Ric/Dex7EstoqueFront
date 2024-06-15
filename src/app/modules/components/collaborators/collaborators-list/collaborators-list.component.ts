import { Component } from '@angular/core';
import { CollaboratorsFacade } from '../collaborators.facade';

@Component({
  selector: 'app-collaborators-list',
  templateUrl: './collaborators-list.component.html',
  styleUrls: ['./collaborators-list.component.scss'],
})
export class CollaboratorsListComponent {
  constructor(public facade: CollaboratorsFacade) {}

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
    this.facade.openEditCollaborator(id);
  }

  onPageSelected(page: number) {
    this.facade.searchList(page, this.facade.searchText);
  }
}
