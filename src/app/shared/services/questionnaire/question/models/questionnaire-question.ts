import { Entity } from '../../../base.entity';

export default class QuestionnaireQuestion extends Entity {
  public text: string = '';
  public isAnswerRequired: boolean = false;
  public type: string = '';
  public questionnaireId: number = 0;
}
