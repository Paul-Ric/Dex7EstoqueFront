import { Entity } from '../../base.entity';
import { BaseResponse } from '../../base.response';

export class GetClientListed extends Entity {
  public name: string = '';
  public addressSummary: string = '';
  public firstPhone: string = '';
  public firstEmail: string = '';
}

export default class ClientListResponse extends BaseResponse<
  Array<GetClientListed>
> {}
