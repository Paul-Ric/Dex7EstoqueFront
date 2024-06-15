import { Entity } from '../../base.entity';
import { BaseResponse } from '../../base.response';

export class GetChild extends Entity {
  public name: string = '';
  public birthDate: Date = new Date();
  public collaboratorId: number = 0;
}

export default class ChildResponse extends BaseResponse<GetChild>{}
