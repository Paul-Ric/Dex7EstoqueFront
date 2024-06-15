import { Component } from '@angular/core';
import { ServiceFacade } from '../service-stock.facade';

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.scss']
})
export class ServiceListComponent {
  constructor(
    public facade: ServiceFacade
  ) { }
  ngOnInit() {
    this.getAll()
  }

  public getAll() {
    this.facade.GetAll()
  }
  public onBtnAddClick(){
    this.facade.openCreateService()
  }
  public onViewDetailsClick(id: number) {
    this.facade.openViewDetails(id);
  }
  public onEditClick(id: number) {
    this.facade.openEditService(id);
  }
}
