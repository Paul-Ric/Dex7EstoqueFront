import { Component } from '@angular/core';
import { BrandFacade } from '../brands.facade';

@Component({
  selector: 'app-brands-list',
  templateUrl: './brands-list.component.html',
  styleUrls: ['./brands-list.component.scss']
})
export class BrandsListComponent {
  constructor(public facade:BrandFacade){
  }
  ngOnInit() {
    this.getAll()
  }

  public getAll() {
    this.facade.GetAll()
  }
  public onBtnAddClick(){
    this.facade.openCreateBrand()
  }
  public onViewDetailsClick(id: number) {
    this.facade.openViewDetails(id);
  }
  public onEditClick(id: number) {
    this.facade.openEditBrand(id);
  }
}
