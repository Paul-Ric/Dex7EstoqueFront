import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ItemGroupFacade } from '../item-group.facade';
import ItemGroup from 'src/app/shared/services/item-group/models/item-group.model';

@Component({
  selector: 'app-item-group-details',
  templateUrl: './item-group-details.component.html',
  styleUrls: ['./item-group-details.component.scss']
})
export class ItemGroupDetailsComponent {
  constructor(
    public facade: ItemGroupFacade
  ) {}

  @Input() data: ItemGroup= new ItemGroup();
  @Output() editClickEvent = new EventEmitter<number>();
  onEditClick(id: number) {
    this.editClickEvent.emit(id);
  }
}
