import { Entity } from "../../base.entity"
import { BaseResponse } from '../../base.response';

export class GetBrand extends Entity{
  public businessName: string
  public description: string
}
export default class BrandResponse extends BaseResponse<GetBrand>{}

