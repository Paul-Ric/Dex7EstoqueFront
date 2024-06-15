import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BrandFacade } from '../brands.facade';
import { Brand } from 'src/app/shared/services/brand/models/brand.model';

@Component({
  selector: 'app-brand-details',
  templateUrl: './brand-details.component.html',
  styleUrls: ['./brand-details.component.scss']
})
export class BrandDetailsComponent {
  constructor(public facade:BrandFacade){
  }
  @Input() data: Brand = new Brand();
  @Output() editClickEvent = new EventEmitter<number>();
  onEditClick(id: number) {
    this.editClickEvent.emit(id);
  }
}
