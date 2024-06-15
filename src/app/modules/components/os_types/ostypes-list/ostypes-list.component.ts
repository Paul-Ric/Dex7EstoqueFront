import { Component } from '@angular/core';
import { OsTypesFacade } from '../os-types.facade';

@Component({
  selector: 'app-ostypes-list',
  templateUrl: './ostypes-list.component.html',
  styleUrls: ['./ostypes-list.component.scss'],
})
export class OstypesListComponent {
  constructor(public facade: OsTypesFacade) {
  }

  ngOnInit() {
    this.facade.loadListView().finally(() => {
      this.facade.loading = false;
    });
  }

  onSearchChange(text: string) {
    this.facade.searchText = text;
    this.facade.searchList(1, text);
  }

  onViewDetailsClick(id:number){
    this.facade.openViewDetails(id);
  }

  onBtnAddClick() {
    this.facade.openNewOs();
  }

  onEditClick(id:number){
    this.facade.openEditOsType(id);
  }

  onPageSelected(page: number) {
    this.facade.searchList(page, this.facade.searchText);
  }
}
