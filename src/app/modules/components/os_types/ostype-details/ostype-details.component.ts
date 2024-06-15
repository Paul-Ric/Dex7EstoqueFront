import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import OsType from 'src/app/shared/services/os-type/models/os-type';
import { OsTypesFacade } from '../os-types.facade';

@Component({
  selector: 'app-ostype-details',
  templateUrl: './ostype-details.component.html',
  styleUrls: ['./ostype-details.component.scss'],
})
export class OstypeDetailsComponent {
  constructor(public facade: OsTypesFacade) {}

  @Input() data!: OsType;

  @Output() editClickEvent = new EventEmitter<number>();

  onEditClick(id: number) {
    this.editClickEvent.emit(id);
  }
}
