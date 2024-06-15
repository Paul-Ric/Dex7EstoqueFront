import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { ModalMessage, ModalTitle } from 'src/app/shared/enums/modal-message';
import { ModalService } from 'src/app/shared/services/modal/modal.service';
import PostQuestionnaire from 'src/app/shared/services/questionnaire/models/questionnaire.post';
import PutQuestionnaire from 'src/app/shared/services/questionnaire/models/questionnaire.put';
import QuestionnaireResponse from 'src/app/shared/services/questionnaire/models/questionnaire.response';
import { GetQuestionnaireListed } from 'src/app/shared/services/questionnaire/models/questionnaire_list.response';
import { QuestionnaireService } from 'src/app/shared/services/questionnaire/questionnaire.service';
import { QuestionnaireDetailsComponent } from './questionnaire-details/questionnaire-details.component';
import { LoadingService } from 'src/app/shared/services/loading/loading.service';
import { ResponsiveLayoutService } from 'src/app/shared/services/responsive-layout/layout.service';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class QuestionnairesFacade {
  constructor(
    private _service: QuestionnaireService,
    public modalService: ModalService,
    private router: Router,
    public layout: ResponsiveLayoutService,
    public loadingService: LoadingService,
    public location: Location
  ) {}

  readonly MAX_PAGE_ITEMS = 10;
  readonly ANSWER_TYPES: IAnswerTypes = {
    'Texto': 'text',
    'Sim/Não': 'boolean',
    'Número': 'number',
    'Imagens': 'images',
  };
  readonly LIST_COLUMNS = [
    { name: 'Título', size: 'auto' },
    { name: 'Perguntas', size: '15%' },
    { name: 'Tipos de OS', size: '15%' },
    { name: '', size: '120px' },
  ];

  totalCount: number = 0;
  foundCount: number = 0;
  loading: boolean = true;
  searchText: string = '';
  currentList: Array<GetQuestionnaireListed> = [];
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

  async getById(id: number): Promise<QuestionnaireResponse> {
    return await this._service.GetById(id);
  }

  async update(entity: PutQuestionnaire): Promise<QuestionnaireResponse> {
    return await this._service.Update(entity);
  }

  async add(entity: PostQuestionnaire): Promise<QuestionnaireResponse> {
    return await this._service.Add(entity);
  }

  async delete(id: number): Promise<QuestionnaireResponse> {
    return await this._service.Delete(id);
  }
  //#endregion

  //#region Crud Views
  openNewOs() {
    this.router.navigate(['/app/questionarios/criar']);
  }

  openEditQuestionnaire(id: number) {
    this.router.navigate(['/app/questionarios/editar', id]);
  }

  openViewDetails(id: number) {
    this.loadingService.set(ModalMessage.LOADING_WAIT);
    this.getById(id)
      .then((res) => {
        if (res.success) {
          if (res.data != null) {
            const modalRef = this.modalService.viewDetails(
              QuestionnaireDetailsComponent
            );
            modalRef.componentInstance.data = res.data;
            modalRef.componentInstance.editClickEvent.subscribe(
              (val: number) => {
                this.openEditQuestionnaire(val);
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
      'Não foi possível encontrar o Questionário especificado...'
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
      { display: true, content: item.title },
      { display: true, content: item.questionCount.toString() },
      { display: true, content: item.osTypeCount.toString() },
    ]);
  }
  //#endregion
}

interface IAnswerTypes {
  [key: string]: string;
}
