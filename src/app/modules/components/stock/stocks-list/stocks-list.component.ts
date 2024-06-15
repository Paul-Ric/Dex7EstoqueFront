import { Component } from '@angular/core';
import { StockFacade } from '../stock.facade';
import ProductList from 'src/app/shared/services/stock/models/product-list.model';

@Component({
  selector: 'app-stocks-list',
  templateUrl: './stocks-list.component.html',
  styleUrls: ['./stocks-list.component.scss']
})
export class StocksListComponent {

  constructor(
    public facade: StockFacade
  ) { }
  ngOnInit() {
    this.getAll()
  }

  public getAll() {
    this.facade.GetAll()
  }
  public onBtnAddClick(){
    this.facade.openCreateProduct()
  }
  public onViewDetailsClick(id: number) {
    this.facade.openViewDetails(id);
  }
  public onEditClick(id: number) {
    this.facade.openEditBrand(id);
  }

}
