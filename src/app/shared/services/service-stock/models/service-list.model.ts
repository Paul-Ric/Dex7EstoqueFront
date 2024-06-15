import { Entity } from "../../base.entity"
import { BaseResponse } from "../../base.response"

export class GetServiceList extends Entity{
  public name: string
  public innercode: number
  public  costValue: number
}
export default class ServiceList extends BaseResponse<Array<GetServiceList>>
{}
