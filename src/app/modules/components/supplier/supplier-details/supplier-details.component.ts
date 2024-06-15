import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SupplierFacade } from '../supplier.facade';
import Supplier from 'src/app/shared/services/supplier/models/supplier.model';

@Component({
  selector: 'app-supplier-details',
  templateUrl: './supplier-details.component.html',
  styleUrls: ['./supplier-details.component.scss']
})
export class SupplierDetailsComponent {
  constructor(
    public facade: SupplierFacade
  ) {}

  @Input() data: Supplier = new Supplier();
  @Output() editClickEvent = new EventEmitter<number>();

  ngOnInit(){

  }
  onEditClick(id: number) {
    this.editClickEvent.emit(id);
  }
}
