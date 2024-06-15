import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../services/modal/modal.service';
import { ModalButton } from '../../enums/modal-buttons';
import { ModalMessage, ModalTitle } from '../../enums/modal-message';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  constructor(
    public activeModal: NgbActiveModal,
    public service: ModalService
  ) {}

  @Input() btnOption: ModalButton = ModalButton.OK;
  @Input() title: string = ModalTitle.DEFAULT_ERROR;
  @Input() message: string = ModalMessage.DEFAULT_ERROR;
  @Input() errors: Array<string> = [];
  @Input() errorIcons: Array<string> = [];
  @Input() errorIconColors: Array<string> = [];

  @Output() okClickEvent = new EventEmitter();
  @Output() cancelClickEvent = new EventEmitter();
  @Output() yesClickEvent = new EventEmitter();
  @Output() noClickEvent = new EventEmitter();

  showBtnOk = false;
  showBtnCancel = false;
  showBtnYes = false;
  showBtnNo = false;

  ngOnInit(): void {
    this.showBtnOk = [ModalButton.OK, ModalButton.OK_CANCEL].includes(
      this.btnOption
    );
    this.showBtnCancel = [
      ModalButton.OK_CANCEL,
      ModalButton.YES_NO_CANCEL,
    ].includes(this.btnOption);
    this.showBtnYes = [ModalButton.YES_NO, ModalButton.YES_NO_CANCEL].includes(
      this.btnOption
    );
    this.showBtnNo = [ModalButton.YES_NO, ModalButton.YES_NO_CANCEL].includes(
      this.btnOption
    );
  }

  onOkClick(): void {
    this.okClickEvent.emit();
    this.onClose();
  }
  onCancelClick(): void {
    this.cancelClickEvent.emit();
  }

  onYesClick(): void {
    this.yesClickEvent.emit();
  }
  onNoClick(): void {
    this.noClickEvent.emit();
  }

  onClose(): void {
    this.activeModal.close(true);
  }

  ngOnDestroy(): void {}
}
