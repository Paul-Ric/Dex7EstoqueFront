import { Entity } from "../../base.entity";
import { BaseResponse } from "../../base.response";

export class GetSupplierList extends Entity{
  public name: string
  public contactPerson: string
}
export default class SupplierList extends BaseResponse<Array<GetSupplierList>>
{}
