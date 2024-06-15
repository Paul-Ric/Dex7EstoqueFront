import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuestionnairesFacade } from '../questionnaires.facade';
import { ModalMessage } from 'src/app/shared/enums/modal-message';
import Questionnaire from 'src/app/shared/services/questionnaire/models/questionnaire';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { GetQuestionnaire } from 'src/app/shared/services/questionnaire/models/questionnaire.response';
import { HttpErrorResponse } from '@angular/common/http';
import PostQuestionnaire from 'src/app/shared/services/questionnaire/models/questionnaire.post';
import PutQuestionnaire from 'src/app/shared/services/questionnaire/models/questionnaire.put';
import QuestionnaireQuestion from 'src/app/shared/services/questionnaire/question/models/questionnaire-question';

@Component({
  selector: 'app-questionnaires-edit',
  templateUrl: './questionnaires-edit.component.html',
  styleUrls: ['./questionnaires-edit.component.scss'],
})
export class QuestionnairesEditComponent {
  constructor(
    public facade: QuestionnairesFacade,
    public activeRoute: ActivatedRoute
  ) {
    if (this.facade.getRouteUrl().endsWith('criar')) {
      this.isCreatePage = true;
      this.facade.loadingService.clear();
      return;
    }

    this.facade.loadingService.set(ModalMessage.LOADING_WAIT);
  }

  model: Questionnaire = new Questionnaire();

  startModel: Questionnaire = new Questionnaire();

  isCreatePage: boolean = false;
  hasChanges = false;

  readonly ANSWER_TYPES = Object.entries(this.facade.ANSWER_TYPES);

  ngOnInit() {
    if (this.isCreatePage) return;

    this.activeRoute.params.subscribe((paramMap) => {
      const id = paramMap['id'];
      if (id != null) {
        this.model.id = Number.parseInt(id);
        this.facade
          .getById(this.model.id)
          .then((res) => {
            if (res.success && res.data != null) {
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

  seed(entity: GetQuestionnaire) {
    this.model.id = entity.id;
    this.model.title = entity.title;
    this.model.questions = entity.questions;

    this.startModel = structuredClone(this.model);
  }

  onNewQuestion() {
    this.model.questions.push(new QuestionnaireQuestion());
    this.hasChanges = true;
  }

  promptDeleteQuestion(question: QuestionnaireQuestion) {
    this.facade.modalService.confirmDelete(
      'esta pergunta',
      () => {
        const index = this.model.questions.indexOf(question, 0);
        this.model.questions.splice(index, 1);
        this.hasChanges = true;
      },
      () => {}
    );
  }

  onAnswerTypeSelect(question: QuestionnaireQuestion, option: string, e: any) {
    if (!e.isUserInput) return;

    const startQuestion = this.startModel.questions.find(
      (x) => x.id == question.id
    )!;
    if (startQuestion != undefined) {
      this.hasChanges = startQuestion.type.toLocaleLowerCase() != option;
    } else {
      this.hasChanges = true;
    }
    question.type = option;
  }

  onAnswerRequiredToggle(question: QuestionnaireQuestion) {
    const startQuestion = this.startModel.questions.find(
      (x) => x.id == question.id
    )!;
    if (startQuestion != undefined) {
      this.hasChanges =
        startQuestion.isAnswerRequired != question.isAnswerRequired;
    }
  }

  inputChanged() {
    let _hasChanges =
      this.model.title != this.startModel.title ||
      this.model.questions.length != this.startModel.questions.length;

    if (this.model.questions.length == this.startModel.questions.length) {
      for (let i = 0; i < this.model.questions.length; i++) {
        const q1 = this.model.questions[i];
        const q2 = this.startModel.questions[i];

        if (
          q1.text != q2.text ||
          q1.isAnswerRequired != q2.isAnswerRequired ||
          q1.type.toLocaleLowerCase() != q2.type.toLocaleLowerCase()
        ) {
          _hasChanges = true;
        }
      }
    }

    this.hasChanges = _hasChanges;
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
        this.model.title = '';
        this.model.questions = [];
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
      "este 'Questionário'",
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
      const entity = new PostQuestionnaire();
      entity.title = this.model.title;
      entity.questions = this.model.questions;

      this.createEntity(entity);
    } else {
      const entity = new PutQuestionnaire();
      entity.id = this.model.id;
      entity.title = this.model.title;
      entity.questions = this.model.questions;

      this.updateEntity(entity);
    }
  }

  updateEntity(entity: PutQuestionnaire) {
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

  createEntity(entity: PostQuestionnaire) {
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
    if (this.model.title.length == 0)
      errors.push('Obrigatório preencher o título do Questionário!');
    if (this.model.questions.length == 0)
      errors.push('Obrigatório ao menos uma pergunta!');

    this.model.questions.forEach((question) => {
      if (question.text.length == 0)
        errors.push('Obrigatório preencher o texto da pergunta!');
      if (
        !Object.values(this.ANSWER_TYPES).some(
          ([_, value]) => value === question.type.toLowerCase()
        )
      ) {
        errors.push('Obrigatório escolher um tipo de resposta!');
      }
    });

    return errors;
  }
}
