import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { ModalMessage, ModalTitle } from 'src/app/shared/enums/modal-message';
import { ModalService } from 'src/app/shared/services/modal/modal.service';
import { LoadingService } from 'src/app/shared/services/loading/loading.service';
import { ResponsiveLayoutService } from 'src/app/shared/services/responsive-layout/layout.service';
import { Location } from '@angular/common';
import { ServiceOrderService } from 'src/app/shared/services/service-order/service-order.service';
import ServiceOrderListResponse, {
  GetServiceOrderListed,
} from 'src/app/shared/services/service-order/models/service-order_list.response';
import ServiceOrderResponse from 'src/app/shared/services/service-order/models/service-order.response';
import PutServiceOrder from 'src/app/shared/services/service-order/models/service-order.put';
import PostServiceOrder from 'src/app/shared/services/service-order/models/service-order.post';
import { CollaboratorService } from 'src/app/shared/services/collaborator/collaborator.service';
import SchedulerCollaboratorsListResponse from 'src/app/shared/services/collaborator/models/scheduler-collaborators_list.response';
import OsTypeListResponse, { GetOsTypeListed } from 'src/app/shared/services/os-type/models/os-type_list.response';
import { OsTypeService } from 'src/app/shared/services/os-type/os-type.service';
import CollaboratorListResponse, { GetCollaboratorListed } from 'src/app/shared/services/collaborator/models/collaborator_list.response';
import ClientListResponse, { GetClientListed } from 'src/app/shared/services/client/models/client_list.response';
import { ClientService } from 'src/app/shared/services/client/client.service';
import RescheduleServiceOrder from 'src/app/shared/services/service-order/models/service-order.reschedule';

@Injectable({
  providedIn: 'root',
})
export class ServiceOrdersFacade {
  constructor(
    private _service: ServiceOrderService,
    private _collaboratorService: CollaboratorService,
    private _osTypeService: OsTypeService,
    private _clientService: ClientService,
    public modalService: ModalService,
    private router: Router,
    public layout: ResponsiveLayoutService,
    public loadingService: LoadingService,
    public location: Location
  ) {}

  totalCount: number = 0;
  foundCount: number = 0;
  loading: boolean = false;
  loadingText: string = '';
  currentList: Array<GetServiceOrderListed> = [];

  currentOsTypesList: Array<GetOsTypeListed> = [];
  currentCollaboratorsList: Array<GetCollaboratorListed> = [];
  currentClientsList: Array<GetClientListed> = [];

  readonly OSTYPE_LIST_STEP = 5;
  readonly COLLABORATORS_LIST_STEP = 5;
  readonly CLIENTS_LIST_STEP = 5;
  readonly OS_STATUS: IKeyValue = {
    pre_booked: 'Pré-Agendada',
    opened: 'Em aberto',
    oncourse: 'A caminho',
    running: 'Em execução',
    finished: 'Finalizada',
    canceled: 'Cancelada',
  };
  readonly OS_PRIORITIES: IKeyValue = {
    low: 'Baixa',
    medium: 'Média',
    high: 'Alta',
  };

  setLoading(text:string){
    this.loading = true;
    this.loadingText = text;
  }

  clearLoading(){
    this.loading = false;
    this.loadingText = '';
  }

  //#region API CRUD
  async GetSchedulerCollaboratorsList(): Promise<SchedulerCollaboratorsListResponse> {
    const res = this._collaboratorService
      .GetSchedulerCollaboratorsList()
      .then((res) => {
        return res;
      });

    return await res;
  }

  async listOsTypes(
    count: number,
    skip: number,
    text: string
  ): Promise<OsTypeListResponse> {
    const res = await this._osTypeService.SearchList(text, count, skip);
    if (res.success) {
      this.currentOsTypesList = res.data!;
    }
    return res;
  }

  async listCollaborators(
    count: number,
    skip: number,
    text: string
  ): Promise<CollaboratorListResponse> {
    const res = await this._collaboratorService.SearchList(text, count, skip);
    if (res.success) {
      this.currentCollaboratorsList = res.data!;
    }
    return res;
  }

  async listClients(
    count: number,
    skip: number,
    text: string
  ): Promise<ClientListResponse> {
    const res = await this._clientService.SearchList(text, count, skip);
    if (res.success) {
      this.currentClientsList = res.data!;
    }
    return res;
  }

  async getByDateRange(start: Date, end: Date): Promise<ServiceOrderListResponse> {
    const res = this._service.GetByDateRange(start, end).then((res) => {
      return res;
    });

    return await res;
  }

  async reschedule(osId:number, collaboratorId: number, startDate: Date, endDate: Date): Promise<ServiceOrderResponse> {
    const data = new RescheduleServiceOrder();
    data.id = osId;
    data.collaboratorId = collaboratorId;
    data.startDate = startDate;
    data.expectedCompletionDate = endDate;
    return await this._service.Reschedule(data);
  }

  async getById(id: number): Promise<ServiceOrderResponse> {
    return await this._service.GetById(id);
  }

  async update(entity: PutServiceOrder): Promise<ServiceOrderResponse> {
    return await this._service.Update(entity);
  }

  async add(entity: PostServiceOrder): Promise<ServiceOrderResponse> {
    return await this._service.Add(entity);
  }

  async delete(id: number): Promise<ServiceOrderResponse> {
    return await this._service.Delete(id);
  }
  //#endregion

  //#region Crud Views
  openNewOs(startTime?: Date, collaboratorId?: number) {
    this.router.navigate(['/app/agendamento/criar-os', { startTime: startTime, collaboratorId: collaboratorId }]);
  }

  openEditOs(id: number) {
    this.router.navigate(['/app/agendamento/editar-os', id]);
  }

  openViewDetails(id: number) {
    this.loadingService.set(ModalMessage.LOADING_WAIT);
    this.getById(id)
      .then((res) => {
        if (res.success) {
          if (res.data != null) {
            const modalRef = this.modalService.viewDetails(ModalComponent);
            modalRef.componentInstance.data = res.data;
            modalRef.componentInstance.editClickEvent.subscribe(
              (val: number) => {
                this.openEditOs(val);
                modalRef.close();
              }
            );
          } else {
            this.notFoundModal();
          }
        } else {
          this.modalService.defaultError(ModalComponent);
        }
      })
      .catch((err) => {
        this.modalService.defaultError(ModalComponent);
      })
      .finally(() => this.loadingService.clear());
  }
  //#endregion

  //#region Modals
  notFoundModal() {
    this.modalService.customMessage(
      ModalComponent,
      ModalTitle.NOT_FOUND,
      'Não foi possível encontrar a Orden de Serviço especificada...'
    );
  }
  //#endregion

  //#region utillity functions
  getRouteUrl() {
    return this.router.url;
  }
  //#endregion
}

interface IKeyValue {
  [key: string]: string;
}
