import { Entity } from "../../base.entity";
import { BaseResponse } from "../../base.response";

export class GetItemGroupList extends Entity{
  public name: string
  public description: string
}
export default class ItemGroupList extends BaseResponse<Array<GetItemGroupList>>
{}
