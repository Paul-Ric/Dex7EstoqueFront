import { Component } from '@angular/core';
import { SalesFacade } from '../sales.facade';

@Component({
  selector: 'app-sales-order-details',
  templateUrl: './sales-order-details.component.html',
  styleUrls: ['./sales-order-details.component.scss']
})
export class SalesOrderDetailsComponent {
  constructor(public facade:SalesFacade){
  }
}
