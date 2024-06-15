import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ClientService } from 'src/app/shared/services/client/client.service';
import { LoadingService } from 'src/app/shared/services/loading/loading.service';
import { ModalService } from 'src/app/shared/services/modal/modal.service';
import { ResponsiveLayoutService } from 'src/app/shared/services/responsive-layout/layout.service';
import { Location } from '@angular/common';
import { GetClientListed } from 'src/app/shared/services/client/models/client_list.response';
import ClientResponse from 'src/app/shared/services/client/models/client.response';
import PutClient from 'src/app/shared/services/client/models/client.put';
import PostClient from 'src/app/shared/services/client/models/client.post';
import { ModalMessage, ModalTitle } from 'src/app/shared/enums/modal-message';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { MaskPipe } from 'ngx-mask';
import { ClientDetailsComponent } from './client-details/client-details.component';
import { States } from 'src/app/shared/services/address/models/states';
import CollaboratorListResponse, {
  GetCollaboratorListed,
} from 'src/app/shared/services/collaborator/models/collaborator_list.response';
import { CollaboratorService } from 'src/app/shared/services/collaborator/collaborator.service';

@Injectable({
  providedIn: 'root',
})
export class ClientsFacade {
  constructor(
    private _service: ClientService,
    private _collaboratorService: CollaboratorService,
    public modalService: ModalService,
    public layout: ResponsiveLayoutService,
    private router: Router,
    public loadingService: LoadingService,
    public location: Location,
    private maskPipe: MaskPipe
  ) {}

  readonly MAX_PAGE_ITEMS = 10;
  readonly COLLABORATORS_LIST_STEP = 5;
  readonly LIST_COLUMNS = [
    { name: 'Nome', size: '20%' },
    { name: 'Endereço', size: 'auto' },
    { name: 'Telefone', size: '15%' },
    { name: 'Email', size: '10%' },
    { name: '', size: '120px' },
  ];
  readonly States = Object.keys(States);

  totalCount: number = 0;
  foundCount: number = 0;
  loading: boolean = true;
  searchText: string = '';
  currentList: Array<GetClientListed> = [];
  currentOrderedValues: Array<Array<{ display: boolean; content: any }>> = [];

  currentCollaboratorsList: Array<GetCollaboratorListed> = [];

  loadListView(): Promise<void> {
    this.loading = true;
    this._service.GetTotalCount().then((res) => {
      this.totalCount = res.data ?? 0;
    });

    return this.searchList(1, '');
  }

  //#region API CRUD
  async searchList(page: number, text: string): Promise<void> {
    this.loading = true;
    try {
      const res = await this._service.SearchList(
        text,
        this.MAX_PAGE_ITEMS,
        (page - 1) * this.MAX_PAGE_ITEMS
      );
      if (res.success) {
        this.currentList = res.data!;
        this.foundCount = res.totalCount;
        this.mapColumns();
      }
    } finally {
      this.loading = false;
    }
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

  async getById(id: number): Promise<ClientResponse> {
    return await this._service.GetById(id);
  }

  async update(entity: PutClient): Promise<ClientResponse> {
    return await this._service.Update(entity);
  }

  async add(entity: PostClient): Promise<ClientResponse> {
    return await this._service.Add(entity);
  }

  async delete(id: number): Promise<ClientResponse> {
    return await this._service.Delete(id);
  }
  //#endregion

  //#region Crud Views
  openNewOs() {
    this.router.navigate(['/app/clientes/criar']);
  }

  openEditClient(id: number) {
    this.router.navigate(['/app/clientes/editar', id]);
  }

  openViewDetails(id: number) {
    this.loadingService.set(ModalMessage.LOADING_WAIT);
    this.getById(id)
      .then((res) => {
        if (res.success) {
          if (res.data != null) {
            const modalRef = this.modalService.viewDetails(
              ClientDetailsComponent
            );
            modalRef.componentInstance.data = res.data;
            modalRef.componentInstance.editClickEvent.subscribe(
              (val: number) => {
                this.openEditClient(val);
                modalRef.close();
              }
            );
          } else {
            this.notFoundModal();
            this.loadListView();
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
      'Não foi possível encontrar o Cliente especificado...'
    );
  }
  //#endregion

  //#region utillity functions
  getRouteUrl() {
    return this.router.url;
  }

  mapColumns() {
    this.currentOrderedValues = this.currentList.map((item) => [
      { display: false, content: item.id },
      { display: true, content: item.name },
      { display: true, content: item.addressSummary },
      { display: true, content: this.getPhoneMask(item.firstPhone) },
      { display: true, content: item.firstEmail ?? "N/A" },
    ]);
  }

  getPhoneMask(number: string) {
    if (number == null || number == undefined || number.length == 0) return "N/A";
    const phone = number.replace(/\D/g, '');

    if (phone.length == 10)
      return this.maskPipe.transform(number, '(00) 0000-00009');
    else return this.maskPipe.transform(number, '(00) 0 0000-0000');
  }
  //#endregion
}

interface IUserTypes {
  [key: string]: string;
}
