import { Entity } from "../../base.entity";
import { BaseResponse } from "../../base.response";

export class GetProduct extends Entity{
  public code: number;
  public barcode: number;
  public ncm: number;
  public name: string;
  public unit: number;
  public sku: string;
  public productPhysicalLocation: number;
  public minimumStock: number;
  public maximumStock: number;
  public updatedDate: string;
  public costValue: number;
  public cashValue: number;
  public termValue: number;
  public wholesaleValue: number;
  public currentQuantity: number;
  public imageId: string;
}
export default class ProductResponse extends BaseResponse<GetProduct>{}
