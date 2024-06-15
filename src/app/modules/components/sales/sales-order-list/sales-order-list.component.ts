import { Component } from '@angular/core';
import { SalesFacade } from '../sales.facade';

@Component({
  selector: 'app-sales-order-list',
  templateUrl: './sales-order-list.component.html',
  styleUrls: ['./sales-order-list.component.scss']
})
export class SalesOrderListComponent {
  constructor(public facade:SalesFacade){
  }
  ngOnInit() {
    this.getAll()
  }

  public getAll() {
    this.facade.GetAll()
  }
  public onBtnAddClick(){
    this.facade.openCreateSalesOrder()
  }
  public onViewDetailsClick(id: number) {
    this.facade.openViewDetails(id);
  }
}
