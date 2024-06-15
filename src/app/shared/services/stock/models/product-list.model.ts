import { Entity } from "../../base.entity";
import { BaseResponse } from "../../base.response";

export class GetProductList extends Entity {
  public code: number
  public name: string
  public barcode: number
  public costValue: number
  public updatedDate: Date
  public sku: string
}
export default class ProductList extends BaseResponse<Array<GetProductList>>
{ }
