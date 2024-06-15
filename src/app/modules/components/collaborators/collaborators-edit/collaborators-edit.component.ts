import { Component } from '@angular/core';
import { CollaboratorsFacade } from '../collaborators.facade';
import { ModalMessage } from 'src/app/shared/enums/modal-message';
import Collaborator from 'src/app/shared/services/collaborator/models/collaborator';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { GetCollaborator } from 'src/app/shared/services/collaborator/models/collaborator.response';
import Address from 'src/app/shared/services/address/models/address';
import { HttpErrorResponse } from '@angular/common/http';
import PostCollaborator from 'src/app/shared/services/collaborator/models/collaborator.post';
import PutCollaborator from 'src/app/shared/services/collaborator/models/collaborator.put';
import { ActivatedRoute } from '@angular/router';
import Child from 'src/app/shared/services/child/models/child';
import PhoneNumber from 'src/app/shared/services/phone-number/models/phone-number';
import Email from 'src/app/shared/services/email/models/email';
import { BaseResponse } from 'src/app/shared/services/base.response';
import FileMetaData from 'src/app/shared/services/file-management/models/file-metadata';

@Component({
  selector: 'app-collaborators-edit',
  templateUrl: './collaborators-edit.component.html',
  styleUrls: ['./collaborators-edit.component.scss'],
})
export class CollaboratorsEditComponent {
  constructor(
    public facade: CollaboratorsFacade,
    public activeRoute: ActivatedRoute
  ) {
    if (this.facade.getRouteUrl().endsWith('criar')) {
      this.isCreatePage = true;
      this.facade.loadingService.clear();
      return;
    }

    this.facade.loadingService.set(ModalMessage.LOADING_WAIT);
  }

  readonly USER_TYPES = Object.entries(this.facade.USER_TYPES);
  model: Collaborator = new Collaborator();
  profilePictureUrl = '';

  startModel: Collaborator = new Collaborator();

  isCreatePage: boolean = false;
  hasChanges = false;

