import { Component } from '@angular/core';
import { ItemGroupFacade } from '../item-group.facade';

@Component({
  selector: 'app-item-group-list',
  templateUrl: './item-group-list.component.html',
  styleUrls: ['./item-group-list.component.scss']
})
export class ItemGroupListComponent {
  constructor(
    public facade: ItemGroupFacade
    ) {
  }
  ngOnInit() {
    this.getAll()
  }
  public getAll() {
    this.facade.getAll()
  }
  public onBtnAddClick(){
    this.facade.openCreateItem()
  }
  public onViewDetailsClick(id: number) {
    this.facade.openViewDetails(id);
  }
  public onEditClick(id: number) {
    this.facade.openEditItem(id);
  }
}
