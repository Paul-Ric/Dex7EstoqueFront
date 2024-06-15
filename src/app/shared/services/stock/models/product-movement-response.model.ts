import { Entity } from "../../base.entity";

export class ProductMovementResponse extends Entity{
  public quantity: number
  public productId:number
  public movementType:number
  public dateMoviment: Date
}
