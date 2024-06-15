import { Entity } from '../../base.entity';
import { BaseResponse } from '../../base.response';

export class GetOsTypeListed extends Entity {
  public name: string = '';
  public colorHexCode: string = '';
  public estimatedTime: number = 0;
}

export default class OsTypeListResponse extends BaseResponse<Array<GetOsTypeListed>> {}
