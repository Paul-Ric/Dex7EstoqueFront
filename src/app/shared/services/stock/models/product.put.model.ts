import { Entity } from "../../base.entity";

export class ProductPut extends Entity {
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
  public ImageId?:string | null
  public productImage?: File | null;
  public brandId: number;
  public groupCategoryId: number;
  public supplierId: number;
}
