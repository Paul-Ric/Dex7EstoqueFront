import { Component, EventEmitter, Input, Output } from '@angular/core';
import { KeyValue } from '@angular/common';
import { TableColumn as TableColumn } from './models/table-column';
import { TableCell } from './models/table-cell';


@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.scss'],
})
export class ListViewComponent {
  @Input() title: string = '';
  @Input() registerCount: number = 0;
  @Input() foundCount: number = 0;
  @Input() pageSize: number = 1;
  @Input() btnAddText: string = '';
  @Input() loadingContent: boolean = false;
  @Input() columns: Array<TableColumn> = [];
  @Input() data: Array<Array<TableCell>> = [];

  @Output() searchEvent = new EventEmitter<string>();
  @Output() viewEvent = new EventEmitter<number>();
  @Output() editEvent = new EventEmitter<number>();
  @Output() addNewEvent = new EventEmitter();
  @Output() pageSelectedEvent = new EventEmitter<number>();

  searchText: string = '';

  onSearchChange(query: string) {
    this.searchEvent.emit(query);
  }
  onViewClick(id: number) {
    this.viewEvent.emit(id);
  }
  onEditClick(id: number) {
    this.editEvent.emit(id);
  }
  onBtnAddClick() {
    this.addNewEvent.emit();
  }
  onPageSelected(page:number) {
    this.pageSelectedEvent.emit(page);
  }

  filterProp(prop: any){
    return prop.key != "id";
  }
}
