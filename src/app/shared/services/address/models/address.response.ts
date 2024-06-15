import { Entity } from '../../base.entity';
import { BaseResponse } from '../../base.response';

export class GetAddress extends Entity {
  public cep: string = '';
  public street: string = '';
  public number: number = 0;
  public complement: string = '';
  public neighborhood: string = '';
  public city: string = '';
  public state: string = '';
}

export default class AddressResponse extends BaseResponse<GetAddress>{}
