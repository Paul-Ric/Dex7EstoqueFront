import { Entity } from '../../base.entity';
import { BaseResponse } from '../../base.response';
import OsType from '../../os-type/models/os-type';
import QuestionnaireQuestion from '../question/models/questionnaire-question';

export class GetQuestionnaire extends Entity {
  public title: string = '';
  public questions: Array<QuestionnaireQuestion> = [];
  public osTypes: Array<OsType> = [];
}

export default class QuestionnaireResponse extends BaseResponse<GetQuestionnaire>{}
