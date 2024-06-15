import { Entity } from "../../base.entity"
import { BaseResponse } from "../../base.response"

export class GetItemGroup extends Entity{
  public name: string
  public description: string
}
export default class ItemGroupResponse extends BaseResponse<GetItemGroup>{}
