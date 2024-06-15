import { Entity } from '../../base.entity';
import { BaseResponse } from '../../base.response';

export class GetQuestionnaireListed extends Entity {
  public title: string = '';
  public questionCount: number = 0;
  public osTypeCount: number = 0;
}

export default class QuestionnaireListResponse extends BaseResponse<Array<GetQuestionnaireListed>> {}
