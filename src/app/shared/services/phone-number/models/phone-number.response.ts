import { Entity } from '../../base.entity';
import { BaseResponse } from '../../base.response';

export class GetPhoneNumber extends Entity {
  public number: string = '';
  public isWhatsapp: boolean = false;
}

export default class PhoneNumberResponse extends BaseResponse<GetPhoneNumber>{}
