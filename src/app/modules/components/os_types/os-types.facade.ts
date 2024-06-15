import { Injectable } from '@angular/core';
import { GetOsTypeListed } from 'src/app/shared/services/os-type/models/os-type_list.response';
import { ModalService } from '../../../shared/services/modal/modal.service';
import { OsTypeService } from 'src/app/shared/services/os-type/os-type.service';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { OstypeDetailsComponent } from './ostype-details/ostype-details.component';
import OsTypeResponse from 'src/app/shared/services/os-type/models/os-type.response';
import { ModalMessage, ModalTitle } from 'src/app/shared/enums/modal-message';
import { Router } from '@angular/router';
import { TicksToTime } from 'src/app/shared/pipes/ticksToTimePipe';

import PutOsType from 'src/app/shared/services/os-type/models/os-type.put';
import PostOsType from 'src/app/shared/services/os-type/models/os-type.post';
import { QuestionnaireService } from 'src/app/shared/services/questionnaire/questionnaire.service';
import QuestionnaireListResponse, {
  GetQuestionnaireListed,
} from 'src/app/shared/services/questionnaire/models/questionnaire_list.response';
import { LoadingService } from 'src/app/shared/services/loading/loading.service';
import { ResponsiveLayoutService } from 'src/app/shared/services/responsive-layout/layout.service';
import { Location } from '@angular/common';


@Injectable({
  providedIn: 'root',
})
export class OsTypesFacade {
  constructor(
    private _service: OsTypeService,
    public modalService: ModalService,
    private _questionnaireService: QuestionnaireService,
    private router: Router,
    public layout: ResponsiveLayoutService,
    public loadingService: LoadingService,
    public location: Location,
  ) {}

  readonly MAX_PAGE_ITEMS = 10;
  readonly QUESTIONNAIRES_LIST_STEP = 5;
  readonly LIST_COLUMNS = [
    { name: '', size: '20px' },
    { name: 'Nome', size: 'auto' },
    { name: 'Status', size: '10%' },
    { name: '', size: '120px' },
  ];
  readonly TicksToTimePipe = new TicksToTime();

  totalCount: number = 0;
  foundCount: number = 0;
  loading: boolean = true;
  searchText: string = '';
  currentList: Array<GetOsTypeListed> = [];
  currentOrderedValues: Array<Array<{ display: boolean; content: any }>> = [];

  currentQuestionnairesList: Array<GetQuestionnaireListed> = [];

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

  async listQuestionnaires(
    count:number,
    skip: number,
    text: string
  ): Promise<QuestionnaireListResponse> {
    const res = await this._questionnaireService.SearchList(
      text,
      count,
      skip
    );
    if (res.success) {
      this.currentQuestionnairesList = res.data!;
    }
    return res;
  }

  async getById(id: number): Promise<OsTypeResponse> {
    return await this._service.GetById(id);
  }

  async update(entity: PutOsType): Promise<OsTypeResponse> {
    return await this._service.Update(entity);
  }

  async add(entity: PostOsType): Promise<OsTypeResponse> {
    return await this._service.Add(entity);
  }

  async delete(id: number): Promise<OsTypeResponse> {
    return await this._service.Delete(id);
  }
  //#endregion

  //#region Crud Views
  openNewOs() {
    this.router.navigate(['/app/tipos-de-os/criar']);
  }

  openEditOsType(id: number) {
    this.router.navigate(['/app/tipos-de-os/editar', id]);
  }

  openViewDetails(id: number) {
    this.loadingService.set(ModalMessage.LOADING_WAIT);
    this.getById(id)
      .then((res) => {
        if (res.success) {
          if (res.data != null) {
            const modalRef = this.modalService.viewDetails(
              OstypeDetailsComponent
            );
            modalRef.componentInstance.data = res.data;
            modalRef.componentInstance.editClickEvent.subscribe(
              (val: number) => {
                this.openEditOsType(val);
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
      }).finally(() => this.loadingService.clear());
  }
  //#endregion

  //#region Modals
  notFoundModal() {
    this.modalService.customMessage(
      ModalComponent,
      ModalTitle.NOT_FOUND,
      'Não foi possível encontrar o Tipo de OS especificado...'
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
      { display: true, content: 'clrCard#' + item.colorHexCode },
      { display: true, content: item.name },
      { display: true, content: item.isActive ? 'Ativo' : 'Inativo' },
    ]);
  }

  durationToTicks(duration: string): number {
    const [hours, minutes] = duration.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    const ticks = totalMinutes * 60 * 10000000;
    return ticks;
  }

  ticksToDuration(ticks: number) {
    return this.TicksToTimePipe.transform(ticks);
  }

  //#endregion
}
