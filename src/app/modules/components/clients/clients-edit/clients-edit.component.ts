import { Component } from '@angular/core';
import { ClientsFacade } from '../clients.facade';
import { ActivatedRoute } from '@angular/router';
import { ModalMessage } from 'src/app/shared/enums/modal-message';
import Client from 'src/app/shared/services/client/models/client';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { GetClient } from 'src/app/shared/services/client/models/client.response';
import PhoneNumber from 'src/app/shared/services/phone-number/models/phone-number';
import Email from 'src/app/shared/services/email/models/email';
import Address from 'src/app/shared/services/address/models/address';
import { HttpErrorResponse } from '@angular/common/http';
import PostClient from 'src/app/shared/services/client/models/client.post';
import PutClient from 'src/app/shared/services/client/models/client.put';
import Collaborator from 'src/app/shared/services/collaborator/models/collaborator';

@Component({
  selector: 'app-clients-edit',
  templateUrl: './clients-edit.component.html',
  styleUrls: ['./clients-edit.component.scss'],
})
export class ClientsEditComponent {
  constructor(
    public facade: ClientsFacade,
    public activeRoute: ActivatedRoute
  ) {
    if (this.facade.getRouteUrl().endsWith('criar')) {
      this.isCreatePage = true;
      this.facade.loadingService.clear();
      return;
    }

    this.facade.loadingService.set(ModalMessage.LOADING_WAIT);
  }

  model: Client = new Client();

  startModel: Client = new Client();

  isCreatePage: boolean = false;
  hasChanges = false;
  hasMoreCollaborators = false;

  ngOnInit() {
    if (this.isCreatePage) {
      this.listCollaborators('');
      return;
    }

    this.activeRoute.params.subscribe((paramMap) => {
      const id = paramMap['id'];
      if (id != null) {
        this.model.id = Number.parseInt(id);
        this.facade
          .getById(this.model.id)
          .then((res) => {
            if (res.success && res.data != null) {
              this.listCollaborators(
                res.data.responsibleCollaborator?.name ?? ''
              );
              this.seed(res.data!);
            } else {
              this.facade.notFoundModal();
            }
          })
          .catch((err) => {
            this.facade.modalService.defaultError(ModalComponent);
          })
          .finally(() => {
            this.facade.loadingService.clear();
          });
      }
    });
  }

  listCollaborators(
    text: string,
    count: number = this.facade.COLLABORATORS_LIST_STEP
  ) {
    this.facade.listCollaborators(count, 0, text).then((res) => {
      this.hasMoreCollaborators =
        this.facade.currentCollaboratorsList.length < res.totalCount;
    });
  }

  seed(entity: GetClient) {
    this.model.id = entity.id;
    this.model.name = entity.name;
    this.model.segment = entity.segment;
    this.model.group = entity.group;
    this.model.speakTo = entity.speakTo;
    this.model.role = entity.role;
    this.model.note = entity.note;
    this.model.cpf = entity.cpf;
    this.model.cnpj = entity.cnpj;
    this.model.responsibleCollaborator =
      entity.responsibleCollaborator ?? new Collaborator();
    this.model.collaboratorId = entity.collaboratorId;
    this.model.addressId = entity.addressId;

    this.model.address = entity.address;
    this.model.phoneNumbers = entity.phoneNumbers;
    this.model.emails = entity.emails;

    this.startModel = structuredClone(this.model);
  }

