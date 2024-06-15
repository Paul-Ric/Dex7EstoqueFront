import { Injectable } from '@angular/core';
import { ModalService } from '../../../shared/services/modal/modal.service';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { ModalMessage, ModalTitle } from 'src/app/shared/enums/modal-message';
import { Router } from '@angular/router';
import { CollaboratorService } from 'src/app/shared/services/collaborator/collaborator.service';
import { GetCollaboratorListed } from 'src/app/shared/services/collaborator/models/collaborator_list.response';
import CollaboratorResponse from 'src/app/shared/services/collaborator/models/collaborator.response';
import PutCollaborator from 'src/app/shared/services/collaborator/models/collaborator.put';
import PostCollaborator from 'src/app/shared/services/collaborator/models/collaborator.post';
import { AsDate } from 'src/app/shared/pipes/datePipe';
import { CollaboratorDetailsComponent } from './collaborator-details/collaborator-details.component';
import { LoadingService } from 'src/app/shared/services/loading/loading.service';
import { ResponsiveLayoutService } from 'src/app/shared/services/responsive-layout/layout.service';
import { Location } from '@angular/common';
import { States } from 'src/app/shared/services/address/models/states';
import { BaseResponse } from 'src/app/shared/services/base.response';
import FileMetaData from 'src/app/shared/services/file-management/models/file-metadata';
import { AuthenticationService } from 'src/app/shared/services/authentication/authentication.service';

@Injectable({
  providedIn: 'root',
})
export class CollaboratorsFacade {
  constructor(
    private _service: CollaboratorService,
    public modalService: ModalService,
    public layout: ResponsiveLayoutService,
    private router: Router,
    public loadingService: LoadingService,
    public location: Location,
    private authService: AuthenticationService
  ) {}

  readonly MAX_PAGE_ITEMS = 10;
  readonly USER_TYPES: IUserTypes = {
    Colaborador: 'collaborator',
    Gestor: 'manager',
    Administrativo: 'administrative',
    Externo: 'external',
  };
  readonly States = Object.keys(States);
  readonly LIST_COLUMNS = [
    { name: 'Nome', size: 'auto' },
    { name: 'Tipo', size: '10%' },
    { name: 'Login', size: '10%' },
    { name: 'Cargo', size: '10%' },
    { name: 'Criado', size: '10%' },
    { name: '', size: '120px' },
  ];

  readonly AsDatePipe = new AsDate();

  totalCount: number = 0;
  foundCount: number = 0;
  loading: boolean = true;
  searchText: string = '';
  currentList: Array<GetCollaboratorListed> = [];
  currentOrderedValues: Array<Array<{ display: boolean; content: any }>> = [];

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

  async getById(id: number): Promise<CollaboratorResponse> {
    return await this._service.GetById(id);
  }

  async update(entity: PutCollaborator): Promise<CollaboratorResponse> {
    return await this._service.Update(entity);
  }

  async add(entity: PostCollaborator): Promise<CollaboratorResponse> {
    return await this._service.Add(entity);
  }

  async GetProfilePictureUrl(
    collaboratorId: number
  ): Promise<BaseResponse<string>> {
    return await this._service.GetProfilePictureUrl(collaboratorId);
  }

  async PostProfilePicture(
    collaboratorId: number,
    file: File
  ): Promise<BaseResponse<FileMetaData>> {
    const res = await this._service.PostProfilePicture(collaboratorId, file);

    const loggedUser = this.authService.GetLoggedUser();

    if (loggedUser?.id == collaboratorId)
      this._service.ProfileImageChangedEvent.emit();

    return res;
  }

  async DeleteProfilePicture(collaboratorId:number): Promise<BaseResponse<boolean>>{
    const res = await this._service.DeleteProfilePicture(collaboratorId);

    const loggedUser = this.authService.GetLoggedUser();

    if (loggedUser?.id == collaboratorId)
      this._service.ProfileImageChangedEvent.emit();

    return res;
  }

  async delete(id: number): Promise<CollaboratorResponse> {
    return await this._service.Delete(id);
  }
  //#endregion

  //#region Crud Views
  openNewOs() {
    this.router.navigate(['/app/colaboradores/criar']);
  }

  openEditCollaborator(id: number) {
    this.router.navigate(['/app/colaboradores/editar', id]);
  }

  openViewDetails(id: number) {
    this.loadingService.set(ModalMessage.LOADING_WAIT);
    this.getById(id)
      .then((res) => {
        if (res.success) {
          if (res.data != null) {
            const modalRef = this.modalService.viewDetails(
              CollaboratorDetailsComponent
            );
            modalRef.componentInstance.data = res.data;
            modalRef.componentInstance.editClickEvent.subscribe(
              (val: number) => {
                this.openEditCollaborator(val);
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
      'Não foi possível encontrar o Colaborador especificado...'
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
      { display: true, content: this.mapUserType(item.userType) },
      { display: true, content: item.login },
      { display: true, content: item.role },
      { display: true, content: this.AsDatePipe.transform(item.creationDate) },
    ]);
  }

  mapUserType(type: string): string {
    return (
      Object.keys(this.USER_TYPES).find(
        (k) => this.USER_TYPES[k] === type.toLowerCase()
      ) ?? ''
    );
  }
  //#endregion
}

interface IUserTypes {
  [key: string]: string;
}
