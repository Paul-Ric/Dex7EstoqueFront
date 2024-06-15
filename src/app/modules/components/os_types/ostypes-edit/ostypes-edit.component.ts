import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import PutOsType from 'src/app/shared/services/os-type/models/os-type.put';
import { OsTypesFacade } from '../os-types.facade';
import { GetOsType } from 'src/app/shared/services/os-type/models/os-type.response';
import { ModalService } from 'src/app/shared/services/modal/modal.service';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { HttpErrorResponse } from '@angular/common/http';
import { ModalMessage, ModalTitle } from 'src/app/shared/enums/modal-message';
import OsType from 'src/app/shared/services/os-type/models/os-type';
import PostOsType from 'src/app/shared/services/os-type/models/os-type.post';

@Component({
  selector: 'app-ostypes-edit',
  templateUrl: './ostypes-edit.component.html',
  styleUrls: ['./ostypes-edit.component.scss'],
})
export class OstypesEditComponent {
  constructor(
    public facade: OsTypesFacade,
    public activeRoute: ActivatedRoute
  ) {
    if (this.facade.getRouteUrl().endsWith('criar')) {
      this.isCreatePage = true;
      this.facade.loadingService.clear();
      return;
    }

    this.facade.loadingService.set(ModalMessage.LOADING_WAIT);
  }

  model: OsType = new OsType();
  toleranceTime: string = '00:00';
  estimatedTime: string = '00:00';

  startModel: OsType = new OsType();
  startToleranceTime: string = '00:00';
  startEstimatedTime: string = '00:00';

  isCreatePage: boolean = false;
  hasChanges = false;
  isColorOpened: boolean = false;
  hasMoreQuestionnaires = false;

  ngOnInit() {
    if (this.isCreatePage) {
      this.facade
        .listQuestionnaires(this.facade.QUESTIONNAIRES_LIST_STEP, 0, '')
        .then((res) => {
          this.hasMoreQuestionnaires =
            this.facade.currentQuestionnairesList.length < res.totalCount;
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
              this.facade
                .listQuestionnaires(
                  this.facade.QUESTIONNAIRES_LIST_STEP,
                  0,
                  res.data.questionnaire.title
                )
                .then((res) => {
                  this.hasMoreQuestionnaires =
                    this.facade.currentQuestionnairesList.length <
                    res.totalCount;
                });
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

  seed(entity: GetOsType) {
    this.model.id = entity.id;
    this.model.name = entity.name;
    this.model.description = entity.description;
    this.model.colorHexCode = '#' + entity.colorHexCode;
    this.model.estimatedTime = entity.estimatedTime;
    this.model.toleranceTime = entity.toleranceTime;
    this.model.questionnaireId = entity.questionnaireId;
    this.model.questionnaire = entity.questionnaire;

    this.toleranceTime = this.facade.ticksToDuration(entity.toleranceTime);
    this.estimatedTime = this.facade.ticksToDuration(entity.estimatedTime);

    this.startModel = structuredClone(this.model);
    this.startToleranceTime = this.toleranceTime;
    this.startEstimatedTime = this.estimatedTime;
  }

  inputChanged() {
    this.hasChanges =
      this.model.name != this.startModel.name ||
      this.model.description != this.startModel.description ||
      this.model.colorHexCode != this.startModel.colorHexCode ||
      this.toleranceTime != this.startToleranceTime ||
      this.estimatedTime != this.startEstimatedTime ||
      this.model.questionnaireId != this.startModel.questionnaireId;
  }

  onQuestionnaireChange(value: string) {
    this.facade
      .listQuestionnaires(this.facade.QUESTIONNAIRES_LIST_STEP, 0, value)
      .then((res) => {
        this.hasMoreQuestionnaires =
          this.facade.currentQuestionnairesList.length < res.totalCount;
      });
    this.inputChanged();
  }

  onQuestionnaireComplete() {
    this.model.questionnaireId = 0;
    this.inputChanged();
  }

  onQuestionnaireSelect(questionnaireId: number, e: any) {
    if (!e.isUserInput) return;
    this.model.questionnaireId = questionnaireId;
  }

  onSeeMoreQuestionnaires() {
    this.facade
      .listQuestionnaires(
        this.facade.currentQuestionnairesList.length +
          this.facade.QUESTIONNAIRES_LIST_STEP,
        0,
        this.model.questionnaire.title
      )
      .then((res) => {
        this.hasMoreQuestionnaires =
          this.facade.currentQuestionnairesList.length < res.totalCount;
      });
  }

  promptDiscardChanges() {
    this.facade.modalService.confirmDiscard(
      () => {
        this.model = structuredClone(this.startModel);
        this.toleranceTime = this.startToleranceTime;
        this.estimatedTime = this.startEstimatedTime;
        this.hasChanges = false;
      },
      () => {}
    );
  }

  promptClearFields() {
    this.facade.modalService.confirmClear(
      () => {
        this.model.name = '';
        this.model.description = '';
        this.model.colorHexCode = '#000000';
        this.model.estimatedTime = 0;
        this.model.toleranceTime = 0;
        this.model.questionnaire.title = '';
        this.model.questionnaireId = 0;

        this.toleranceTime = this.facade.ticksToDuration(0);
        this.estimatedTime = this.facade.ticksToDuration(0);
        this.hasChanges = true;
      },
      () => {}
    );
  }

  toggleColorsOpened() {
    this.isColorOpened = !this.isColorOpened;
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
      "este 'Tipo de OS'",
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
      const entity = new PostOsType();
      entity.name = this.model.name;
      entity.description = this.model.description;
      entity.colorHexCode = this.model.colorHexCode;
      entity.estimatedTimeTicks = this.model.estimatedTime;
      entity.toleranceTimeTicks = this.model.toleranceTime;
      entity.questionnaireId = this.model.questionnaireId;

      this.createEntity(entity);
    } else {
      const entity = new PutOsType();
      entity.id = this.model.id;
      entity.name = this.model.name;
      entity.description = this.model.description;
      entity.colorHexCode = this.model.colorHexCode;
      entity.estimatedTimeTicks = this.model.estimatedTime;
      entity.toleranceTimeTicks = this.model.toleranceTime;
      entity.questionnaireId = this.model.questionnaireId;

      this.updateEntity(entity);
    }
  }

  updateEntity(entity: PutOsType) {
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

  createEntity(entity: PostOsType) {
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
    this.model.toleranceTime = this.facade.durationToTicks(this.toleranceTime);
    this.model.estimatedTime = this.facade.durationToTicks(this.estimatedTime);
    this.model.colorHexCode = this.model.colorHexCode.replace('#', '');

    const errors = [];
    if (this.model.name.length == 0)
      errors.push('Obrigatório preencher o nome do Tipo de OS!');
    if (this.model.estimatedTime > this.model.toleranceTime)
      errors.push(
        'O tempo estimado de execução não pode ser maior que o tempo de tolerância!'
      );
    if (this.model.questionnaireId == 0)
      errors.push('Obrigatório selecionar um Questionário válido!');

    return errors;
  }
}
