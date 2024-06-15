import { Entity } from '../../base.entity';
import { BaseResponse } from '../../base.response';

export class GetServiceOrderListed extends Entity {
  public description: string = '';
  public startDate: Date = new Date();
  public expectedCompletionDate: Date = new Date();
  public collaboratorId: number = 0;
  public clientName: string = '';
  public clientAddress: string = '';
  public osTypeColorHex: string = '';
}

export default class ServiceOrderListResponse extends BaseResponse<Array<GetServiceOrderListed>> {}
