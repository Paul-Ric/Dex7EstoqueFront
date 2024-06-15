import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ServiceFacade } from '../service-stock.facade';
import { Service } from 'src/app/shared/services/service-stock/models/service.model';

@Component({
  selector: 'app-service-details',
  templateUrl: './service-details.component.html',
  styleUrls: ['./service-details.component.scss']
})
export class ServiceDetailsComponent {
  constructor(public facade:ServiceFacade){}
  @Input() data: Service = new Service();
  @Output() editClickEvent = new EventEmitter<number>();
    onEditClick(id: number) {
      this.editClickEvent.emit(id);
    }
}
