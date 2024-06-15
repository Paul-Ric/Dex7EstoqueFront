import { Component } from '@angular/core';
import { ServiceOrdersFacade } from '../service-order.facade';
import { ActivatedRoute } from '@angular/router';
import { ModalMessage } from 'src/app/shared/enums/modal-message';
import ServiceOrder from 'src/app/shared/services/service-order/models/service-order';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { GetServiceOrder } from 'src/app/shared/services/service-order/models/service-order.response';
import { HttpErrorResponse } from '@angular/common/http';
import PostServiceOrder from 'src/app/shared/services/service-order/models/service-order.post';
import PutServiceOrder from 'src/app/shared/services/service-order/models/service-order.put';
import OsType from 'src/app/shared/services/os-type/models/os-type';
import Collaborator from 'src/app/shared/services/collaborator/models/collaborator';
import Client from 'src/app/shared/services/client/models/client';
import { SubTimeZone } from 'src/app/shared/pipes/subTimeZonePipe';

@Component({
  selector: 'app-service-orders-edit',
  templateUrl: './service-orders-edit.component.html',
  styleUrls: ['./service-orders-edit.component.scss'],
})
export class ServiceOrdersEditComponent {
  constructor(
    public facade: ServiceOrdersFacade,
    public activeRoute: ActivatedRoute,
    private subTimeZonePipe: SubTimeZone
  ) {
    this.facade.loadingService.set(ModalMessage.LOADING_WAIT);
    if (this.facade.getRouteUrl().includes('criar-os')) {
      this.isCreatePage = true;
      this.model.startDate = undefined;
      this.model.expectedCompletionDate = undefined;
    }
  }

  model: ServiceOrder = new ServiceOrder();

  startModel: ServiceOrder = new ServiceOrder();

  readonly OS_STATUS = Object.entries(this.facade.OS_STATUS);
  readonly OS_PRIORITIES = Object.entries(this.facade.OS_PRIORITIES);
  isCreatePage: boolean = false;
  hasChanges = false;
  hasMoreOsTypes = false;
  hasMoreCollaborators = false;
  hasMoreClients = false;

