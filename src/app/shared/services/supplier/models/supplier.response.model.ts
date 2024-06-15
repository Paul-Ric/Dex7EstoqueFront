import { Entity } from "../../base.entity";
import { BaseResponse } from "../../base.response";

export class GetSupplier extends Entity{
  public name: string
  public contactPerson: string
  public phone: string
  public email: string
  public address: string
}
export default class SupplierResponse extends BaseResponse<GetSupplier>{}
