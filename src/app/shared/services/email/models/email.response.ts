import { Entity } from '../../base.entity';
import { BaseResponse } from '../../base.response';

export class GetEmail extends Entity {
  public text: string = '';
}

export default class EmailResponse extends BaseResponse<GetEmail>{}