  inputChanged() {
    this.hasChanges =
      this.model.name != this.startModel.name ||
      this.model.segment != this.startModel.segment ||
      this.model.group != this.startModel.group ||
      this.model.role != this.startModel.role ||
      this.model.speakTo != this.startModel.speakTo ||
      this.model.note != this.startModel.note ||
      this.model.cpf != this.startModel.cpf ||
      this.model.cnpj != this.startModel.cnpj ||
      this.model.collaboratorId != this.startModel.collaboratorId ||
      this.model.responsibleCollaborator?.name !=
        this.startModel.responsibleCollaborator?.name ||
      this.model.addressId != this.startModel.addressId ||
      this.model.address.street != this.startModel.address.street ||
      this.model.address.number != this.startModel.address.number ||
      this.model.address.complement != this.startModel.address.complement ||
      this.model.address.neighborhood != this.startModel.address.neighborhood ||
      this.model.address.city != this.startModel.address.city ||
      this.model.address.state != this.startModel.address.state ||
      this.model.address.cep != this.startModel.address.cep ||
      this.model.phoneNumbers.length != this.startModel.phoneNumbers.length ||
      this.model.emails.length != this.startModel.emails.length;

    if (this.hasChanges) return;

    if (this.model.phoneNumbers.length == this.startModel.phoneNumbers.length) {
      for (let i = 0; i < this.model.phoneNumbers.length; i++) {
        const p1 = this.model.phoneNumbers[i];
        const p2 = this.startModel.phoneNumbers[i];

        if (p1.number != p2.number || p1.isWhatsapp != p2.isWhatsapp) {
          this.hasChanges = true;
          return;
        }
      }
    }

    if (this.model.emails.length == this.startModel.emails.length) {
      for (let i = 0; i < this.model.emails.length; i++) {
        const e1 = this.model.emails[i];
        const e2 = this.startModel.emails[i];

        if (e1.text != e2.text) {
          this.hasChanges = true;
          return;
        }
      }
    }
  }

  onCollaboratorChange(value: string) {
    if (value.length == 0) {
      this.model.responsibleCollaborator = new Collaborator();
      this.model.collaboratorId = undefined;
    }
    this.listCollaborators(value);
    this.inputChanged();
  }

  onCollaboratorComplete() {
    this.model.collaboratorId = 0;
    this.inputChanged();
  }

  onCollaboratorSelect(collaboratorId: number, e: any) {
    if (!e.isUserInput) return;
    this.model.collaboratorId = collaboratorId;
  }

  onSeeMoreCollaborators() {
    this.listCollaborators(
      this.model.responsibleCollaborator?.name ?? '',
      this.facade.currentCollaboratorsList.length +
        this.facade.COLLABORATORS_LIST_STEP
    );
  }

  onStateSelect(state: string, e: any) {
    if (!e.isUserInput) return;
    this.model.address.state = state;
    this.inputChanged();
  }

  onNewPhoneNumber() {
    this.model.phoneNumbers.push(new PhoneNumber());
    this.hasChanges = true;
  }

  onNewEmail() {
    this.model.emails.push(new Email());
    this.hasChanges = true;
  }

  getPhoneMask(number: string) {
    const phone = number.replace(/\D/g, '');
    if (phone.length == 10) return '(00) 0000-00009';
    else return '(00) 0 0000-0000';
  }

  promptDeletePhoneNumber(phone: PhoneNumber) {
    this.facade.modalService.confirmDelete(
      'este telefone',
      () => {
        const index = this.model.phoneNumbers.indexOf(phone, 0);
        this.model.phoneNumbers.splice(index, 1);
        this.hasChanges = true;
      },
      () => {}
    );
  }

  promptDeleteEmail(email: Email) {
    this.facade.modalService.confirmDelete(
      'este email',
      () => {
        const index = this.model.emails.indexOf(email, 0);
        this.model.emails.splice(index, 1);
        this.hasChanges = true;
      },
      () => {}
    );
  }

  promptDiscardChanges() {
    this.facade.modalService.confirmDiscard(
      () => {
        this.model = structuredClone(this.startModel);
        this.hasChanges = false;
      },
      () => {}
    );
  }

  promptClearFields() {
    this.facade.modalService.confirmClear(
      () => {
        this.model.name = '';
        this.model.segment = '';
        this.model.group = '';
        this.model.speakTo = '';
        this.model.role = '';
        this.model.note = '';
        this.model.cpf = '';
        this.model.cnpj = '';
        this.model.collaboratorId = 0;
        this.model.addressId = 0;

        this.model.responsibleCollaborator = new Collaborator();
        this.model.address = new Address();
        this.model.phoneNumbers = [];
        this.model.emails = [];

        this.hasChanges = true;
      },
      () => {}
    );
  }

