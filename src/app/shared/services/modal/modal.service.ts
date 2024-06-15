import { Injectable } from '@angular/core';
import {
  NgbActiveModal,
  NgbModal,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import { ModalButton } from '../../enums/modal-buttons';
import { ModalComponent } from '../../components/modal/modal.component';
import { ModalMessage, ModalTitle } from '../../enums/modal-message';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  constructor(
    private ngbModal: NgbModal,
    private activeModal: NgbActiveModal
  ) {}

  closeModal() {
    this.activeModal.close();
  }

  defaultError(component: any): NgbModalRef {
    const modalRef = this.ngbModal.open(component);
    return modalRef;
  }

  viewDetails(component: any): NgbModalRef {
    const modalRef = this.ngbModal.open(component);
    return modalRef;
  }

  customMessage(
    component: any,
    title: string,
    message: string,
    errors: Array<string> = [],
    btnOption: ModalButton = ModalButton.OK
  ): NgbModalRef {
    const modalRef = this.ngbModal.open(component, {
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
    modalRef.componentInstance.errors = errors;
    modalRef.componentInstance.btnOption = btnOption;
    return modalRef;
  }

  successfulUpdate(): NgbModalRef {
    const modalRef = this.customMessage(
      ModalComponent,
      ModalTitle.SUCCESS,
      ModalMessage.SUCCESSFUL_UPDATE
    );
    return modalRef;
  }

  successfullCreate(): NgbModalRef {
    const modalRef = this.customMessage(
      ModalComponent,
      ModalTitle.SUCCESS,
      ModalMessage.SUCCESSFUL_CREATE
    );
    return modalRef;
  }

  successfulDelete(): NgbModalRef {
    const modalRef = this.customMessage(
      ModalComponent,
      ModalTitle.SUCCESS,
      ModalMessage.SUCCESSFUL_DELETE
    );
    return modalRef;
  }

  listErrors(errorsList: Array<string>) {
    const modalRef = this.customMessage(
      ModalComponent,
      ModalTitle.ATTENTION,
      ModalMessage.ONE_MORE_ERRORS,
      errorsList
    );
    return modalRef;
  }

  loginError(message: string = ModalMessage.INVALID_LOGIN) {
    const modalRef = this.customMessage(
      ModalComponent,
      ModalTitle.ATTENTION,
      ModalMessage.LOGIN_ERROR,
      [message]
    );
    return modalRef;
  }

  logoutModal(message: string = ModalMessage.LOGIN_AGAIN) {
    const modalRef = this.customMessage(
      ModalComponent,
      ModalTitle.ACCESS_DENIED,
      message
    );
    return modalRef;
  }

  confirmOperation(
    title: string,
    message: string,
    onYes: () => void,
    onNo: () => void,
    closeAfterChoice: boolean = true
  ) {
    const modalRef = this.customMessage(
      ModalComponent,
      title,
      message,
      [],
      ModalButton.YES_NO
    );

    modalRef.componentInstance.yesClickEvent.subscribe(() => {
      onYes();
      if (closeAfterChoice) modalRef.close();
    });
    modalRef.componentInstance.noClickEvent.subscribe(() => {
      onNo();
      if (closeAfterChoice) modalRef.close();
    });
    return modalRef;
  }

  confirmDiscard(
    onYes: () => void,
    onNo: () => void,
    closeAfterChoice: boolean = true
  ) {
    const modalRef = this.confirmOperation(
      ModalTitle.WARNING,
      ModalMessage.CONFIRM_DISCARD,
      onYes,
      onNo,
      closeAfterChoice
    );

    return modalRef;
  }

  confirmDelete(
    subject: string,
    onYes: () => void,
    onNo: () => void,
    closeAfterChoice: boolean = true
  ) {
    const modalRef = this.confirmOperation(
      ModalTitle.WARNING,
      ModalMessage.CONFIRM_DELETE + subject + '?',
      onYes,
      onNo,
      closeAfterChoice
    );

    return modalRef;
  }

  confirmClear(
    onYes: () => void,
    onNo: () => void,
    closeAfterChoice: boolean = true
  ) {
    const modalRef = this.confirmOperation(
      ModalTitle.WARNING,
      ModalMessage.CONFIRM_CLEAR,
      onYes,
      onNo,
      closeAfterChoice
    );

    return modalRef;
  }

  invalidFileExtension(allowedExtensions: Array<string>) {
    const modalRef = this.customMessage(
      ModalComponent,
      ModalTitle.ATTENTION,
      ModalMessage.INVALID_EXTENSION,
      allowedExtensions
    );
    modalRef.componentInstance.errorIcons = allowedExtensions.map(x => 'check');
    modalRef.componentInstance.errorIconColors = allowedExtensions.map(x => 'green');
    return modalRef;
  }
}