  ngOnInit() {
    let osTypesReady = false,
      collaboratorsReady = false,
      clientsReady = false;

    const checkReady = () => {
      if (osTypesReady && collaboratorsReady && clientsReady) {
        this.facade.loadingService.clear();
      }
    };

    if (this.isCreatePage) {
      this.listOsTypes('').finally(() => {
        osTypesReady = true;
        checkReady();
      });
      this.listCollaborators('').finally(() => {
        collaboratorsReady = true;
        checkReady();
      });
      this.listClients('').finally(() => {
        clientsReady = true;
        checkReady();
      });

      this.activeRoute.params.subscribe((paramMap) => {
        const startTime = paramMap['startTime'];
        const collaboratorId = paramMap['collaboratorId'];

        if (startTime != null) {
          this.model.startDate = new Date(startTime);
          this.model.collaboratorId = Number.parseInt(collaboratorId);
        }
      });

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
              this.listOsTypes(res.data.type.name).finally(() => {
                osTypesReady = true;
                checkReady();
              });
              this.listCollaborators(res.data.responsible.name).finally(() => {
                collaboratorsReady = true;
                checkReady();
              });
              this.listClients(res.data.client.name).finally(() => {
                clientsReady = true;
                checkReady();
              });
              this.seed(res.data);
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

  listOsTypes(text: string, count: number = this.facade.OSTYPE_LIST_STEP) {
    return this.facade.listOsTypes(count, 0, text).then((res) => {
      this.hasMoreOsTypes =
        this.facade.currentOsTypesList.length < res.totalCount;
    });
  }

  listCollaborators(
    text: string,
    count: number = this.facade.COLLABORATORS_LIST_STEP
  ) {
    return this.facade.listCollaborators(count, 0, text).then((res) => {
      this.hasMoreCollaborators =
        this.facade.currentCollaboratorsList.length < res.totalCount;

      this.model.responsible.name =
        this.facade.currentCollaboratorsList.find(
          (x) => x.id == this.model.collaboratorId
        )?.name || '';
    });
  }

  listClients(text: string, count: number = this.facade.CLIENTS_LIST_STEP) {
    return this.facade.listClients(count, 0, text).then((res) => {
      this.hasMoreClients =
        this.facade.currentClientsList.length < res.totalCount;
    });
  }

  seed(entity: GetServiceOrder) {
    this.model.id = entity.id;
    this.model.description = entity.description;
    this.model.workDone = entity.workDone;
    this.model.note = entity.note;
    this.model.startDate = entity.startDate;
    this.model.expectedCompletionDate = entity.expectedCompletionDate;
    this.model.status = entity.status;
    this.model.priority = entity.priority;
    this.model.osTypeId = entity.osTypeId;
    this.model.type = entity.type;
    this.model.collaboratorId = entity.collaboratorId;
    this.model.responsible = entity.responsible;
    this.model.clientId = entity.clientId;
    this.model.client = entity.client;

    this.startModel = structuredClone(this.model);
  }

  inputChanged() {
    let _hasChanges =
      this.model.description != this.startModel.description ||
      this.model.workDone != this.startModel.workDone ||
      this.model.note != this.startModel.note ||
      this.model.startDate != this.startModel.startDate ||
      this.model.expectedCompletionDate !=
        this.startModel.expectedCompletionDate ||
      this.model.status != this.startModel.status ||
      this.model.priority != this.startModel.priority ||
      this.model.osTypeId != this.startModel.osTypeId ||
      this.model.type != this.startModel.type ||
      this.model.collaboratorId != this.startModel.collaboratorId ||
      this.model.clientId != this.startModel.clientId;

    this.hasChanges = _hasChanges;
  }

  setEndTimeByType() {
    if (this.model.startDate && this.model.osTypeId > 0) {
      const type = this.facade.currentOsTypesList.find(
        (x) => x.id == this.model.osTypeId
      )!;

      this.model.expectedCompletionDate = new Date(this.model.startDate);
      this.model.expectedCompletionDate.setTime(
        this.model.startDate.getTime() + type.estimatedTime / 10000
      );
    }
  }

  onOsStatusSelect(status: string, e: any) {
    if (!e.isUserInput) return;
    this.model.status = status;
    this.inputChanged();
  }

  onOsPrioritySelect(priority: string, e: any) {
    if (!e.isUserInput) return;
    this.model.priority = priority;
    this.inputChanged();
  }

  onOsTypeChange(value: string) {
    this.listOsTypes(value);
    this.inputChanged();
  }

  onOsTypeComplete() {
    this.model.osTypeId = 0;
    this.inputChanged();
  }

  onOsTypeSelect(osTypeId: number, e: any) {
    if (!e.isUserInput) return;
    this.model.osTypeId = osTypeId;

    this.setEndTimeByType();
  }

  onSeeMoreOsTypes() {
    this.listOsTypes(
      this.model.type.name,
      this.facade.currentOsTypesList.length + this.facade.OSTYPE_LIST_STEP
    );
  }

  onResponsibleChange(value: string) {
    this.listCollaborators(value);
    this.inputChanged();
  }

  onResponsibleComplete() {
    this.model.collaboratorId = 0;
    this.inputChanged();
  }

  onResponsibleSelect(collaboratorId: number, e: any) {
    if (!e.isUserInput) return;
    this.model.collaboratorId = collaboratorId;
  }

  onSeeMoreCollaborators() {
    this.listCollaborators(
      this.model.responsible.name,
      this.facade.currentCollaboratorsList.length +
        this.facade.COLLABORATORS_LIST_STEP
    );
  }

  onClientChange(value: string) {
    this.listClients(value);
    this.inputChanged();
  }

  onClientComplete() {
    this.model.clientId = 0;
    this.inputChanged();
  }

  onClientSelect(clientId: number, e: any) {
    if (!e.isUserInput) return;
    this.model.clientId = clientId;
  }

  onStartDateChange() {
    this.inputChanged();
    this.setEndTimeByType();
  }

  onSeeMoreClients() {
    this.listClients(
      this.model.client.name,
      this.facade.currentCollaboratorsList.length +
        this.facade.COLLABORATORS_LIST_STEP
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
        this.model.description = '';
        this.model.workDone = '';
        this.model.note = '';
        this.model.startDate = undefined;
        this.model.expectedCompletionDate = undefined;
        this.model.status = '';
        this.model.priority = '';
        this.model.osTypeId = 0;
        this.model.type = new OsType();
        this.model.collaboratorId = 0;
        this.model.responsible = new Collaborator();
        this.model.clientId = 0;
        this.model.client = new Client();
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
      "esta 'Ordem de Serviço'",
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
      const entity = new PostServiceOrder();
      entity.description = this.model.description;
      entity.workDone = this.model.workDone;
      entity.note = this.model.note;
      entity.startDate = this.subTimeZonePipe.transform(
        new Date(this.model.startDate!)
      );
      entity.expectedCompletionDate = this.subTimeZonePipe.transform(
        new Date(this.model.expectedCompletionDate!)
      );
      entity.status = this.model.status;
      entity.priority = this.model.priority;
      entity.osTypeId = this.model.osTypeId;
      entity.collaboratorId = this.model.collaboratorId;
      entity.clientId = this.model.clientId;

      this.createEntity(entity);
    } else {
      const entity = new PutServiceOrder();
      entity.id = this.model.id;
      entity.description = this.model.description;
      entity.workDone = this.model.workDone;
      entity.note = this.model.note;
      entity.startDate = this.subTimeZonePipe.transform(
        new Date(this.model.startDate!)
      );
      entity.expectedCompletionDate = this.subTimeZonePipe.transform(
        new Date(this.model.expectedCompletionDate!)
      );
      entity.status = this.model.status;
      entity.priority = this.model.priority;
      entity.osTypeId = this.model.osTypeId;
      entity.collaboratorId = this.model.collaboratorId;
      entity.clientId = this.model.clientId;

      this.updateEntity(entity);
    }
  }

  updateEntity(entity: PutServiceOrder) {
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

  createEntity(entity: PostServiceOrder) {
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
    if (this.model.description.length == 0)
      errors.push('Obrigatório preencher a descrição da OS!');

    return errors;
  }
}