  ngOnInit() {
    this.activeRoute.params.subscribe((paramMap) => {
      const id = paramMap['id'];
      if (id != null) {
        this.model.id = Number.parseInt(id);
        this.facade
          .getById(this.model.id)
          .then((res) => {
            if (res.success && res.data != null) {
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
        this.facade.GetProfilePictureUrl(id).then((res) => {
          if (res.success) {
            this.profilePictureUrl = res.data ?? '';
          }
        });
      }
    });
  }

  seed(entity: GetCollaborator) {
    this.model.id = entity.id;
    this.model.name = entity.name;
    this.model.login = entity.login;
    this.model.password = entity.password ?? '';
    this.model.role = entity.role;
    this.model.rg = entity.rg;
    this.model.cpf = entity.cpf;
    this.model.cnpj = entity.cnpj;
    this.model.pis = entity.pis;
    this.model.isMEI = entity.isMEI;
    this.model.cnh = entity.cnh;
    this.model.wife = entity.wife;
    this.model.salary = entity.salary;
    this.model.comission = entity.comission;
    this.model.hiringDate = entity.hiringDate
      ? new Date(entity.hiringDate)
      : undefined;
    this.model.resignationDate = entity.resignationDate
      ? new Date(entity.resignationDate)
      : undefined;
    this.model.creationDate = this.isCreatePage
      ? new Date()
      : new Date(entity.creationDate ?? '');
    this.model.userType = entity.userType.toLowerCase();
    this.model.profileImageId = entity.profileImageId;
    this.model.addressId = entity.addressId;
    this.model.address = entity.address;
    this.model.children = entity.children;
    this.model.phoneNumbers = entity.phoneNumbers;
    this.model.emails = entity.emails;

    this.startModel = structuredClone(this.model);
  }

  inputChanged() {
    this.hasChanges =
      this.model.name != this.startModel.name ||
      this.model.login != this.startModel.login ||
      this.model.password != this.startModel.password ||
      this.model.role != this.startModel.role ||
      this.model.rg != this.startModel.rg ||
      this.model.cpf != this.startModel.cpf ||
      this.model.cnpj != this.startModel.cnpj ||
      this.model.pis != this.startModel.pis ||
      this.model.isMEI != this.startModel.isMEI ||
      this.model.cnh != this.startModel.cnh ||
      this.model.wife != this.startModel.wife ||
      this.model.salary != this.startModel.salary ||
      this.model.comission != this.startModel.comission ||
      this.model.hiringDate != this.startModel.hiringDate ||
      this.model.resignationDate != this.startModel.resignationDate ||
      this.model.userType != this.startModel.userType ||
      this.model.addressId != this.startModel.addressId ||
      this.model.address.street != this.startModel.address.street ||
      this.model.address.number != this.startModel.address.number ||
      this.model.address.complement != this.startModel.address.complement ||
      this.model.address.neighborhood != this.startModel.address.neighborhood ||
      this.model.address.city != this.startModel.address.city ||
      this.model.address.state != this.startModel.address.state ||
      this.model.address.cep != this.startModel.address.cep ||
      this.model.children.length != this.startModel.children.length ||
      this.model.phoneNumbers.length != this.startModel.phoneNumbers.length ||
      this.model.emails.length != this.startModel.emails.length;

    if (this.hasChanges) return;

    if (this.model.children.length == this.startModel.children.length) {
      for (let i = 0; i < this.model.children.length; i++) {
        const c1 = this.model.children[i];
        const c2 = this.startModel.children[i];

        if (c1.name != c2.name || c1.birthDate != c2.birthDate) {
          this.hasChanges = true;
          return;
        }
      }
    }

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

  onFileChange(event: any) {
    const inputElement: HTMLInputElement = event.target;
    const file: File | null =
      inputElement.files && inputElement.files.length > 0
        ? inputElement.files[0]
        : null;

    if (file) {
      const allowedExtensions = ['png', 'jpg', 'jpeg'];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();

      if (fileExtension && allowedExtensions.includes(fileExtension)) {
        this.model.profileImageFile = file;
        const reader = new FileReader();
        reader.onload = () => {
          this.profilePictureUrl = reader.result as string;
        };
        reader.readAsDataURL(file);
      } else {
        this.facade.modalService.invalidFileExtension(allowedExtensions);
        inputElement.value = '';
      }
    }
  }

  onUserTypeSelect(type: string, e: any) {
    if (!e.isUserInput) return;
    this.model.userType = type;
    this.inputChanged();
  }

  onStateSelect(state: string, e: any) {
    if (!e.isUserInput) return;
    this.model.address.state = state;
    this.inputChanged();
  }

  onNewChild() {
    this.model.children.push(new Child());
    this.hasChanges = true;
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

  promptDeleteImage() {
    this.facade.modalService.confirmDelete(
      'a imagem de perfil',
      () => {
        this.model.profileImageFile = null;
        this.profilePictureUrl = '';
      },
      () => {}
    );
  }

  promptDeleteChild(child: Child) {
    this.facade.modalService.confirmDelete(
      'este filho',
      () => {
        const index = this.model.children.indexOf(child, 0);
        this.model.children.splice(index, 1);
        this.hasChanges = true;
      },
      () => {}
    );
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
        this.model.login = '';
        this.model.password = '';
        this.model.role = '';
        this.model.rg = '';
        this.model.cpf = '';
        this.model.cnpj = '';
        this.model.pis = '';
        this.model.isMEI = false;
        this.model.cnh = '';
        this.model.wife = '';
        this.model.salary = 0;
        this.model.comission = 0;
        this.model.hiringDate = undefined;
        this.model.resignationDate = undefined;
        this.model.userType = '';
        this.model.address = new Address();
        this.model.children = [];
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
      "este 'Colaborador'",
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
      const entity = new PostCollaborator();
      entity.name = this.model.name;
      entity.login = this.model.login;
      entity.password = this.model.password;
      entity.role = this.model.role;
      entity.rg = this.model.rg;
      entity.cpf = this.model.cpf;
      entity.cnpj = this.model.cnpj;
      entity.pis = this.model.pis;
      entity.isMEI = this.model.isMEI;
      entity.cnh = this.model.cnh;
      entity.wife = this.model.wife;
      entity.salary = this.model.salary;
      entity.comission = this.model.comission;
      entity.hiringDate = this.model.hiringDate;
      entity.resignationDate = this.model.resignationDate;
      entity.userType = this.model.userType;
      entity.addressId = this.model.address.id;
      entity.address = this.model.address;
      entity.children = this.model.children;
      entity.phoneNumbers = this.model.phoneNumbers;
      entity.emails = this.model.emails;
      entity.profileImageFile = this.model.profileImageFile;

      this.createEntity(entity);
    } else {
      const entity = new PutCollaborator();
      entity.id = this.model.id;
      entity.name = this.model.name;
      entity.role = this.model.role;
      entity.rg = this.model.rg;
      entity.cpf = this.model.cpf;
      entity.cnpj = this.model.cnpj;
      entity.pis = this.model.pis;
      entity.isMEI = this.model.isMEI;
      entity.cnh = this.model.cnh;
      entity.wife = this.model.wife;
      entity.salary = this.model.salary;
      entity.comission = this.model.comission;
      entity.hiringDate = this.model.hiringDate;
      entity.resignationDate = this.model.resignationDate;
      entity.userType = this.model.userType;
      entity.addressId = this.model.address.id;
      entity.profileImageId = this.model.profileImageId;
      entity.address = this.model.address;
      entity.children = this.model.children;
      entity.phoneNumbers = this.model.phoneNumbers;
      entity.emails = this.model.emails;
      entity.profileImageFile = this.model.profileImageFile;

      this.updateEntity(entity);
    }
  }

  async sendFiles(): Promise<BaseResponse<FileMetaData>> {
    this.facade.loadingService.set(ModalMessage.SENDING_IMAGE_WAIT);
    return this.facade
      .PostProfilePicture(this.model.id, this.model.profileImageFile!)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        this.facade.modalService.defaultError(ModalComponent);
        return err;
      })
      .finally(() => {
        this.facade.loadingService.clear();
      });
  }

  async deleteFile(): Promise<BaseResponse<boolean>> {
    return this.facade
      .DeleteProfilePicture(this.model.id)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        this.facade.modalService.defaultError(ModalComponent);
        return err;
      })
      .finally(() => {
        this.facade.loadingService.clear();
      });
  }

