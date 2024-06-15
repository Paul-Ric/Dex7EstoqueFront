import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from 'src/app/shared/services/modal/modal.service';

@Component({
  selector: 'app-view-details-modal',
  templateUrl: './view-details-modal.component.html',
  styleUrls: ['./view-details-modal.component.scss'],
})
export class ViewDetailsModalComponent {
  constructor(
    public activeModal: NgbActiveModal,
    public service: ModalService
  ) {}

  @Input() title: string = 'Detalhes';
  @Input() id: number = 0;

  @Output() okClickEvent = new EventEmitter();
  @Output() editClickEvent = new EventEmitter<number>();

  ngOnInit(): void {}

  onOkClick(): void {
    this.okClickEvent.emit();
    this.onClose();
  }
  onEditClick(): void {
    this.editClickEvent.emit(this.id);
  }

  onClose(): void {
    this.activeModal.close(true);
  }
}
