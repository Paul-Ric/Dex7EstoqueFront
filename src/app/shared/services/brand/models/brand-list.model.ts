import { Entity } from "../../base.entity"
import { BaseResponse } from "../../base.response"

export class GetBrandList extends Entity{
  public businessName: string
  public fantasyName: string
}
export default class BrandListResponse extends BaseResponse<Array<GetBrandList>>
{}