  updateEntity(entity: PutCollaborator) {
    this.facade
      .update(entity)
      .then((res) => {
        if (res.success) {
          if (
            this.model.profileImageFile != null &&
            this.model.profileImageFile != undefined
          ) {
            this.sendFiles().then((res) => {
              if (res.success) {
                this.facade.modalService.successfulUpdate();
                this.facade.location.back();
              }
            });
          } else {
            if (
              this.model.profileImageId != null &&
              this.model.profileImageId != ''
            ) {
              this.deleteFile().then((res) => {
                if (res.success) {
                  this.facade.modalService.successfulUpdate();
                  this.facade.location.back();
                }
              });
            } else {
              this.facade.modalService.successfulUpdate();
              this.facade.location.back();
            }
          }
        }
      })
      .catch((err: HttpErrorResponse) => {
        if (err.status == 400)
          this.facade.modalService.listErrors(err.error.errors);
        else {
          this.facade.modalService.defaultError(ModalComponent);
        }
      });
  }

  createEntity(entity: PostCollaborator) {
    this.facade
      .add(entity)
      .then((res) => {
        if (res.success) {
          if (
            this.model.profileImageFile != null &&
            this.model.profileImageFile != undefined
          ) {
            this.model.id = res.data?.id ?? 0;
            this.sendFiles().then((res) => {
              if (res.success) {
                this.facade.modalService.successfullCreate();
                this.facade.location.back();
              }
            });
          } else {
            this.facade.modalService.successfullCreate();
            this.facade.location.back();
          }
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
      errors.push('Obrigatório preencher o nome do Colaborador!');

    return errors;
  }
}
