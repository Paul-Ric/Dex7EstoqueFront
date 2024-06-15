import { Entity } from "../../base.entity"
import { BaseResponse } from "../../base.response"

export class GetProductMovementList extends Entity{
  public quantity: number
  public productId:number| undefined
  public movementType:number
  public dateMoviment: Date
}
export default class ProductMovementList extends BaseResponse<Array<GetProductMovementList>>
{}
