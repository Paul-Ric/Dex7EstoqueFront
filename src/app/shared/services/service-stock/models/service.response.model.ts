import { Entity } from "../../base.entity"
import { BaseResponse } from "../../base.response"

export class GetService extends Entity{
  public name: string
  public innercode: number
  public costValue: number
}
export default class ServiceResponse extends BaseResponse<GetService>
{}
