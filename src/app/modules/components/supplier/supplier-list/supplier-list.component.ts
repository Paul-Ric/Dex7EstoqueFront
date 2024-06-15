import { Component } from '@angular/core';
import { SupplierFacade } from '../supplier.facade';

@Component({
  selector: 'app-supplier-list',
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.scss']
})
export class SupplierListComponent {
  constructor(public facade:SupplierFacade){
  }
  ngOnInit() {
    this.getAll()
  }

  public getAll() {
    this.facade.GetAll()
  }
  public onBtnAddClick(){
    this.facade.openCreateSupplier()
  }
  public onViewDetailsClick(id: number) {
    this.facade.openViewDetails(id);
  }
  public onEditClick(id: number) {
    this.facade.openEditCollaborator(id);
  }


}
