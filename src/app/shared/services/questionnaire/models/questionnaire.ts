import { Entity } from '../../base.entity';
import OsType from '../../os-type/models/os-type';
import QuestionnaireQuestion from '../question/models/questionnaire-question';

export default class Questionnaire extends Entity {
  public title: string = '';
  public questions: Array<QuestionnaireQuestion> = [];
  public osTypes: Array<OsType> = [];
}