  onCancel() {
    if (!this.hasChanges) {
      this.facade.location.back();
      return;
    }

    this.facade.modalService.confirmDiscard(
      () => {
        this.facade.location.back();
      },
      () => {}
    );
  }

  onDelete() {
    this.facade.modalService.confirmDelete(
      "este 'Cliente'",
      () => {
        this.deleteEntity(this.model.id);
      },
      () => {}
    );
  }

  deleteEntity(id: number) {
    this.facade
      .delete(id)
      .then((res) => {
        if (res.success) {
          this.facade.modalService.successfulDelete();
          this.facade.location.back();
        }
      })
      .catch((err: HttpErrorResponse) => {
        if (err.status == 400)
          this.facade.modalService.listErrors(err.error.errors);
        else {
          this.facade.modalService.defaultError(ModalComponent);
        }
      })
      .finally(() => {
        this.facade.loadingService.clear();
      });
  }

  onSave() {
    this.facade.loadingService.set(ModalMessage.VALIDATING_WAIT);
    const errors = this.validate();

    if (errors.length > 0) {
      this.facade.loadingService.clear();
      this.facade.modalService.listErrors(errors);
      return;
    }

    this.facade.loadingService.set(ModalMessage.PROCESSING_WAIT);

    if (this.isCreatePage) {
      const entity = new PostClient();
      entity.name = this.model.name;
      entity.name = this.model.name;
      entity.segment = this.model.segment;
      entity.group = this.model.group;
      entity.speakTo = this.model.speakTo;
      entity.role = this.model.role;
      entity.note = this.model.note;
      entity.cpf = this.model.cpf;
      entity.cnpj = this.model.cnpj;
      entity.collaboratorId = this.model.collaboratorId;
      entity.addressId = this.model.addressId;

      entity.address = this.model.address;
      entity.phoneNumbers = this.model.phoneNumbers;
      entity.emails = this.model.emails;

      this.createEntity(entity);
    } else {
      const entity = new PutClient();
      entity.id = this.model.id;
      entity.name = this.model.name;
      entity.name = this.model.name;
      entity.segment = this.model.segment;
      entity.group = this.model.group;
      entity.speakTo = this.model.speakTo;
      entity.role = this.model.role;
      entity.note = this.model.note;
      entity.cpf = this.model.cpf;
      entity.cnpj = this.model.cnpj;
      entity.collaboratorId = this.model.collaboratorId;
      entity.addressId = this.model.addressId;

      entity.address = this.model.address;
      entity.phoneNumbers = this.model.phoneNumbers;
      entity.emails = this.model.emails;

      this.updateEntity(entity);
    }
  }

  updateEntity(entity: PutClient) {
    this.facade
      .update(entity)
      .then((res) => {
        if (res.success) {
          this.facade.modalService.successfulUpdate();
          this.facade.location.back();
        }
      })
      .catch((err: HttpErrorResponse) => {
        if (err.status == 400)
          this.facade.modalService.listErrors(err.error.errors);
        else {
          this.facade.modalService.defaultError(ModalComponent);
        }
      })
      .finally(() => {
        this.facade.loadingService.clear();
      });
  }

  createEntity(entity: PostClient) {
    this.facade
      .add(entity)
      .then((res) => {
        if (res.success) {
          this.facade.modalService.successfullCreate();
          this.facade.location.back();
        }
      })
      .catch((err: HttpErrorResponse) => {
        if (err.status == 400)
          this.facade.modalService.listErrors(err.error.errors);
        else {
          this.facade.modalService.defaultError(ModalComponent);
        }
      })
      .finally(() => {
        this.facade.loadingService.clear();
      });
  }

  validate(): Array<string> {
    const errors = [];
    if (this.model.name.length == 0)
      errors.push('Obrigatório preencher o nome do Cliente!');

    return errors;
  }
}
