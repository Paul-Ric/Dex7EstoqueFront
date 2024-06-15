import { Component, EventEmitter, Input, Output } from '@angular/core';
import Questionnaire from 'src/app/shared/services/questionnaire/models/questionnaire';
import { QuestionnairesFacade } from '../questionnaires.facade';

@Component({
  selector: 'app-questionnaire-details',
  templateUrl: './questionnaire-details.component.html',
  styleUrls: ['./questionnaire-details.component.scss'],
})
export class QuestionnaireDetailsComponent {
  constructor(
    public facade: QuestionnairesFacade
  ) {}

  panelOpenState = false;
  @Input() data!: Questionnaire;
  @Output() editClickEvent = new EventEmitter<number>();

  onEditClick(id: number) {
    this.editClickEvent.emit(id);
  }

  getQuestionPreview(text: string) {
    return text.substring(0, 15) + (text.length > 15 ? '...' : '');
  }

  mapQuestionType(type: string): string {
    return (
      Object.keys(this.facade.ANSWER_TYPES).find(
        (k) => this.facade.ANSWER_TYPES[k] === type.toLowerCase()
      ) ?? ''
    );
  }
  mapQuestionTypeIcon(type: string): string {
    switch (type.toLowerCase()) {
      case 'boolean':
        return 'check_circle_outline';
      case 'text':
        return 'insert_comment';
      case 'number':
        return 'filter_1';
      case 'images':
        return 'photo_library';

      default:
        return '';
    }
  }
}
