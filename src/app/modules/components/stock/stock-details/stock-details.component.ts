import { Component, EventEmitter, Input, Output } from '@angular/core';
import { StockFacade } from '../stock.facade';
import { Product } from 'src/app/shared/services/stock/models/product.model';

@Component({
  selector: 'app-stock-details',
  templateUrl: './stock-details.component.html',
  styleUrls: ['./stock-details.component.scss']
})
export class StockDetailsComponent {

constructor(public facade:StockFacade){}
@Input() data: Product = new Product();
@Output() editClickEvent = new EventEmitter<number>();
  onEditClick(id: number) {
    this.editClickEvent.emit(id);
  }

}
